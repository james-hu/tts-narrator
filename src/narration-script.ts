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
    key?: string;
    text: string;
  }
  export interface Section {
    key?: string;
    paragraphs: Paragraph[];
  }
  export interface Chapter {
    key?: string;
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
    public index: number,
    public section: NarrationSection,
    public chapter: NarrationChapter,
    public script: NarrationScript,
  ) {}

  get settings(): VoiceSettings {
    return ({ ...this.script.settings?.voice, ...this.paragraph.settings });
  }

  get key(): string {
    return this.paragraph.key ?? String(this.index);
  }

  get text(): string {
    return this.paragraph.text;
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
