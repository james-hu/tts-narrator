import { enhancedFlags, reconstructCommandLine, withEnhancedFlagsHandled } from '@handy-common-utils/oclif-utils';
import { Args, Command } from '@oclif/core';

import { ScriptProcessor } from './script-processor';
import { scriptProcessorFlags } from './script-processor-flags';

class TtsNarratorCli extends Command {
  static id = ' '; // workaround for the correct USAGE section in help output
  static description = 'Generate narration with Text-To-Speech technology';

  static flags = {
    ...enhancedFlags,
    ...scriptProcessorFlags,
  };

  static args = {
    file: Args.string({
      required: true,
      description: 'path to the script file (.yml)',
    }),
  };

  static examples = [
    '<%= config.bin %> myscript.yml --play --interactive --service azure --subscription-key-env TTS_SUBSCRIPTION_KEY --region australiaeast',
    '<%= config.bin %> ./test/fixtures/script3.yml -s azure --ssml -r australiaeast --subscription-key-env=TTS_SUB_KEY  --no-play --interactive -d',
    '<%= config.bin %> ./test/fixtures/script3.yml -s azure -r australiaeast --subscription-key-env=TTS_SUB_KEY --quiet',
    '<%= config.bin %> ./test/fixtures/script3.yml',
  ];

  async run(): Promise<void> {
    const options = await withEnhancedFlagsHandled(this, () => this.parse(TtsNarratorCli));
    const { args, flags } = options;

    const processor = new ScriptProcessor(args.file, flags);
    await processor.run(reconstructCommandLine(this, options));
  }
}

export = TtsNarratorCli
