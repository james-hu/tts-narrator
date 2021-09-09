import { Command, flags } from '@oclif/command';
import { CommandArgs, CommandFlags, CommandOptions, OclifUtils } from '@handy-common-utils/oclif-utils';

class TtsNarratorCli extends Command {
  static Options: CommandOptions<typeof TtsNarratorCli>;
  static description = 'Generate narration with Text-To-Speech technology';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    'update-readme.md': flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),
    debug: flags.boolean({ char: 'd', name: 'debug' }),
  }

  static args = [{ name: 'file' }];

  static examples = [
    '^ -r ap-southeast-2 -s',
    `^ -r ap-southeast-2 -s -i '*boi*' -i '*datahub*' \\
      -x '*jameshu*' -c`,
    `^ -r ap-southeast-2 -s -i '*lr-*' \\
      -i '*lead*' -x '*slack*' -x '*lead-prioritization*' \\
      -x '*lead-scor*' -x '*LeadCapture*' -c`,
  ];

  protected async init(): Promise<any> {
    OclifUtils.prependCliToExamples(this);
    return super.init();
  }

  async run(argv?: string[]): Promise<void> {
    const options = this.parse<CommandFlags<typeof TtsNarratorCli>, CommandArgs<typeof TtsNarratorCli>>(TtsNarratorCli, argv);
    if (options.flags['update-readme.md']) {
      OclifUtils.injectHelpTextIntoReadmeMd(this); // you need to have <!-- help start -->...<!-- help end --> in your README.md
      return;
    }

    if (options.flags.debug) {
      console.log(`Command line: ${OclifUtils.reconstructCommandLine(this, options)}`);
    }

    console.log('Hello from TtsNarratorCli!');
  }
}

export = TtsNarratorCli
