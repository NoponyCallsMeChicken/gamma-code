export default class GammaCode {
  /**
   * Calculates the gamma code for a positive integer, as a binary string
   * @param n a positive integer
   * @returns the gamma code for this integer
   */
  static encodeValue(n: number): string {
    // Input Checks
    if (typeof n !== "number" || n < 1 || n % 1 !== 0) {
      throw new Error(
        `Invalid input: n must be a positive integer, ${n} given`
      );
    }
    const binaryRepresentation: string = n.toString(2);
    const totalLen = binaryRepresentation.length * 2 - 1;
    return binaryRepresentation.padStart(totalLen, "0");
  }

  /**
   * Retrieves the positive integer encoded in a gamma code, ignoring trailing
   * binary digits
   * @param binaryRepresentation gamma code of a single value, as a binary string
   * @returns the encoded integer and any trailing binary
   */
  static decodeValue(binaryRepresentation: string): {
    n: number;
    trail: string;
  } {
    // Input Checks
    if (
      typeof binaryRepresentation !== "string" ||
      !/^[01]+$/.test(binaryRepresentation)
    ) {
      throw new Error(`Invalid gamma code: ${binaryRepresentation}`);
    }
    let unaryHeader: number = 0;
    while (binaryRepresentation.startsWith("0")) {
      unaryHeader++;
      binaryRepresentation = binaryRepresentation.substring(1);
    }
    if (binaryRepresentation.length - 1 < unaryHeader) {
      throw new Error(`Invalid gamma code`);
    }
    let binaryN: string;
    let trail: string;
    binaryN = binaryRepresentation.substring(0, unaryHeader + 1);
    trail = binaryRepresentation.substring(unaryHeader + 1);
    return {
      n: parseInt(binaryN, 2),
      trail
    };
  }

  /**
   * Converts a list of positive integers to a gamma code string
   * @param ns an array of positive integers
   * @returns gamma code string of ns
   */
  static encodeSequence(ns: number[]): string {
    // Input Checks
    if (typeof ns !== "object" || ns.length === undefined) {
      throw new Error("Invalid input: ns must be an array");
    }
    return ns.map((n: number) => this.encodeValue(n)).join("");
  }

  /**
   * Retrieves an array of positive integers from its gamma code
   * @param binaryRepresentation Gamma code of an array of positive integers
   * @returns the encoded array
   */
  static decodeSequence(binaryRepresentation: string): number[] {
    let ns: number[] = [];
    while (
      binaryRepresentation.length > 0 &&
      binaryRepresentation.includes("1")
    ) {
      let { n, trail } = this.decodeValue(binaryRepresentation);
      ns.push(n);
      binaryRepresentation = trail;
    }
    return ns;
  }

  /**
   * Compresses a rising list of integers
   * @param ns an array of larger and larger integers
   * @returns gamma code string of ns
   */
  static encodeRising(ns: number[]): string {
    // Input Checks
    if (
      typeof ns !== "object" ||
      ns.length === undefined ||
      ns.some((value: number, index: number, array: number[]): boolean => {
        return index !== 0 && value - array[index - 1] < 1;
      })
    ) {
      throw new Error("Invalid input: ns must be an array of rising numbers");
    }
    if (ns.length === 0) {
      return "";
    }
    const sign: string = Math.sign(ns[0]) >= 0 ? "1" : "0";
    return (
      sign +
      this.encodeSequence(
        ns.map(
          (
            currentValue: number,
            currentIndex: number,
            array: number[]
          ): number => {
            if (currentIndex === 0) {
              return Math.abs(currentValue);
            }
            return currentValue - array[currentIndex - 1];
          },
          ""
        )
      )
    );
  }

  /**
   * Retrieves an array of rising integers from its gamma code string
   * @param binaryRepresentation Gamma code of an array of rising integers
   * @returns the encoded array
   */
  static decodeRising(binaryRepresentation: string): number[] {
    if (binaryRepresentation.length < 1) {
      return [];
    }
    const sign: number = binaryRepresentation.startsWith("0") ? -1 : 1;
    binaryRepresentation = binaryRepresentation.substring(1);
    let ns: number[] = this.decodeSequence(binaryRepresentation);
    ns[0] = sign * ns[0];
    return ns.map((value, index, array) => {
      return array
        .slice(0, index + 1)
        .reduce((sum, currentValue) => sum + currentValue, 0);
    });
  }

  /**
   * Converts a binary string representation to bytes, with trailing zeros,
   * if necessary
   * @param binaryRepresentation a string of 1 and 0
   * @returns a byte Buffer
   */
  static toBinary(binaryRepresentation: string): Buffer {
    // Input Checks
    if (
      typeof binaryRepresentation !== "string" ||
      !/^[01]*$/.test(binaryRepresentation)
    ) {
      throw new Error(`Invalid binary string: ${binaryRepresentation}`);
    }

    let targetLength: number = binaryRepresentation.length;
    if (targetLength % 8 !== 0) {
      targetLength += 8 - (targetLength % 8);
    }
    binaryRepresentation = binaryRepresentation.padEnd(targetLength, "0");
    const byteStrings: string[] = binaryRepresentation.match(/[01]{8}/g) || [];
    const bytes = byteStrings.map((bs) => parseInt(bs, 2));
    return Buffer.from(bytes);
  }

  /**
   * Converts bytes to a binary string representation, leaving any trailing zeros
   * intact
   * @param buff represents a Buffer as a string of 1 and 0
   * @returns the string
   */
  static fromBinary(buff: Buffer): string {
    const bytes: number[] = Array.from(buff);
    return bytes.reduce((previousValue: string, currentValue: number) => {
      return previousValue + currentValue.toString(2);
    }, "");
  }
}
