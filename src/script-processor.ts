/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
import type chalkType from 'chalk';
/* eslint-disable max-depth */
import type promptsFunc from 'prompts';

import { ConsoleLineLogger, consoleWithColour, consoleWithoutColour } from '@handy-common-utils/misc-utils';
import { MultiRange } from 'multi-integer-range';
import * as murmurhash from 'murmurhash';
import * as fs from 'node:fs';
import path from 'node:path';

import type { ScriptProcessorFlags } from './script-processor-flags';

import { getAudioFileDuration, playMp3File } from './audio-utils';
import { AzureAudioGenerationOptions, AzureTtsService } from './azure-tts-service';
import { ElevenLabsAudioGenerationOptions, ElevenLabsTtsService } from './elevenlabs-tts-service';
import { NarrationParagraph, NarrationScript, loadScript } from './narration-script';
import { AudioGenerationOptions, TtsService, TtsServiceType } from './tts-service';


export class ScriptProcessor {
  protected _prompts: typeof promptsFunc|undefined|null; // prompts function / not initialised / failed to load
  protected _chalk: typeof chalkType|undefined|null; // chalk / not initialised / failed to load
  
  protected cliConsole: ConsoleLineLogger;
  protected ttsService!: TtsService;
  protected audioGenerationOptions: Omit<AudioGenerationOptions, 'outputFilePath'>|undefined;
  protected _script!: NarrationScript;
  protected chapterRange: MultiRange|undefined;
  protected sectionRange: MultiRange|undefined;

  constructor(protected scriptFilePath: string, protected flags: ScriptProcessorFlags, cliConsole?: ConsoleLineLogger) {
    this.cliConsole = cliConsole ?? (this.chalk ? consoleWithColour(this.flags, this.chalk) : consoleWithoutColour(this.flags));
  }

  /**
   * prompts function, or null caused by library not available
   */
  protected get prompts() {
    if (this._prompts === undefined) {
      try {
        // eslint-disable-next-line unicorn/prefer-module
        this._prompts = require('prompts');
      } catch (error) {
        this._prompts = null;
        this.cliConsole.info(`Library for prompting user input is not available: ${error}`);
      }
    }
    return this._prompts;
  }

  /**
   * chalk, or null caused by library not available
   */
  protected get chalk() {
    if (this._chalk === undefined) {
      try {
        // eslint-disable-next-line unicorn/prefer-module
        this._chalk = require('chalk');
      } catch (error) {
        this._chalk = null;
        this.cliConsole.debug(`Library for colourising console output is not available: ${error}`);
      }
    }
    return this._prompts;
  }  

  protected hash(ssml: string, _paragraph: NarrationParagraph): string {
    const hashNumber = murmurhash.v3(ssml, 2894);
    return String(hashNumber);
  }

  protected async loadScriptIfNeeded(): Promise<void> {
    if (!this._script) {
      this._script = await loadScript(this.scriptFilePath);
      this.cliConsole.debug(`Loaded script from ${this.scriptFilePath}`);  
    }
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
            subscriptionKey: this.flags['api-key'] ?? (this.flags['api-key-env'] ? process.env[this.flags['api-key-env']] : undefined),
            serviceRegion: this.flags.region,
            outputFormat: this.flags.outputFormat,
          } as Omit<AzureAudioGenerationOptions, 'outputFilePath'>;
          break;
        }
        case TtsServiceType.ElevenLabs: {
          this.ttsService = new ElevenLabsTtsService({
            apiKey: this.flags['api-key'] ?? (this.flags['api-key-env'] ? process.env[this.flags['api-key-env']] : undefined),
          });
          this.audioGenerationOptions = {} as Omit<ElevenLabsAudioGenerationOptions, 'outputFilePath'>;
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

  async run(reconstructedCommandLine?: string): Promise<void> {
    try {
      await this.runWithoutCatch(reconstructedCommandLine);
    } catch (error: any) {
      this.cliConsole.error(error.message);
      this.cliConsole.debug(error);
    }
  }

  async runWithoutCatch(reconstructedCommandLine?: string): Promise<void> {
    if (reconstructedCommandLine) {
      this.cliConsole.debug(`Executing command line: ${reconstructedCommandLine}`);
    }

    await this.loadScriptIfNeeded();

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
              if (paragraphIndex === 1 && this.flags.interactive && this.prompts) {
                const response = await this.prompts({
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
              this.cliConsole.debug(`Processing: ${paragraph.ssml || paragraph.text}`);

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
                  if (this.cliConsole.isDebug) {
                    const audioDuration = await getAudioFileDuration(generatedAudioFilePath);
                    this.cliConsole.debug(`Generated audio of ${audioDuration / 1000}s: ${generatedAudioFilePath}`);  
                  }
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
