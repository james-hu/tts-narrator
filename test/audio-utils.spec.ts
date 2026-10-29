import { expect } from 'chai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { getAudioFileDuration } from '../src/audio-utils';

describe('audio-utils', () => {
  describe('getAudioFileDuration', () => {
    let tempDir: string;

    before(async () => {
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tts-narrator-audio-utils-'));
    });

    after(async () => {
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('should return 0 for an empty file', async () => {
      const emptyFile = path.join(tempDir, 'empty.mp3');
      await fs.writeFile(emptyFile, '');
      expect(await getAudioFileDuration(emptyFile)).to.equal(0);
    });

    it('should return the duration of a valid audio file', async () => {
      const duration = await getAudioFileDuration('test/fixtures/one-frame.mp3');
      expect(duration).to.be.greaterThan(0);
      expect(duration).to.be.lessThan(100);
    });

    it('should throw if the file does not exist', async () => {
      const missingFile = path.join(tempDir, 'missing.mp3');
      let error: unknown;
      try {
        await getAudioFileDuration(missingFile);
      } catch (error_) {
        error = error_;
      }
      expect(String(error)).to.match(/ENOENT/);
    });
  });
});
