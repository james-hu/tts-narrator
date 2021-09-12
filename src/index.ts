import { Command, flags } from '@oclif/command';
import { CommandArgs, CommandFlags, CommandOptions, OclifUtils } from '@handy-common-utils/oclif-utils';
import { ScriptProcessor, scriptProcessorFlags } from './script-processor';

class TtsNarratorCli extends Command {
  static Options: CommandOptions<typeof TtsNarratorCli>;
  static description = 'Generate narration with Text-To-Speech technology';

  static flags = {
    ...scriptProcessorFlags,
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    'update-readme.md': flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),
  }

  static args = [{ name: 'file' as const, description: 'path to the script file (.yml)' }];

  static examples = [
    '^ myscript.yml --play --interactive --service azure --subscription-key-env SUBSCRIPTION_KEY --region australiaeast',
  ];

  protected async init(): Promise<any> {
    OclifUtils.prependCliToExamples(this);
    return super.init();
  }

  async run(argv?: string[]): Promise<void> {
    const options = this.parse<CommandFlags<typeof TtsNarratorCli>, CommandArgs<typeof TtsNarratorCli>>(TtsNarratorCli, argv);
    if (options.flags['update-readme.md']) {
      OclifUtils.injectHelpTextIntoReadmeMd(this);
      return;
    }

    const processor = new ScriptProcessor(options.args.file, options.flags);
    await processor.run(OclifUtils.reconstructCommandLine(this, options));
  }
}

export = TtsNarratorCli
