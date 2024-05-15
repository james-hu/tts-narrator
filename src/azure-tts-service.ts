import { AudioConfig, ResultReason, SpeechConfig, SpeechSynthesisOutputFormat, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';

import { VoiceSettings } from './narration-script';
import { AudioGenerationOptions, BaseTtsService } from './tts-service';

export interface AzureAudioGenerationOptions extends AudioGenerationOptions {
  subscriptionKey?: string;
  serviceRegion?: string;
}

export class AzureTtsService extends BaseTtsService {
  constructor(protected options?: Omit<AzureAudioGenerationOptions, 'outputFilePath'>) {
    super();
  }

  protected buildSpeakStartTag(voiceSettings: VoiceSettings): string {
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${voiceSettings.language ?? 'en-US'}">`;
  }

  generateAudio(ssml: string, options: AzureAudioGenerationOptions | Pick<AzureAudioGenerationOptions, 'outputFilePath'>): Promise<any> {
    const allOptions = { ...this.options, ...options } as AzureAudioGenerationOptions;

    let speechConfig: SpeechConfig;
    if (allOptions.subscriptionKey && allOptions.serviceRegion) {
      speechConfig = SpeechConfig.fromSubscription(allOptions.subscriptionKey, allOptions.serviceRegion);
    } else {
      throw new Error('Can\'t find Azure service region and/or subscription key');
    }
    speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const audioConfig = AudioConfig.fromAudioFileOutput(allOptions.outputFilePath);

    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    // The event synthesis completed signals that the synthesis is completed.
    /*
    synthesizer.synthesisCompleted = function (_s, e) {
      console.log('(synthesized)  Reason: ' + ResultReason[e.result.reason] + ' Audio length: ' + e.result.audioData.byteLength);
    };
    */

    return new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(ssml, result => {
        // console.log('result', result);
        synthesizer.close();
        if (result.reason === ResultReason.SynthesizingAudioCompleted) {
          resolve(result);
        } else {
          reject(result);
        }
      }, error => {
        console.log('error', error);
        synthesizer.close();
        reject(error);
      });
    });
  }
}
