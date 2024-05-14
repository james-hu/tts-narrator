import { ConsoleLineLogger } from '@handy-common-utils/misc-utils';
import * as fs from 'node:fs';
import path from 'node:path';

import { NarrationParagraph, NarrationScript } from './narration-script';
import { ScriptProcessor } from './script-processor';
import { ScriptProcessorFlags } from './script-processor-flags';
import { TtsService } from './tts-service';

type UndefinedProperties<T> = {
  [P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];

type ToOptional<T> = Partial<Pick<T, UndefinedProperties<T>>> & Pick<T, Exclude<keyof T, UndefinedProperties<T>>>;

function dummyFunc() {}
const silentLogger: ConsoleLineLogger = {
  debug: dummyFunc,
  info: dummyFunc,
  warn: dummyFunc,
  error: (err) => { throw err; },
  isDebug: false,
  isQuiet: false,
};

/**
 * Class for generating narration.
 * Instance of this class can be used to generate narration audio for scripts by calling the `narrate(...)` method. 
 * 
 * @example
 * const ttsService = new AzureTtsService(...);
 * const ttsNarrator = new TtsNarrator(ttsService, './output-folder');
 * const script = await loadScript('./my-script.yml');
 * await ttsNarrator.narrate(script);
 * console.log(`One of the generated audio file is: ${script.chapters[0].sections[0].paragraphs[0].audioFilePath}`);
 */
export class TtsNarrator extends ScriptProcessor {
  /**
   * Constructor
   * @param ttsService The TTS service to be used for generating audio
   * @param audioFileFolder The folder that generated audio files will be placed
   * @param options Optional settings
   * @param cliConsole Optional logger
   */
  constructor(ttsService: TtsService, protected audioFileFolder: string, options?: Partial<ScriptProcessorFlags>, cliConsole: ConsoleLineLogger = silentLogger) {
    super(
      'dummy-value',
      {
        debug: false,
        quiet: false,
        play: false,
        interactive: false,
        overwrite: false,
        ssml: false,
        ...options,
      } as ToOptional<ScriptProcessorFlags> as ScriptProcessorFlags,
      cliConsole,
    );
    this.ttsService = ttsService;
  }

  protected async determineAudioFilePath(ssmlHash: string, _paragraph: NarrationParagraph): Promise<string> {
    if (!fs.existsSync(this.audioFileFolder)) {
      fs.mkdirSync(this.audioFileFolder, { recursive: true });
    }
    const audioFilePath = path.join(this.audioFileFolder, `${ssmlHash}.mp3`);
    return audioFilePath;
  }

  /**
   * Generate narration for the script
   * @param script the input script which will also be modified for recording audioFilePath
   * @returns nothing
   */
  async narrate(script: NarrationScript): Promise<void> {
    this._script = script;
    await this.runWithoutCatch();
  }
}
