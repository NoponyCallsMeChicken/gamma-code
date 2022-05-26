import assert from "assert";
import GammaCode from "../build/index.js";

describe("Functionality", function () {
  describe("#encodeValue()", function () {
    it("should return correct gamma encoding", function () {
      assert.equal(GammaCode.encodeValue(5), "00101");
    });
  });
  describe("#decodeValue()", function () {
    it("should decode numbers correctly", function () {
      var { n, trail } = GammaCode.decodeValue("00101");
      assert.equal(n, 5);
      assert.equal(trail, "");
    });
    it("should keep any trailing data", function () {
      var { n, trail } = GammaCode.decodeValue("0010100110");
      assert.equal(n, 5);
      assert.equal(trail, "00110");
    });
  });
  describe("#encodeSequence()", function () {
    it("should return correct gamma encoding", function () {
      assert.equal(GammaCode.encodeSequence([5, 8, 3, 1]), "0010100010000111");
    });
  });
  describe("#decodeSequence()", function () {
    it("should decode sequences correctly", function () {
      assert.deepEqual(
        GammaCode.decodeSequence("0010100010000111"),
        [5, 8, 3, 1]
      );
    });
    it("should ignore trailing zeros", function () {
      assert.deepEqual(
        GammaCode.decodeSequence("0010100010000111000"),
        [5, 8, 3, 1]
      );
    });
  });
  describe("#encodeRising()", function () {
    it("should return correct gamma encoding", function () {
      assert.equal(
        GammaCode.encodeRising([-17, -15, -8, 4, 12]),
        "00000100010100011100011000001000"
      );
    });
  });
  describe("#decodeRising()", function () {
    it("should decode rising sequences correctly", function () {
      assert.deepEqual(
        GammaCode.decodeRising("00000100010100011100011000001000"),
        [-17, -15, -8, 4, 12]
      );
    });
    it("should ignore trailing zeros", function () {
      assert.deepEqual(
        GammaCode.decodeRising("00000100010100011100011000001000000"),
        [-17, -15, -8, 4, 12]
      );
    });
  });
  describe("#toBinary()", function () {
    it("should convert correctly", function () {
      assert.deepEqual(
        GammaCode.toBinary("00000100010100011100011000001000"),
        Buffer.from([4, 81, 198, 8])
      );
    });
    it("should pad with trailing zeros", function () {
      assert.deepEqual(GammaCode.toBinary("00101"), Buffer.from([40]));
    });
  });
});

describe("Input Security", function () {
  describe("#encodeValue()", function () {
    describe("should fail on", function () {
      it("negative numbers", function () {
        assert.throws(() => GammaCode.encodeValue(-5));
      });
      it("zero", function () {
        assert.throws(() => GammaCode.encodeValue(0));
      });
      it("non-numbers", function () {
        assert.throws(() => GammaCode.encodeValue("Hello World!"));
      });
    });
  });
  describe("#decodeValue()", function () {
    describe("should fail on", function () {
      it("non-strings", function () {
        assert.throws(() => GammaCode.decodeValue(5));
      });
      it("strings with characters other than 1 and 0", function () {
        assert.throws(() => GammaCode.encodeValue("Hello World!"));
        assert.throws(() => GammaCode.encodeValue("15"));
      });
      it("faulty codes", function () {
        assert.throws(() => GammaCode.encodeValue("00010"));
      });
    });
  });
});
