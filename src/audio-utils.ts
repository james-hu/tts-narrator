import type SpeakerClass from 'speaker';

import { timeoutReject } from '@handy-common-utils/promise-utils';
import * as AV from 'av';
import 'mp3';
import fs from 'node:fs/promises';
import * as stream from 'node:stream';

function toBuffer(arr: Float32Array) {
  return ArrayBuffer.isView(arr) ?
    // To avoid a copy, use the typed array's underlying ArrayBuffer to back
    // new Buffer, respecting the "view", i.e. byteOffset and byteLength
    Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength) :
    // Pass through all other types to `Buffer.from`
    Buffer.from(arr);
}

// loaded class / undefined as not initialised / null as failed to load
let _speakerClass: typeof SpeakerClass | undefined | null;
function getSpeakerClass(errorLogger: (msg: string) => void): any {
  if (_speakerClass === undefined) {
    try {
      // eslint-disable-next-line unicorn/prefer-module
      _speakerClass = require('speaker');
    } catch (error) {
      _speakerClass = null;
      errorLogger(`Library for playing MP3 is not available: ${error}`);
    }
  }
  return _speakerClass;
}

export async function playMp3File(filePath: string, infoLogger: (msg: string) => void): Promise<void> {
  const Speaker = getSpeakerClass(infoLogger);
  if (!Speaker) {
    infoLogger(`Skipped playing MP3 because underlying library is not available: ${filePath}`);
    return;
  }
  const fileContent = await fs.readFile(filePath);
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line import/namespace
      const asset = AV.Asset.fromBuffer(fileContent);
      asset.decodeToBuffer(buffer => {
        // Initiate the source
        const bufferStream = new stream.PassThrough();
        // Write your buffer
        bufferStream.end(toBuffer(buffer));

        // Pipe it to something else  (i.e. stdout)

        const speaker = new Speaker({
          channels: 1,
          bitDepth: 32,
          sampleRate: 16000,
          float: true,
        }); // as Speaker.Options);
        bufferStream.pipe(speaker);
        speaker.on('error', (error: any) => reject(error));
        // speaker.on('end', () => { console.log('piped'); resolve(); });
        speaker.on('close', () => resolve());
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function getAudioFileDuration(filePath: string): Promise<number> {
  const fileContent = await fs.readFile(filePath);
  // eslint-disable-next-line import/namespace
  const asset = AV.Asset.fromBuffer(fileContent);
  return timeoutReject(new Promise((resolve, reject) => {
    try {
      asset.get('duration', duration => {
        resolve(duration);
      });
    } catch (error) {
      reject(error);
    }
  }), 20000, new Error(`Unable to determine audio duration, is the file '${filePath}' corrupted?`));
}
