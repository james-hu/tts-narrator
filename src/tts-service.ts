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
  Azure = 'azure',
  ElevenLabs = 'elevenlabs'
}

export function escapeXml(text: string) {
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

export function normaliseRate(rate?: string, min: number = 0.5, max: number = 2): number | undefined {
  if (rate == null) {
    return undefined;
  }

  const trimmed = rate.trim().toLowerCase();

  // Calculate named rates dynamically based on min/max
  const medium = 1;
  const namedRates: Record<string, number> = {
    'x-slow': min,
    'slow': (medium + min) / 2,   // midpoint between min and medium
    'medium': medium,
    'default': medium,
    'fast': (medium + max) / 2,   // midpoint between medium and max
    'x-fast': max,
  };

  let value: number | undefined;

  if (trimmed in namedRates) {
    value = namedRates[trimmed];
  } else if (/^[+-]?\d+(\.\d+)?%$/.test(trimmed)) {
    // Percentage form, e.g. "150%", "+10%", "-20%"
    const pct = Number.parseFloat(trimmed.slice(0, -1));
    if (Number.isNaN(pct)) {
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error(`Invalid percentage rate: ${rate}`);
    }
    // eslint-disable-next-line unicorn/prefer-ternary
    if (trimmed.startsWith('+') || trimmed.startsWith('-')) {
      // Relative to medium (1.0)
      value = medium * (1 + pct / 100);
    } else {
      // Absolute percentage
      value = pct / 100;
    }
    if (value < 0) {
      throw new Error(`Invalid percentage rate: ${rate}`);
    }
  } else if (/^\d+(\.\d+)?$/.test(trimmed)) {
    // Plain number string, e.g. "1", "1.25"
    const num = Number.parseFloat(trimmed);
    if (Number.isNaN(num) || num < 0) {
      throw new Error(`Invalid numeric rate: ${rate}`);
    }
    value = num;
  } else {
    throw new Error(`Invalid rate: ${rate}`);
  }

  // Clamp to min/max
  value = Math.max(min, Math.min(max, value));

  return value;
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
