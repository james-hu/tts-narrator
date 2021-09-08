import * as stream from 'stream';
import { timeoutReject } from '@handy-common-utils/promise-utils';
import Speaker = require('speaker');
import * as AV from 'av';
import 'mp3';

function toBuffer(arr: Float32Array) {
  return ArrayBuffer.isView(arr) ?
    // To avoid a copy, use the typed array's underlying ArrayBuffer to back
    // new Buffer, respecting the "view", i.e. byteOffset and byteLength
    Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength) :
    // Pass through all other types to `Buffer.from`
    Buffer.from(arr);
}

export function playMp3File(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const asset = AV.Asset.fromFile(filePath);
      asset.decodeToBuffer(buffer => {
        // Initiate the source
        const bufferStream = new stream.PassThrough();
        // Write your buffer
        bufferStream.end(toBuffer(buffer));

        bufferStream.on('end', () => resolve());
        bufferStream.on('error', error => reject(error));

        // Pipe it to something else  (i.e. stdout)
        bufferStream.pipe(new Speaker({
          channels: 1,
          bitDepth: 32,
          sampleRate: 16000,
          float: true,
        } as Speaker.Options));
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function getAudioFileDuration(filePath: string): Promise<number> {
  const asset = AV.Asset.fromFile(filePath);
  return timeoutReject(new Promise((resolve, reject) => {
    try {
      asset.get('duration', duration => {
        resolve(duration);
      });
    } catch (error) {
      reject(error);
    }
  }), 20000, new Error(`Unabled to determine audio duration, is the file '${filePath}' corrupted?`));
}
