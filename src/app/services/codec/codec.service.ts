import { Injectable } from '@angular/core';
import { compressToBase64, decompressFromBase64, compress, compressToUTF16, compressToUint8Array, compressToEncodedURIComponent } from 'lz-string';

@Injectable({
  providedIn: 'root'
})
export class CodecService {

  private BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor() { }
  
  public compress(data: string): string {
    return this.base62Encode(parseInt(data));
  }

  public decompress(data: string): string {
    return String(this.base62Decode(data));
  }

  private base62Encode(num: number): string {
    if (num === 0) {
      return this.BASE62_ALPHABET[0];
    }

    const base = this.BASE62_ALPHABET.length;
    let encoded = '';

    while (num > 0) {
      const rem = num % base;
      encoded = this.BASE62_ALPHABET[rem] + encoded;
      num = Math.floor(num / base);
    }

    return encoded;
  }

  private base62Decode(encodedStr: string): string {
    const base = BigInt(this.BASE62_ALPHABET.length);
    let num = BigInt(0);
  
    for (const char of encodedStr) {
      num = num * base + BigInt(this.BASE62_ALPHABET.indexOf(char));
    }
  
    return num.toString();
  }
}
