import { expect } from 'chai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { NarrationParagraph, NarrationScript, NarrationScriptFile } from '../src/narration-script';
import { GeneratedAudio } from '../src/script-processor';
import { TtsNarrator } from '../src/tts-narrator';
import { AudioGenerationOptions, TtsService } from '../src/tts-service';

const EMPTY_AUDIO_TEXT = 'EMPTY';

/**
 * TTS service that writes an empty file for paragraphs having EMPTY_AUDIO_TEXT as text,
 * and copies a short valid MP3 file for other paragraphs.
 */
class StubTtsService implements TtsService {
  generatedSsmls = new Array<string>();

  async generateSSML(paragraph: NarrationParagraph): Promise<string> {
    return paragraph.text ?? '';
  }

  async generateAudio(ssml: string, options: AudioGenerationOptions): Promise<void> {
    this.generatedSsmls.push(ssml);
    await (ssml === EMPTY_AUDIO_TEXT ? fs.writeFile(options.outputFilePath, '') : fs.copyFile('test/fixtures/one-frame.mp3', options.outputFilePath));
  }
}

/**
 * Create an in-memory script.
 * @param texts Text of the paragraphs, all in one section of one chapter
 * @param scriptFilePath Path of the script file, the generated SRT and join script are placed in `<path without extension>.tts/`
 * @returns The script
 */
function createScript(texts: string[], scriptFilePath: string): NarrationScript {
  const script: NarrationScriptFile.Script = {
    settings: {},
    chapters: [{ sections: [{ paragraphs: texts.map(text => ({ text })) }] }],
  };
  return new NarrationScript(script, scriptFilePath);
}

describe('TtsNarrator', () => {
  let tempDir: string;
  let scriptFilePath: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tts-narrator-narrate-'));
    scriptFilePath = path.join(tempDir, 'script.yml');
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should record audioFilePath and audioDurationMS, with 0 for empty audio', async () => {
    const script = createScript(['first', EMPTY_AUDIO_TEXT, 'third'], scriptFilePath);
    await new TtsNarrator(new StubTtsService(), tempDir).narrate(script);

    const [first, empty, third] = script.chapters[0].sections[0].paragraphs;
    for (const p of [first, empty, third]) {
      expect(p.audioFilePath).to.be.a('string');
    }
    expect(first.audioDurationMS).to.be.greaterThan(0);
    expect(empty.audioDurationMS).to.equal(0);
    expect(third.audioDurationMS).to.be.greaterThan(0);

    const srt = await fs.readFile(path.join(tempDir, 'script.tts', 'script.srt'), 'utf8');
    expect(srt).to.contain('first').and.contain('third').and.not.contain(EMPTY_AUDIO_TEXT);
  });

  it('should re-use non-empty audio files and regenerate empty ones in subsequent runs', async () => {
    const ttsService = new StubTtsService();
    const narrator = new TtsNarrator(ttsService, tempDir);
    await narrator.narrate(createScript(['first', EMPTY_AUDIO_TEXT], scriptFilePath));
    expect(ttsService.generatedSsmls).to.deep.equal(['first', EMPTY_AUDIO_TEXT]);

    await narrator.narrate(createScript(['first', EMPTY_AUDIO_TEXT], scriptFilePath));
    expect(ttsService.generatedSsmls).to.deep.equal(['first', EMPTY_AUDIO_TEXT, EMPTY_AUDIO_TEXT]);
  });

  it('should use the file path and duration returned by an overriding processGeneratedAudioFile', async () => {
    const processedParagraphTexts = new Array<string | undefined>();
    class ProcessingTtsNarrator extends TtsNarrator {
      protected async processGeneratedAudioFile(audio: GeneratedAudio, paragraph: NarrationParagraph): Promise<GeneratedAudio> {
        processedParagraphTexts.push(paragraph.text);
        const filePath = audio.filePath.replace(/\.mp3$/, '.processed.mp3');
        await fs.copyFile(audio.filePath, filePath);
        return { filePath, durationMS: audio.durationMS + 1000 };
      }
    }

    const script = createScript(['first', EMPTY_AUDIO_TEXT], scriptFilePath);
    await new ProcessingTtsNarrator(new StubTtsService(), tempDir).narrate(script);

    const [first, empty] = script.chapters[0].sections[0].paragraphs;
    expect(processedParagraphTexts).to.deep.equal(['first']);
    expect(first.audioFilePath).to.match(/\.processed\.mp3$/);
    expect(first.audioDurationMS).to.be.greaterThan(1000);
    expect(empty.audioFilePath).to.not.match(/\.processed\.mp3$/);
    expect(empty.audioDurationMS).to.equal(0);
  });
});
