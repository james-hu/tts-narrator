/* eslint-disable no-use-before-define */
import { promisify } from 'util';
import * as fs from 'fs';
import { load as loadYaml, dump as dumpYaml } from 'js-yaml';
import { cloneDeep } from 'lodash';

const readFileAsPromise = promisify(fs.readFile);
const writeFileAsPromise = promisify(fs.writeFile);

export interface VoiceSettings {
  name?: string;
  language?: string;
}
export interface ScriptSettings {
  voice?: VoiceSettings;
}
export namespace NarrationScriptFile {
  export interface Paragraph {
    settings?: VoiceSettings;
    text: string;
  }
  export interface Section {
    key: string;
    paragraphs: Paragraph[];
  }
  export interface Chapter {
    key: string;
    sections: Section[];
  }
  export interface Script {
    settings: ScriptSettings;
    chapters: Chapter[];
  }
}

export class NarrationParagraph implements NarrationScriptFile.Paragraph {
  constructor(
    protected paragraph: NarrationScriptFile.Paragraph,
    public section: NarrationSection,
    public chapter: NarrationChapter,
    public script: NarrationScript,
  ) {}

  get settings(): VoiceSettings {
    return ({ ...this.paragraph.settings, ...this.script.settings?.voice });
  }

  get text(): string {
    return this.paragraph.text;
  }
}
export class NarrationSection implements NarrationScriptFile.Section {
  public paragraphs: NarrationParagraph[];

  constructor(
    protected section: NarrationScriptFile.Section,
    public chapter: NarrationChapter,
    public script: NarrationScript,
  ) {
    this.paragraphs = section.paragraphs.map(paragraph => new NarrationParagraph(paragraph, this, chapter, script));
  }

  get key(): string {
    return this.section.key;
  }
}
export class NarrationChapter implements NarrationScriptFile.Chapter {
  private sectionsByKeys: Map<string, NarrationSection>|undefined;
  public sections: NarrationSection[];

  constructor(
    protected chapter: NarrationScriptFile.Chapter,
    public script: NarrationScript,
  ) {
    this.sections = chapter.sections.map(section => new NarrationSection(section, this, script));
  }

  get key(): string {
    return this.chapter.key;
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
    this.chapters = script.chapters.map(chapter => new NarrationChapter(chapter, this));
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
