import { Command, flags } from '@oclif/command';
import { CommandArgs, CommandFlags, CommandOptions, OclifUtils } from '@handy-common-utils/oclif-utils';
import { ScriptProcessor, TtsServiceType } from './script-processor';

class TtsNarratorCli extends Command {
  static Options: CommandOptions<typeof TtsNarratorCli>;
  static description = 'Generate narration with Text-To-Speech technology';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    'update-readme.md': flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),
    debug: flags.boolean({ char: 'd', description: 'output debug information' }),

    service: flags.string({ char: 's', options: Object.entries(TtsServiceType).map(([_name, value]) => value), description: 'text-to-speech service to use' }),
    'subscription-key': flags.string({ char: 'k', description: 'Azure Speech service subscription key' }),
    'subscription-key-env': flags.string({ description: 'Name of the environment variable that holds the subscription key' }),
    region: flags.string({ char: 'r', description: 'region of the text-to-speech service' }),

    play: flags.boolean({ char: 'p', default: true, allowNo: true, description: 'play generated audio' }),
    interactive: flags.boolean({ char: 'i', default: false, description: 'wait for key press before entering each section' }),

    overwrite: flags.boolean({ char: 'o', default: false, description: 'always overwrite previously generated audio files' }),
    'dry-run': flags.boolean({ default: false, description: 'don\'t try to generate or play audio' }),
    ssml: flags.boolean({ default: false, description: 'display generated SSML' }),

    chapters: flags.string({ description: 'list of chapters to process, examples: "1-10,13,15", "4-"' }),
    sections: flags.string({ description: 'list of sections to process, examples: "1-10,13,15", "5-"' }),
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

    const processor = new ScriptProcessor(options, OclifUtils.reconstructCommandLine(this, options));
    await processor.run();
  }
}

export = TtsNarratorCli
