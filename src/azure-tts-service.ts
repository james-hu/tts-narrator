import { AudioConfig, ResultReason, SpeechConfig, SpeechSynthesisOutputFormat, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import { AudioGenerationOptions, BaseTtsService } from './tts-service';

export interface AzureAudioGenerationOptions extends AudioGenerationOptions {
  subscriptionKey?: string;
  serviceRegion?: string;
}

export class AzureTtsService extends BaseTtsService {
  generateAudio(ssml: string, options: AzureAudioGenerationOptions): Promise<any> {
    let speechConfig: SpeechConfig;
    if (options.subscriptionKey && options.serviceRegion) {
      speechConfig = SpeechConfig.fromSubscription(options.subscriptionKey, options.serviceRegion);
    } else {
      throw new Error('Can\'t find Azure service region and/or subscription key');
    }
    speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const audioConfig = AudioConfig.fromAudioFileOutput(options.outputFilePath);

    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    // The event synthesis completed signals that the synthesis is completed.
    synthesizer.synthesisCompleted = function (_s, e) {
      console.log('(synthesized)  Reason: ' + ResultReason[e.result.reason] + ' Audio length: ' + e.result.audioData.byteLength);
    };

    return new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(ssml, result => {
        console.log('result', result);
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
