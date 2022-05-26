export class GammaCode {
  encodeValue(n: number): string {
    const binaryRepresentation: string = n.toString(2);
    const totalLen = binaryRepresentation.length * 2 - 1;
    return binaryRepresentation.padStart(totalLen, "0");
  }
}
