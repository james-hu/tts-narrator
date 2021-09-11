/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import * as fs from 'fs';
import path from 'path';
import * as murmurhash from 'murmurhash';
import { CommandOptions } from '@handy-common-utils/oclif-utils';
import { MultiRange } from 'multi-integer-range';
import TtsNarratorCli from '.';
import { AzureAudioGenerationOptions, AzureTtsService } from './azure-tts-service';
import { loadScript } from './narration-script';
import { AudioGenerationOptions, TtsService } from './tts-service';
import { getAudioFileDuration, playMp3File } from './audio-utils';

function hash(text: string): string {
  const hashNumber = murmurhash.v3(text, 2894);
  return String(hashNumber).replace('-', '_');
}

/**
 * The base CLI context class.
 * The info and debug functions rely on `options.flags.quiet` and `options.flags.debug`.
 */
export class BaseCliContext<T extends { args: Array<{ name: string }>}> {
  constructor(public options: CommandOptions<T>, public reconstructedcommandLine?: string) {}

  info(message?: any, ...optionalParams: any[]): void {
    if (this.options.flags.quiet !== true) {
      console.log(message, ...optionalParams);
    }
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.options.flags.debug === true) {
      console.log(message, ...optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }
}

export enum TtsServiceType {
  Azure = 'azure'
}

export class ScriptProcessor extends BaseCliContext<typeof TtsNarratorCli> {
  async run(): Promise<void> {
    this.debug(`Executing command line: ${this.reconstructedcommandLine}`);

    const scriptFile = this.options.args.file;
    const script = await loadScript(scriptFile);
    this.debug(`Loaded script from ${scriptFile}`);

    // initialise TTS service
    let tts: TtsService;
    let audioGenerationOptions: AudioGenerationOptions;
    const ttsServiceType = this.options.flags.service;
    switch (ttsServiceType) {
      case TtsServiceType.Azure:
        tts = new AzureTtsService();
        audioGenerationOptions = {
          subscriptionKey: this.options.flags['subscription-key'] ?? (this.options.flags['subscription-key-env'] ? process.env[this.options.flags['subscription-key-env']] : undefined),
          serviceRegion: this.options.flags.region,
        } as AzureAudioGenerationOptions;
        break;
      default:
        throw new Error(`Unknown TTS service: ${ttsServiceType}`);
    }

    // chapter and section ranges
    let chapterRange: MultiRange|undefined;
    const chapterRangeFlag = this.options.flags.chapters;
    if (chapterRangeFlag) {
      try {
        chapterRange = new MultiRange(chapterRangeFlag);
      } catch (error) {
        throw new Error(`Invalid chapter range '${chapterRangeFlag}': ${error}`);
      }
    }
    let sectionRange: MultiRange|undefined;
    const sectionRangeFlag = this.options.flags.sections;
    if (sectionRangeFlag) {
      try {
        sectionRange = new MultiRange(sectionRangeFlag);
      } catch (error) {
        throw new Error(`Invalid section range '${sectionRangeFlag}': ${error}`);
      }
    }

    // make sure the audio folder exists
    const audioFileFolder = script.scriptFilePath.split('.').slice(0, -1).join('.') + '.tts';
    if (!fs.existsSync(audioFileFolder)) {
      fs.mkdirSync(audioFileFolder);
    }

    // walk through the script
    for (const chapter of script.chapters) {
      const chapterIndex = chapter.index;
      if (!chapterRange || chapterRange.has(chapterIndex)) {
        this.debug(`Entering chapter [${chapterIndex}] ${chapter.key}`);
        for (const section of chapter.sections) {
          const sectionIndex = section.index;
          if (!sectionRange || sectionRange.has(sectionIndex)) {
            this.debug(`Entering section [${chapterIndex}-${sectionIndex}] ${section.key}`);
            for (const paragraph of section.paragraphs) {
              const paragraphIndex = paragraph.index;
              this.debug(`Entering paragraph [${chapterIndex}-${sectionIndex}-${paragraphIndex}] ${paragraph.key}`);
              this.debug(`Processing: ${paragraph.text}`);

              // generate SSML and its hash
              const ssml = await tts.generateSSML(paragraph);
              const ssmlHash = hash(ssml);
              if (this.options.flags.ssml) {
                this.info(`SSML generated with hash ${ssmlHash}:`);
                this.info(ssml);
              }
              const outputFilePath = path.join(audioFileFolder, `${ssmlHash}.mp3`); // `${chapterIndex}-${sectionIndex}-${paragraphIndex}.mp3`);

              if (this.options.flags['dry-run']) {
                this.debug('No action because of dry-run flag');
              } else {
                // check to see if the .mp3 file already exists
                if (!this.options.flags.overwrite && fs.existsSync(outputFilePath)) {
                  this.debug(`Re-using already existing audio file '${outputFilePath}' for ${chapterIndex}-${sectionIndex}-${paragraphIndex}`);
                } else {
                  // generate .mp3 file if needed
                  await tts.generateAudio(ssml, {
                    ...audioGenerationOptions,
                    outputFilePath,
                  });
                  const audioDuration = await getAudioFileDuration(outputFilePath);
                  this.debug(`Generated audio of ${audioDuration / 1000}s: ${outputFilePath}`);
                }

                // play .mp3 file if needed
                if (this.options.flags.play) {
                  await playMp3File(outputFilePath);
                  this.debug(`Finished playing: ${outputFilePath}`);
                }
              }
            }
          }
        }
      }
    }
  }
}
