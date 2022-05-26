export default class GammaCode {
    /**
     * Calculates the gamma code for a positive integer, as a binary string
     * @param n a positive integer
     * @returns the gamma code for this integer
     */
    static encodeValue(n) {
        // Input Checks
        if (typeof n !== "number" || n < 1 || n % 1 !== 0) {
            throw new Error(`Invalid input: n must be a positive integer, ${n} given`);
        }
        const binaryRepresentation = n.toString(2);
        const totalLen = binaryRepresentation.length * 2 - 1;
        return binaryRepresentation.padStart(totalLen, "0");
    }
    /**
     * Retrieves the positive integer encoded in a gamma code, ignoring trailing
     * binary digits
     * @param binaryRepresentation gamma code of a single value, as a binary string
     * @returns the encoded integer and any trailing binary
     */
    static decodeValue(binaryRepresentation) {
        // Input Checks
        if (typeof binaryRepresentation !== "string" ||
            !/^[01]+$/.test(binaryRepresentation)) {
            throw new Error(`Invalid gamma code: ${binaryRepresentation}`);
        }
        let unaryHeader = 0;
        while (binaryRepresentation.startsWith("0")) {
            unaryHeader++;
            binaryRepresentation = binaryRepresentation.substring(1);
        }
        if (binaryRepresentation.length - 1 < unaryHeader) {
            throw new Error(`Invalid gamma code`);
        }
        let binaryN;
        let trail;
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
    static encodeSequence(ns) {
        // Input Checks
        if (typeof ns !== "object" || ns.length === undefined) {
            throw new Error("Invalid input: ns must be an array");
        }
        return ns.map((n) => this.encodeValue(n)).join("");
    }
    /**
     * Retrieves an array of positive integers from its gamma code
     * @param binaryRepresentation Gamma code of an array of positive integers
     * @returns the encoded array
     */
    static decodeSequence(binaryRepresentation) {
        let ns = [];
        while (binaryRepresentation.length > 0 &&
            binaryRepresentation.includes("1")) {
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
    static encodeRising(ns) {
        // Input Checks
        if (typeof ns !== "object" ||
            ns.length === undefined ||
            ns.some((value, index, array) => {
                return index !== 0 && value - array[index - 1] < 1;
            })) {
            throw new Error("Invalid input: ns must be an array of rising numbers");
        }
        if (ns.length === 0) {
            return "";
        }
        const sign = Math.sign(ns[0]) >= 0 ? "1" : "0";
        return (sign +
            this.encodeSequence(ns.map((currentValue, currentIndex, array) => {
                if (currentIndex === 0) {
                    return Math.abs(currentValue);
                }
                return currentValue - array[currentIndex - 1];
            }, "")));
    }
    /**
     * Retrieves an array of rising integers from its gamma code string
     * @param binaryRepresentation Gamma code of an array of rising integers
     * @returns the encoded array
     */
    static decodeRising(binaryRepresentation) {
        if (binaryRepresentation.length < 1) {
            return [];
        }
        const sign = binaryRepresentation.startsWith("0") ? -1 : 1;
        binaryRepresentation = binaryRepresentation.substring(1);
        let ns = this.decodeSequence(binaryRepresentation);
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
    static toBinary(binaryRepresentation) {
        // Input Checks
        if (typeof binaryRepresentation !== "string" ||
            !/^[01]*$/.test(binaryRepresentation)) {
            throw new Error(`Invalid binary string: ${binaryRepresentation}`);
        }
        let targetLength = binaryRepresentation.length;
        if (targetLength % 8 !== 0) {
            targetLength += 8 - (targetLength % 8);
        }
        binaryRepresentation = binaryRepresentation.padEnd(targetLength, "0");
        const byteStrings = binaryRepresentation.match(/[01]{8}/g) || [];
        const bytes = byteStrings.map((bs) => parseInt(bs, 2));
        return Buffer.from(bytes);
    }
    /**
     * Converts bytes to a binary string representation, leaving any trailing zeros
     * intact
     * @param buff represents a Buffer as a string of 1 and 0
     * @returns the string
     */
    static fromBinary(buff) {
        const bytes = Array.from(buff);
        return bytes.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.toString(2);
        }, "");
    }
}
