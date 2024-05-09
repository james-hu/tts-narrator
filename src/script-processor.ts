/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ConsoleLineLogger, consoleWithColour } from '@handy-common-utils/misc-utils';
import { CommandOptions } from '@handy-common-utils/oclif-utils';
import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { MultiRange } from 'multi-integer-range';
import * as murmurhash from 'murmurhash';
import * as fs from 'node:fs';
import path from 'node:path';
// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts';

import { getAudioFileDuration, playMp3File } from './audio-utils';
import { AzureAudioGenerationOptions, AzureTtsService } from './azure-tts-service';
import { NarrationParagraph, NarrationScript, loadScript } from './narration-script';
import { AudioGenerationOptions, TtsService } from './tts-service';

export enum TtsServiceType {
  Azure = 'azure'
}

/**
 * CLI flags that are required/used by the ScriptProcessor.
 */
export const scriptProcessorFlags = {
  debug: Flags.boolean({ char: 'd', description: 'output debug information' }),
  quiet: Flags.boolean({ char: 'q', description: 'output warn and error information only' }),

  service: Flags.string({ char: 's', options: Object.entries(TtsServiceType).map(([_name, value]) => value), description: 'text-to-speech service to use' }),
  'subscription-key': Flags.string({ char: 'k', description: 'Azure Speech service subscription key' }),
  'subscription-key-env': Flags.string({ description: 'Name of the environment variable that holds the subscription key' }),
  region: Flags.string({ char: 'r', description: 'region of the text-to-speech service' }),

  play: Flags.boolean({ char: 'p', default: true, allowNo: true, description: 'play generated audio' }),
  interactive: Flags.boolean({ char: 'i', default: false, description: 'wait for key press before entering each section' }),

  overwrite: Flags.boolean({ char: 'o', default: false, description: 'always overwrite previously generated audio files' }),
  'dry-run': Flags.boolean({ default: false, description: 'don\'t try to generate or play audio' }),
  ssml: Flags.boolean({ default: false, exclusive: ['quiet'], description: 'display generated SSML' }),

  chapters: Flags.string({ description: 'list of chapters to process, examples: "1-10,13,15", "4-"' }),
  sections: Flags.string({ description: 'list of sections to process, examples: "1-10,13,15", "5-"' }),
};

export class ScriptProcessor {
  protected cliConsole: ConsoleLineLogger;
  protected ttsService!: TtsService;
  protected audioGenerationOptions: AudioGenerationOptions|undefined;
  protected _script!: NarrationScript;
  protected chapterRange: MultiRange|undefined;
  protected sectionRange: MultiRange|undefined;

  constructor(protected scriptFilePath: string, protected flags: CommandOptions<{ flags: typeof scriptProcessorFlags}>['flags'], cliConsole?: ConsoleLineLogger) {
    this.cliConsole = cliConsole ?? consoleWithColour(this.flags, chalk);
  }

  protected hash(ssml: string, _paragraph: NarrationParagraph): string {
    const hashNumber = murmurhash.v3(ssml, 2894);
    return String(hashNumber);
  }

  protected async loadScript(): Promise<void> {
    this._script = await loadScript(this.scriptFilePath);
    this.cliConsole.debug(`Loaded script from ${this.scriptFilePath}`);
  }

  protected parseRanges(): void {
    const chapterRangeFlag = this.flags.chapters;
    if (chapterRangeFlag) {
      try {
        this.chapterRange = new MultiRange(chapterRangeFlag);
      } catch (error) {
        throw new Error(`Invalid chapter range '${chapterRangeFlag}': ${error}`);
      }
    }
    const sectionRangeFlag = this.flags.sections;
    if (sectionRangeFlag) {
      try {
        this.sectionRange = new MultiRange(sectionRangeFlag);
      } catch (error) {
        throw new Error(`Invalid section range '${sectionRangeFlag}': ${error}`);
      }
    }
  }

  protected async initialiseTtsServiceIfNeeded(): Promise<void> {
    if (!this.ttsService) {
      const ttsServiceType = this.flags.service ?? this._script.settings.service;
      switch (ttsServiceType) {
        case TtsServiceType.Azure: {
          this.ttsService = new AzureTtsService();
          this.audioGenerationOptions = {
            subscriptionKey: this.flags['subscription-key'] ?? (this.flags['subscription-key-env'] ? process.env[this.flags['subscription-key-env']] : undefined),
            serviceRegion: this.flags.region,
          } as AzureAudioGenerationOptions;
          break;
        }
        default: {
          throw new Error(`Unknown TTS service: ${ttsServiceType}`);
        }
      }
    }
  }

