/* eslint-disable no-use-before-define */
import { dump as dumpYaml, load as loadYaml } from 'js-yaml';
import { cloneDeep } from 'lodash';
import * as fs from 'node:fs';
import { promisify } from 'node:util';

import { TtsServiceType } from './tts-service';

const readFileAsPromise = promisify(fs.readFile);
const writeFileAsPromise = promisify(fs.writeFile);

export interface VoiceSettings {
  /**
   * Language, corresponding to `speak#xml:lang` in SSML.
   */
  language?: string;
  /**
   * Voice name, corresponding to `speak.voice#name` in SSML.
   */
  name?: string;
  /**
   * Voice effect, corresponding to `speak.voice#effect` in SSML.
   */
  effect?: string;
  /**
   * Corresponding to `speak.voice.prosody` in SSML.
   */
  prosody?: {
    rate?: string;
    pitch?: string;
    volume?: string;
  };
  /**
   * Corresponding to `speak.voice.mstts:express-as` in SSML.
   */
  msttsExpressAs?: {
    style?: string;
    styleDegree?: string;
    role?: string;
  };
}
export interface ScriptSettings {
  service?: TtsServiceType;
  voice?: VoiceSettings;
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NarrationScriptFile {
  export interface Paragraph {
    settings?: VoiceSettings;
    key?: string;
    /**
     * Text to be narrated, it can't be XML.
     * If you want to use XML, use `ssml` property instead.
     * If both `text` and `ssml` are provided, `ssml` will be used.
     * If both are empty, an error will be thrown.
     */
    text?: string;
    /**
     * Full or partial SSML (a kind of XML)
     * If provided, it will be used instead of `text`.
     * If both `text` and `ssml` are provided, `ssml` will be used.
     * If both are empty, an error will be thrown.
     */
    ssml?: string;
  }
  export interface Section {
    settings?: VoiceSettings;
    key?: string;
    paragraphs: Paragraph[];
  }
  export interface Chapter {
    settings?: VoiceSettings;
    key?: string;
    sections: Section[];
  }
  export interface Script {
    settings: ScriptSettings;
    chapters: Chapter[];
  }
}

export class NarrationParagraph implements NarrationScriptFile.Paragraph {
  /**
   * Path of the generated audio file. Only for in-memory processing, not supposed to be stored in file.
   */
  public audioFilePath?: string;
  constructor(
    protected paragraph: NarrationScriptFile.Paragraph,
    public index: number,
    public section: NarrationSection,
    public chapter: NarrationChapter,
    public script: NarrationScript,
  ) {}

  get settings(): VoiceSettings {
    return ({ ...this.section.settings, ...this.paragraph.settings });
  }

  get key(): string {
    return this.paragraph.key ?? String(this.index);
  }

  get text(): string | undefined {
    return this.paragraph.text;
  }

  get ssml(): string | undefined {
    return this.paragraph.ssml;
  }
}
export class NarrationSection implements NarrationScriptFile.Section {
  public paragraphs: NarrationParagraph[];

  constructor(
    protected section: NarrationScriptFile.Section,
    public index: number,
    public chapter: NarrationChapter,
    public script: NarrationScript,
  ) {
    this.paragraphs = section.paragraphs.map((paragraph, index) => new NarrationParagraph(paragraph, index + 1, this, chapter, script));
  }

  get settings(): VoiceSettings {
    return ({ ...this.chapter.settings, ...this.section.settings });
  }

  get key(): string {
    return this.section.key ?? String(this.index);
  }
}
export class NarrationChapter implements NarrationScriptFile.Chapter {
  private sectionsByKeys: Map<string, NarrationSection>|undefined;
  public sections: NarrationSection[];

  constructor(
    protected chapter: NarrationScriptFile.Chapter,
    public index: number,
    public script: NarrationScript,
  ) {
    this.sections = chapter.sections.map((section, index) => new NarrationSection(section, index + 1, this, script));
  }

  get settings(): VoiceSettings {
    return ({ ...this.script.settings?.voice, ...this.chapter.settings });
  }

  get key(): string {
    return this.chapter.key ?? String(this.index);
  }

  getSectionByKey(key: string): NarrationSection | undefined {
    if (!this.sectionsByKeys) {
      this.sectionsByKeys = this.sections.reduce((map, section) => map.set(section.key, section), new Map<string, NarrationSection>());
    }
    return this.sectionsByKeys.get(key);
  }
}
export class NarrationScript implements NarrationScriptFile.Script {
  private chaptersByKeys: Map<string, NarrationChapter>|undefined;
  public chapters: NarrationChapter[];

  constructor(
    protected script: NarrationScriptFile.Script,
    public scriptFilePath: string,
  ) {
    this.chapters = script.chapters.map((chapter, index) => new NarrationChapter(chapter, index + 1, this));
  }

  get settings(): ScriptSettings {
    return this.script.settings;
  }

  getChapterByKey(key: string): NarrationChapter | undefined {
    if (!this.chaptersByKeys) {
      this.chaptersByKeys = this.chapters.reduce((map, chapter) => map.set(chapter.key, chapter), new Map<string, NarrationChapter>());
    }
    return this.chaptersByKeys.get(key);
  }

  export(): NarrationScriptFile.Script {
    return cloneDeep(this.script);
  }
}

export async function loadScript(scriptFilePath: string): Promise<NarrationScript> {
  const yamlContent = await readFileAsPromise(scriptFilePath, 'utf8');
  const script = loadYaml(yamlContent) as NarrationScriptFile.Script;
  return new NarrationScript(script, scriptFilePath);
}

export async function saveScript(script: NarrationScript): Promise<void>;
export async function saveScript(script: NarrationScriptFile.Script, scriptFilePath: string): Promise<void>;
export async function saveScript(script: NarrationScript | NarrationScriptFile.Script, scriptFilePath?: string): Promise<void> {
  if (!scriptFilePath) {
    const parsedScript = script as NarrationScript;
    scriptFilePath = parsedScript.scriptFilePath;
    script = parsedScript.export();
  }
  // console.log(inspect(script, false, 8, true));
  const yamlContent = dumpYaml(script, {
    lineWidth: 200,
  });
  await writeFileAsPromise(scriptFilePath, yamlContent, 'utf8');
}
