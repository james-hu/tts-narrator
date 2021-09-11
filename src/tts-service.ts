import { validate as validateXml } from 'fast-xml-parser';
import { NarrationParagraph, VoiceSettings } from './narration-script';

export interface AudioGenerationOptions {
  outputFilePath: string;
}
export interface TtsService {
  generateSSML(paragraph: NarrationParagraph): Promise<string>;
  generateAudio(ssml: string, options: AudioGenerationOptions): Promise<void>;
}

export abstract class BaseTtsService implements TtsService {
  async generateSSML(paragraph: NarrationParagraph): Promise<string> {
    const generated = this.generateSsmlWithoutValidation(paragraph);
    this.validateXML(generated.ssml, generated.lineOffset);
    return generated.ssml;
  }

  protected validateXML(xml: string, lineOffset: number): void {
    const validatioinResult = validateXml(xml);
    if (validatioinResult !== true) {
      const err = validatioinResult.err;
      throw new Error(`Invalid markup at line ${err.line - lineOffset}. ${err.code}: ${err.msg}`);
    }
  }

  protected buildSpeakStartTag(voiceSettings: VoiceSettings): string {
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voiceSettings.language ?? 'en-US'}">`;
  }

  protected buildVoiceStartTag(voiceSettings: VoiceSettings): string {
    return `<voice name="${voiceSettings.name}">`;
  }

  protected generateSsmlWithoutValidation(paragraph: NarrationParagraph): {lineOffset: number, ssml: string} {
    const text = paragraph?.text?.trim();
    if (!text) {
      throw new Error('Empty content?');
    }

    if (text.startsWith('<speak')) { // it is already full SSML
      if (!text.endsWith('</speak>')) {
        throw new Error('Forgot to end the text with "</speak>"?');
      }
      return { lineOffset: 0, ssml: text };
    }

    const voiceSettings = paragraph.settings;
    const speakStartTag = this.buildSpeakStartTag(voiceSettings);
    const speakEndTag = '</speak>';

    // <voice></voice> fragment
    if (text.startsWith('<voice')) {
      if (!text.endsWith('</voice>')) {
        throw new Error('Forgot to end the text with "</voice>"?');
      }
      return { lineOffset: 1, ssml: `${speakStartTag}\n${text}\n${speakEndTag}` };
    }

    const voiceStartTag = this.buildVoiceStartTag(voiceSettings);
    const voiceEndTag = '</voice>';

    // plain text or fragments containing other tags
    return { lineOffset: 1, ssml: `${speakStartTag}${voiceStartTag}\n${text}\n${voiceEndTag}${speakEndTag}` };
  }

  generateAudio(_ssml: string, _options: AudioGenerationOptions): Promise<void> {
    throw new Error('generateAudio(...) is not implemented.');
  }
}
