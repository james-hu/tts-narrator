import type { CommandOptions } from '@handy-common-utils/oclif-utils';

import { Flags } from '@oclif/core';

import { TtsServiceType } from './tts-service';

/**
 * CLI flags that are required/used by the ScriptProcessor.
 */
export const scriptProcessorFlags = {
  debug: Flags.boolean({ char: 'd', description: 'output debug information' }),
  quiet: Flags.boolean({ char: 'q', description: 'output warn and error information only' }),

  service: Flags.string({ char: 's', options: Object.entries(TtsServiceType).map(([_name, value]) => value), description: 'text-to-speech service to use' }),
  'subscription-key': Flags.string({ char: 'k', description: 'Azure Speech service subscription key' }),
  'subscription-key-env': Flags.string({ description: 'Name of the environment variable that holds the subscription key' }),
  region: Flags.string({ char: 'r', description: 'Region of the text-to-speech service' }),
  outputFormat: Flags.integer({ char: 'f', default: 3, description: 'Output format for audio' }), // https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesisoutputformat

  play: Flags.boolean({ char: 'p', default: true, allowNo: true, description: 'play generated audio' }),
  interactive: Flags.boolean({ char: 'i', default: false, description: 'wait for key press before entering each section' }),

  overwrite: Flags.boolean({ char: 'o', default: false, description: 'always overwrite previously generated audio files' }),
  'dry-run': Flags.boolean({ default: false, description: 'don\'t try to generate or play audio' }),
  ssml: Flags.boolean({ default: false, exclusive: ['quiet'], description: 'display generated SSML' }),

  chapters: Flags.string({ description: 'list of chapters to process, examples: "1-10,13,15", "4-"' }),
  sections: Flags.string({ description: 'list of sections to process, examples: "1-10,13,15", "5-"' }),
};

export type ScriptProcessorFlags = CommandOptions<{ flags: typeof scriptProcessorFlags}>['flags'];
