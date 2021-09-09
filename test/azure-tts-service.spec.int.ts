import { unlinkSync, existsSync } from 'fs';
import { expect } from 'chai';
// import { inspect } from 'util';
import { AzureTtsService } from '../src/azure-tts-service';
import { getAudioFileDuration, playMp3File } from '../src/audio-utils';

describe.skip('azure-tts-service', () => {
  const tts = new AzureTtsService();
  const outputFilePath = 'test/fixtures/tmp1.mp3';

  beforeEach(() => {
    try {
      unlinkSync(outputFilePath);
    } catch {
      // ignore
    }
  });

  it('should be able to generate audio', async function () {
    this.timeout(30000);
    await tts.generateAudio(`
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-ChristopherNeural">
            Hello!
        </voice>
      </speak>
      `, {
      outputFilePath,
      serviceRegion: 'australiaeast',
      subscriptionKey: process.env.TTS_SUBSCRIPTION_KEY,
    });
    expect(existsSync(outputFilePath)).to.be.true;
    const duration = await getAudioFileDuration(outputFilePath);
    console.log(duration);
    expect(duration > 10);
    await playMp3File(outputFilePath);
  });
});
