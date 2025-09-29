import { ElevenLabs, ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { merge } from 'lodash';
import { promises as fsPromises } from 'node:fs';

import { NarrationParagraph } from './narration-script';
import { AudioGenerationOptions, BaseTtsService, normaliseRate } from './tts-service';

export type ElevenLabsAudioGenerationOptions = AudioGenerationOptions & Omit<ElevenLabs.TextToSpeechRequest, 'text'>;

type TtsSpec = ElevenLabs.TextToSpeechRequest & {
  voiceId?: string;
};

export class ElevenLabsTtsService extends BaseTtsService {
  private client: ElevenLabsClient;
  private options: Omit<ElevenLabsAudioGenerationOptions, 'outputFilePath'>;

  constructor(options: { apiKey?: string } & Omit<ElevenLabsAudioGenerationOptions, 'outputFilePath'> = {}) {
    super();
    const { apiKey, ...restOfTheOptions } = options;
    this.client = new ElevenLabsClient({
      apiKey: apiKey || process.env.ELEVENLABS_API_KEY || '',
    });
    this.options = restOfTheOptions;
  }

  async generateSSML(paragraph: NarrationParagraph): Promise<string> {
    // For ElevenLabs, we don't generate actual SSML but a JSON configuration
    // that embodies the parameters needed for the ElevenLabs API
    const text = paragraph?.text?.trim();
    if (!text) {
      throw new Error('Empty content?');
    }

    const voiceSettings = paragraph.settings;
    const voiceId = voiceSettings.name; // ElevenLabs voice ID
    
    // Map prosody settings to ElevenLabs voice settings
    const elevenLabsVoiceSettings: ElevenLabs.VoiceSettings = {};
    if (voiceSettings.prosody) {
      // Map rate to speed)
      // eslint-disable-next-line unicorn/no-lonely-if
      if (voiceSettings.prosody.rate) {
        elevenLabsVoiceSettings.speed = normaliseRate(voiceSettings.prosody.rate, 0.7, 1.2);
      }
    }

    // Create ElevenLabs configuration
    const spec: TtsSpec = {
      text,
      voiceId,
      voiceSettings: Object.keys(elevenLabsVoiceSettings).length > 0 ? elevenLabsVoiceSettings : undefined,
      languageCode: voiceSettings.language || undefined,
    };

    return JSON.stringify(spec);
  }

  async generateAudio(specJSON: string, options: ElevenLabsAudioGenerationOptions | Pick<ElevenLabsAudioGenerationOptions, 'outputFilePath'>): Promise<void> {
    const allOptions = { ...this.options, ...options } as ElevenLabsAudioGenerationOptions;
    const { outputFilePath, ...restOfTheOptions } = allOptions;

    const spec = JSON.parse(specJSON) as TtsSpec;
    const { voiceId, ...restOfTheSpec } = spec;

    const request = merge({}, restOfTheOptions, restOfTheSpec) as Omit<TtsSpec, 'voiceId'>;
    if (!request.outputFormat) {
      request.outputFormat = ElevenLabs.TextToSpeechConvertRequestOutputFormat.Mp32205032;
    }

    const audioData = await this.client.textToSpeech.convert(voiceId!, request);
        
    // Write audio data to file
    await fsPromises.writeFile(outputFilePath, audioData);
  }
}
