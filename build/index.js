"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GammaCode = void 0;
class GammaCode {
    encodeValue(n) {
        const binaryRepresentation = n.toString(2);
        const totalLen = binaryRepresentation.length * 2 - 1;
        return binaryRepresentation.padStart(totalLen, "0");
    }
}
exports.GammaCode = GammaCode;
