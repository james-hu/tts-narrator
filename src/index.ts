import { Args, Command, Flags } from '@oclif/core';
import { enhancedFlags, reconstructCommandLine, withEnhancedFlagsHandled } from '@handy-common-utils/oclif-utils';
import { ScriptProcessor, scriptProcessorFlags } from './script-processor';

class TtsNarratorCli extends Command {
  static description = 'Generate narration with Text-To-Speech technology';

  static flags = {
    ...enhancedFlags,
    ...scriptProcessorFlags,
    version: Flags.version({ char: 'v' }),
  }

  static args = {
    file: Args.string({
      required: true,
      description: 'path to the script file (.yml)',
    }),
  };

  static examples = [
    '^ myscript.yml --play --interactive --service azure --subscription-key-env SUBSCRIPTION_KEY --region australiaeast',
    '^ ./test/fixtures/script3.yml -s azure --ssml -r australiaeast --subscription-key-env=TTS_SUB_KEY  --no-play --interactive -d',
    '^ ./test/fixtures/script3.yml -s azure -r australiaeast --subscription-key-env=TTS_SUB_KEY --quiet',
    '^ ./test/fixtures/script3.yml',
  ];

  async run(): Promise<void> {
    const options = await withEnhancedFlagsHandled(this, () => this.parse(TtsNarratorCli));
    const {args, flags} = options;

    const processor = new ScriptProcessor(args.file, flags);
    await processor.run(reconstructCommandLine(this, options));
  }
}

export = TtsNarratorCli
