import { XMLValidator } from 'fast-xml-parser';

import { NarrationParagraph, VoiceSettings } from './narration-script';

export interface AudioGenerationOptions {
  outputFilePath: string;
}
export interface TtsService {
  generateSSML(paragraph: NarrationParagraph): Promise<string>;
  generateAudio(ssml: string, options: AudioGenerationOptions): Promise<void>;
}

export enum TtsServiceType {
  Azure = 'azure'
}

function escapeXml(text: string) {
  return text.replaceAll(/["&'<>]/g, (c: string) => {
    switch (c) {
      case '<': {
        return '&lt;';
      }
      case '>': {
        return '&gt;';
      }
      case '&': {
        return '&amp;';
      }
      case '\'': {
        return '&apos;';
      }
      case '"': {
        return '&quot;';
      }
      default: {
        return c;
      }
    }
  });
}

export abstract class BaseTtsService implements TtsService {
  async generateSSML(paragraph: NarrationParagraph): Promise<string> {
    const generated = this.generateSsmlWithoutValidation(paragraph);
    this.validateXML(generated.ssml, generated.lineOffset);
    return generated.ssml;
  }

  protected validateXML(xml: string, lineOffset: number): void {
    const validationResult = XMLValidator.validate(xml);
    if (validationResult !== true) {
      const err = validationResult.err;
      throw new Error(`Invalid markup at line ${err.line - lineOffset}. ${err.code}: ${err.msg}`);
    }
  }

  protected buildSpeakStartTag(voiceSettings: VoiceSettings): string {
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voiceSettings.language ?? 'en-US'}">`;
  }

  protected buildVoiceStartTag(voiceSettings: VoiceSettings): string {
    return `<voice name="${voiceSettings.name}">`;
  }

  protected buildProsodyStartTag(prosodySettings: Exclude<VoiceSettings['prosody'], undefined>): string {
    return `<prosody ${prosodySettings.pitch ? `pitch="${prosodySettings.pitch}"` : ''} ${prosodySettings.rate ? `rate="${prosodySettings.rate}"` : ''} ${prosodySettings.volume ? `volume="${prosodySettings.volume}"` : ''}>`;
  }

  protected buildMsttsExpressAsStartTag(msttsExpressAsSettings: Exclude<VoiceSettings['msttsExpressAs'], undefined>): string {
    return `<mstts:express-as ${msttsExpressAsSettings.style ? `style="${msttsExpressAsSettings.style}"` : ''} ${msttsExpressAsSettings.role ? `role="${msttsExpressAsSettings.role}"` : ''} ${msttsExpressAsSettings.styleDegree ? `styledegree="${msttsExpressAsSettings.styleDegree}"` : ''}>`;
  }

  protected generateSsmlWithoutValidation(paragraph: NarrationParagraph): {lineOffset: number, ssml: string} {
    const text = paragraph?.text?.trim();
    const ssml = paragraph?.ssml?.trim();
    if (!text && !ssml) {
      throw new Error('Empty content?');
    }

    if (ssml && ssml.startsWith('<speak')) { // it is already full SSML
      if (!ssml.endsWith('</speak>')) {
        throw new Error('Forgot to end the text with "</speak>"?');
      }
      return { lineOffset: 0, ssml };
    }

    const voiceSettings = paragraph.settings;
    const speakStartTag = this.buildSpeakStartTag(voiceSettings);
    const speakEndTag = '</speak>';

    // <voice></voice> fragment
    if (ssml && ssml.startsWith('<voice')) {
      if (!ssml.endsWith('</voice>')) {
        throw new Error('Forgot to end the text with "</voice>"?');
      }
      return { lineOffset: 1, ssml: `${speakStartTag}\n${ssml}\n${speakEndTag}` };
    }

    const voiceStartTag = this.buildVoiceStartTag(voiceSettings);
    const voiceEndTag = '</voice>';

    let prosodyStartTagOrEmpty = '';
    let prosodyEndTagOrEmpty = '';
    if (voiceSettings.prosody) {
      prosodyStartTagOrEmpty = this.buildProsodyStartTag(voiceSettings.prosody);
      prosodyEndTagOrEmpty = '</prosody>';
    }

    let msttsExpressAsStartTagOrEmpty = '';
    let msttsExpressAsEndTagOrEmpty = '';
    if (voiceSettings.msttsExpressAs) {
      msttsExpressAsStartTagOrEmpty = this.buildMsttsExpressAsStartTag(voiceSettings.msttsExpressAs);
      msttsExpressAsEndTagOrEmpty = '</mstts:express-as>';
    }

    // plain text or fragments containing other tags
    return { lineOffset: 1, ssml: `${speakStartTag}${voiceStartTag}${prosodyStartTagOrEmpty}${msttsExpressAsStartTagOrEmpty}\n${ssml || escapeXml(text!)}\n${msttsExpressAsEndTagOrEmpty}${prosodyEndTagOrEmpty}${voiceEndTag}${speakEndTag}` };
  }

  generateAudio(_ssml: string, _options: AudioGenerationOptions): Promise<void> {
    throw new Error('generateAudio(...) is not implemented.');
  }
}
