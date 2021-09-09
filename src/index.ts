import { Command, flags } from '@oclif/command';
import { CommandArgs, CommandFlags, CommandOptions, OclifUtils } from '@handy-common-utils/oclif-utils';
import { CliProcessor } from './cli-processor';

class TtsNarratorCli extends Command {
  static Options: CommandOptions<typeof TtsNarratorCli>;
  static description = 'Generate narration with Text-To-Speech technology';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    'update-readme.md': flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),
    debug: flags.boolean({ char: 'd', name: 'debug', description: 'output debug information' }),
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

    const processor = new CliProcessor(options, OclifUtils.reconstructCommandLine(this, options));
    await processor.run();
  }
}

export = TtsNarratorCli
