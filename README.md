# gamma-code

_Encode positive integers, positive integer sequences, and rising integer sequences in (Elias) γ code._

**Elias γ code** is an encoding for positive integers which results in less bits used per integer in a sequence of small numbers. Integers up to 15 can be encoded in less than a byte.

The code is often used to compress sequences of small positive integers (or difference sequences of slowly rising sequences) to save space before saving them to disk or a database.

## Installation

```bash
npm install gamma-code
```

## Usage

```javascript
import { GammaCode } from 'gamma-code';

// Encode a single positive integer
const singleInt = 5;
const singleIntCode = GammaCode.encodeValue(singleInt);
const singleIntDecoded = GammaCode.decodeValue(singleIntCode);

console.log(singleIntCode); // ➡️ 00101 (string)
console.log(singleIntDecoded); // ➡️ 5 (number)

// Encode a positive integer sequence
const intSequence = [5, 8, 3, 1];
const seqEncoded = GammaCode.encodeSequence(intSequence);
const seqDecoded = GammaCode.decodeSequence(seqEncoded);

console.log(seqEncoded); // ➡️ 0010100010000111 (string)
console.log(seqDecoded); // ➡️ [5, 8, 3, 1] (number[])

// Encode a rising integer sequence
const risingSequence = [-17, -15, -8, 4, 12];
const gammaSequence = GammaCode.encodeRising(risingSequence);
const decSequence = GammaCode.decodeRising(gammaSequence);

console.log(gammaSequence); // ➡️ 00000100010100011100011000001000 (string)
console.log(decSequence); // ➡️ [-17, -15, -8, 4, 12] (number[])

// The rising sequence stores a sequence of differences
console.log(GammaCode.decodeSequence("0100011100011000001000")); // ➡️ [2, 7, 12, 8]

// Store as bytes
byteBuffer = GammaCode.binary(singleIntCode);

console.log(byteBuffer); // ➡️ <Buffer 28>
```