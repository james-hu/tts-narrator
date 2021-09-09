/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import { CommandOptions } from '@handy-common-utils/oclif-utils';
import { Command } from '@oclif/config';
import TtsNarratorCli from '.';
import { loadScript } from './narration-script';

/**
 * The base CLI context class.
 * The info and debug functions rely on `options.flags.quiet` and `options.flags.debug`.
 */
export class BaseCliContext<T extends Command> {
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

export class CliProcessor extends BaseCliContext<typeof TtsNarratorCli> {
  async run(): Promise<void> {
    this.debug(`Executing command line: ${this.reconstructedcommandLine}`);

    const scriptFile = this.options.args.file;
    const script = await loadScript(scriptFile);
    this.debug(`Loaded script from ${scriptFile}`);

    for (const chapter of script.chapters) {
      const chapterIndex = chapter.index;
      this.debug(`Entering chapter [${chapterIndex}] ${chapter.key}`);
      for (const section of chapter.sections) {
        const sectionIndex = section.index;
        this.debug(`Entering section [${chapterIndex}-${sectionIndex}] ${section.key}`);
        for (const paragraph of section.paragraphs) {
          const paragraphIndex = paragraph.index;
          this.debug(`Entering paragraph [${chapterIndex}-${sectionIndex}-${paragraphIndex}] ${paragraph.key}`);
          this.debug(`Processing: ${paragraph.text}`);
        }
      }
    }
  }
}