  protected async determineAudioFilePath(ssmlHash: string, _paragraph: NarrationParagraph): Promise<string> {
    const audioFileFolder = this._script.scriptFilePath.split('.').slice(0, -1).join('.') + '.tts';
    if (!fs.existsSync(audioFileFolder)) {
      fs.mkdirSync(audioFileFolder, { recursive: true });
    }
    const audioFilePath = path.join(audioFileFolder, `${ssmlHash}.mp3`);
    return audioFilePath;
  }

  protected async processGeneratedAudioFile(audioFilePath: string): Promise<string> {
    return audioFilePath;
  }

  async run(reconstructedcommandLine?: string): Promise<void> {
    try {
      await this.runWithoutCatch(reconstructedcommandLine);
    } catch (error: any) {
      this.cliConsole.error(error.message);
      this.cliConsole.debug(error);
    }
  }

  async runWithoutCatch(reconstructedcommandLine?: string): Promise<void> {
    if (reconstructedcommandLine) {
      this.cliConsole.debug(`Executing command line: ${reconstructedcommandLine}`);
    }

    await this.loadScript();

    // chapter and section ranges
    this.parseRanges();

    // walk through the script
    for (const chapter of this._script.chapters) {
      const chapterIndex = chapter.index;
      if (!this.chapterRange || this.chapterRange.has(chapterIndex)) {
        this.cliConsole.debug(`Entering chapter [${chapterIndex}] ${chapter.key}`);
        for (const section of chapter.sections) {
          const sectionIndex = section.index;
          if (!this.sectionRange || this.sectionRange.has(sectionIndex)) {
            this.cliConsole.debug(`Entering section [${chapterIndex}-${sectionIndex}] ${section.key}`);
            for (const paragraph of section.paragraphs) {
              const paragraphIndex = paragraph.index;
              // wait for user key press if needed
              if (paragraphIndex === 1 && this.flags.interactive) {
                const response = await prompts({
                  initial: true,
                  message: `Press ENTER to continue or CTRL-C to abort => [${chapterIndex}-${sectionIndex}] ${section.key}`,
                  name: 'r',
                  type: 'confirm',
                });
                if (response.r === undefined) { // CTRL-C
                  return;
                }
              }
              this.cliConsole.debug(`Entering paragraph [${chapterIndex}-${sectionIndex}-${paragraphIndex}] ${paragraph.key}`);
              this.cliConsole.debug(`Processing: ${paragraph.text}`);

              // generate SSML and its hash
              await this.initialiseTtsServiceIfNeeded();   // initialise in first use
              const ssml = await this.ttsService.generateSSML(paragraph);
              const ssmlHash = this.hash(ssml, paragraph);
              if (this.flags.ssml) {
                this.cliConsole.info(`SSML generated with hash ${ssmlHash}:`);
                this.cliConsole.info(ssml);
              }
              const generatedAudioFilePath = await this.determineAudioFilePath(ssmlHash, paragraph);

              if (this.flags['dry-run']) {
                this.cliConsole.debug('No action because of dry-run flag');
              } else {
                // check to see if the .mp3 file already exists
                if (!this.flags.overwrite && fs.existsSync(generatedAudioFilePath) && fs.statSync(generatedAudioFilePath).size > 0) {
                  this.cliConsole.debug(`Re-using already existing audio file '${generatedAudioFilePath}' for ${chapterIndex}-${sectionIndex}-${paragraphIndex}`);
                } else {
                  // generate .mp3 file if needed
                  await this.ttsService.generateAudio(ssml, {
                    ...this.audioGenerationOptions,
                    outputFilePath: generatedAudioFilePath,
                  });
                  const audioDuration = await getAudioFileDuration(generatedAudioFilePath);
                  this.cliConsole.debug(`Generated audio of ${audioDuration / 1000}s: ${generatedAudioFilePath}`);
                }

                // post-processing
                const audioFilePath = await this.processGeneratedAudioFile(generatedAudioFilePath);
                paragraph.audioFilePath = audioFilePath;

                // play .mp3 file if needed
                if (this.flags.play) {
                  await playMp3File(audioFilePath, this.cliConsole.info);
                }
              }
            }
          }
        }
      }
    }
    this.cliConsole.debug(`Finished processing ${this.scriptFilePath}`);
  }

  public get script(): NarrationScript {
    return this._script;
  }
}
