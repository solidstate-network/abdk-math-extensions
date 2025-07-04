import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  ABDKMath64x64Mock,
  ABDKMath64x64Mock__factory,
} from '../typechain-types';

const toFixed = function (bn: bigint) {
  return bn << 64n;
};

const range = function (bits: bigint, signed: boolean) {
  if (signed) {
    return {
      min: -(2n ** (bits / 2n - 1n)),
      max: 2n ** (bits / 2n - 1n) - 1n,
    };
  } else {
    return {
      min: 0n,
      max: 2n ** bits - 1n,
    };
  }
};

describe('ABDKMath64x64', function () {
  let instance: ABDKMath64x64Mock;

  before(async function () {
    const [deployer] = await ethers.getSigners();
    instance = await new ABDKMath64x64Mock__factory(deployer).deploy();
  });

  describe('#fromInt', function () {
    it('returns 64.64 bit representation of given int', async function () {
      const inputs = [0, 1, 2, Math.floor(Math.random() * 1e6)].map(BigInt);

      for (let bn of inputs) {
        expect(await instance.fromInt.staticCall(bn)).to.equal(toFixed(bn));
      }
    });

    describe('reverts if', function () {
      it('input is greater than max int128', async function () {
        const { max } = range(128n, true);

        await expect(instance.fromInt.staticCall(max)).not.to.be.reverted;

        await expect(instance.fromInt.staticCall(max + 1n)).to.be.reverted;
      });

      it('input is less than min int128', async function () {
        const { min } = range(128n, true);

        await expect(instance.fromInt.staticCall(min)).not.to.be.reverted;

        await expect(instance.fromInt.staticCall(min - 1n)).to.be.reverted;
      });
    });
  });

  describe('#toInt', function () {
    it('returns 64 bit integer from 64.64 representation of given int', async function () {
      const inputs = [
        -2,
        -1,
        0,
        1,
        2,
        Math.floor(Math.random() * 1e6),
        -Math.floor(Math.random() * 1e6),
      ].map(BigInt);

      for (let bn of inputs) {
        const representation = await instance.fromInt.staticCall(bn);
        expect(await instance.toInt.staticCall(representation)).to.equal(bn);
      }
    });
  });

  describe('#fromUInt', function () {
    it('returns 64.64 bit representation of given uint', async function () {
      const inputs = [0, 1, 2, Math.floor(Math.random() * 1e6)].map(BigInt);

      for (let bn of inputs) {
        expect(await instance.fromUInt.staticCall(bn)).to.equal(toFixed(bn));
      }
    });

    describe('reverts if', function () {
      it('input is greater than max int128', async function () {
        const { max } = range(128n, true);

        await expect(instance.fromInt.staticCall(max)).not.to.be.reverted;

        await expect(instance.fromInt.staticCall(max + 1n)).to.be.reverted;
      });
    });
  });

  describe('#toUInt', function () {
    it('returns 64 bit integer from 64.64 representation of given uint', async function () {
      const inputs = [1, 2, Math.floor(Math.random() * 1e6)].map(BigInt);

      for (let bn of inputs) {
        const representation = await instance.fromUInt.staticCall(bn);
        expect(await instance.toUInt.staticCall(representation)).to.equal(bn);
      }
    });

    describe('reverts if', function () {
      it('input is negative', async function () {
        const representation = await instance.fromInt.staticCall(-1n);
        await expect(instance.toUInt.staticCall(representation)).to.be.reverted;
      });
    });
  });

  describe('#from128x128', function () {
    it('todo');

    describe('reverts if', function () {
      it('todo');
    });
  });

  describe('#to128x128', function () {
    it('todo');
  });

  describe('#add', function () {
    it('adds two 64x64s together', async function () {
      const inputs = [1, 2, Math.floor(Math.random() * 1e6)].map(BigInt);
      const inputs2 = [3, -4, -Math.floor(Math.random() * 1e6)].map(BigInt);

      for (let i = 0; i < inputs.length; i++) {
        const bn = await instance.fromInt.staticCall(inputs[i]);
        const bn2 = await instance.fromInt.staticCall(inputs2[i]);
        const answer = bn + bn2;
        expect(await instance.add.staticCall(bn, bn2)).to.equal(answer);
      }
    });

    describe('reverts if', function () {
      it('result would overflow', async function () {
        const max = await instance.fromInt.staticCall(0x7fffffffffffffffn);
        const one = await instance.fromInt.staticCall(1);

        await expect(instance.add.staticCall(max, one)).to.be.reverted;
      });
    });
  });

  describe('#sub', function () {
    it('subtracts two 64x64s', async function () {
      const inputs = [1, 2, Math.floor(Math.random() * 1e6)].map(BigInt);
      const inputs2 = [-3, 4, -Math.floor(Math.random() * 1e6)].map(BigInt);

      for (let i = 0; i < inputs.length; i++) {
        const bn = await instance.fromInt.staticCall(inputs[i]);
        const bn2 = await instance.fromInt.staticCall(inputs2[i]);
        const answer = bn - bn2;
        expect(await instance.sub.staticCall(bn, bn2)).to.equal(answer);
      }
    });

    describe('reverts if', function () {
      it('result would overflow', async function () {
        const max = await instance.fromInt.staticCall(0x7fffffffffffffffn);
        const one = await instance.fromInt.staticCall(-1);

        await expect(instance.sub.staticCall(max, one)).to.be.reverted;
      });
    });
  });

  describe('#mul', function () {
    it('multiplies two 64x64s', async function () {
      const inputs = [
        Math.floor(Math.random() * 1e6),
        Math.floor(Math.random() * 1e6),
        -Math.floor(Math.random() * 1e6),
      ].map(BigInt);
      const inputs2 = [
        Math.floor(Math.random() * 1e6),
        -Math.floor(Math.random() * 1e6),
        -Math.floor(Math.random() * 1e6),
      ].map(BigInt);

      for (let i = 0; i < inputs.length; i++) {
        const bn = await instance.fromInt.staticCall(inputs[i]);
        const bn2 = await instance.fromInt.staticCall(inputs2[i]);
        let answer = bn * bn2;
        if (answer > 0n) {
          answer = answer >> 64n;
        } else {
          answer = ((answer * -1n) >> 64n) * -1n;
        }
        expect(await instance.mul.staticCall(bn, bn2)).to.equal(answer);
      }
    });

    describe('reverts if', function () {
      it('result would overflow', async function () {
        const halfOfMax =
          await instance.fromInt.staticCall(4611686018427387904n);
        const two = await instance.fromInt.staticCall(2);

        await expect(instance.mul.staticCall(halfOfMax, two)).to.be.reverted;
      });
    });
  });

  describe('#muli', function () {
    it('multiplies a 64x64 with an int', async function () {
      const inputs = [
        Math.floor(Math.random() * 1e6),
        -Math.floor(Math.random() * 1e6),
      ].map(BigInt);

      for (let i = 0; i < inputs.length; i++) {
        const bn = await instance.fromInt.staticCall(inputs[i]);
        let answer = bn * 7n;
        if (answer > 0n) {
          answer = answer >> 64n;
        } else {
          answer = ((answer * -1n) >> 64n) * -1n;
        }

        expect(await instance.muli.staticCall(bn, 7n)).to.equal(answer);
      }
    });

    describe('reverts if', function () {
      it.skip('input is too small', async function () {
        await expect(
          instance.muli.staticCall(
            -0xffffffffffffffffffffffffffffffffffffffffffffffffn - 1n,
            1n,
          ),
        ).to.be.reverted;
      });

      it.skip('input is too large', async function () {
        await expect(
          instance.muli.staticCall(
            0x1000000000000000000000000000000000000000000000000n + 1n,
            1n,
          ),
        ).to.be.reverted;
      });

      it.skip('result would overflow', async function () {
        const halfOfMax =
          28948022309329048855892746252171976963317496166410141009864396001978282409984n -
          1n;

        await expect(instance.muli.staticCall(halfOfMax, 2n)).to.be.reverted;
      });
    });
  });

  describe('#mulu', function () {
    it('multiplies a 64x64 with an unsigned int', async function () {
      const inputs = [Math.floor(Math.random() * 1e6)].map(BigInt);

      for (let i = 0; i < inputs.length; i++) {
        const bn = await instance.fromInt.staticCall(inputs[i]);
        const answer = (bn * 7n) >> 64n;

        expect(await instance.mulu.staticCall(bn, 7n)).to.equal(answer);
      }
    });

    describe('reverts if', function () {
      it.skip('overflows', async function () {
        await expect(
          instance.mulu.staticCall(
            0xffffffffffffffffffffffffffffffffffffffffffffffffn,
            2,
          ),
        ).to.be.reverted;
      });
    });
  });

  describe('#div', function () {
    it('divides x by y', async function () {
      const x = await instance.fromInt.staticCall(21);
      const y = await instance.fromInt.staticCall(7);
      const answer = await instance.fromInt.staticCall(3);
      expect(await instance.div.staticCall(x, y)).to.equal(answer);
    });

    describe('reverts if', function () {
      it('y is 0', async function () {
        const x = await instance.fromInt.staticCall(21);
        const y = await instance.fromInt.staticCall(0);
        await expect(instance.div.staticCall(x, y)).to.be.reverted;
      });

      it('overflows', async function () {
        await expect(
          instance.div.staticCall(
            170141183460469231731687303715884105727n,
            184467440737n,
          ),
        ).to.be.reverted;
      });
    });
  });

  describe('#divi', function () {
    it('divided x by y where both are ints, result is 64x64', async function () {
      const answer = await instance.fromInt.staticCall(-14);
      expect(await instance.divi.staticCall(42, -3)).to.equal(answer);
    });

    describe('reverts if', function () {
      it('y is 0', async function () {
        await expect(instance.divi.staticCall(99, 0)).to.be.reverted;
      });

      it('overflows', async function () {
        await expect(
          instance.divi.staticCall(
            170141183460469231731687303715884105727n,
            184467440737n,
          ),
        ).to.be.reverted;
      });
    });
  });

  describe('#divu', function () {
    it('divided x by y where both are ints, result is 64x64', async function () {
      const answer = await instance.fromInt.staticCall(14);
      expect(await instance.divu.staticCall(42, 3)).to.equal(answer);
    });

    describe('reverts if', function () {
      it('y is 0', async function () {
        await expect(instance.divu.staticCall(99, 0)).to.be.reverted;
      });

      it('overflows', async function () {
        await expect(
          instance.divu.staticCall(
            170141183460469231731687303715884105727n,
            184467440737n,
          ),
        ).to.be.reverted;
      });
    });
  });

  describe('#neg', function () {
    it('returns the negative', async function () {
      const randomInt = Math.floor(Math.random() * 1e3);
      const input = await instance.fromInt.staticCall(randomInt);
      const answer = BigInt(-input);
      expect(await instance.neg.staticCall(input)).to.equal(answer);
    });

    describe('reverts if', function () {
      it('overflows', async function () {
        await expect(
          instance.neg.staticCall(-0x80000000000000000000000000000000n),
        ).to.be.reverted;
      });
    });
  });

  describe('#abs', function () {
    it('returns the absolute |x|', async function () {
      const randomInt = Math.floor(Math.random() * 1e3);
      const input = await instance.fromInt.staticCall(randomInt);
      expect(await instance.abs.staticCall(input)).to.equal(input);
      const randomIntNeg = Math.floor(-Math.random() * 1e3);
      const inputNeg = await instance.fromInt.staticCall(randomIntNeg);
      expect(await instance.abs.staticCall(inputNeg)).to.equal(
        BigInt(-inputNeg),
      );
    });

    describe('reverts if', function () {
      it('overflows', async function () {
        await expect(
          instance.abs.staticCall(-0x80000000000000000000000000000000n),
        ).to.be.reverted;
      });
    });
  });

  describe('#inv', function () {
    it('returns the inverse', async function () {
      const input = await instance.fromInt.staticCall(20);
      const answer = 922337203685477580n;
      expect(await instance.inv.staticCall(input)).to.equal(answer);
    });

    describe('reverts if', function () {
      it('x is zero', async function () {
        await expect(instance.inv.staticCall(0)).to.be.reverted;
      });
      it('overflows', async function () {
        await expect(instance.inv.staticCall(-1)).to.be.reverted;
      });
    });
  });

  describe('#avg', function () {
    it('calculates average', async function () {
      const inputs = [
        await instance.fromInt.staticCall(5),
        await instance.fromInt.staticCall(9),
      ];
      const answer = await instance.fromInt.staticCall(7);
      expect(await instance.avg.staticCall(inputs[0], inputs[1])).to.equal(
        answer,
      );
    });
  });

  describe('#gavg', function () {
    it('calculates average', async function () {
      const inputs = [
        await instance.fromInt.staticCall(16),
        await instance.fromInt.staticCall(25),
      ];
      const answer = await instance.fromInt.staticCall(20);
      expect(await instance.gavg.staticCall(inputs[0], inputs[1])).to.equal(
        answer,
      );
    });

    describe('reverts if', function () {
      it('has negative radicant', async function () {
        const inputs = [
          await instance.fromInt.staticCall(16),
          await instance.fromInt.staticCall(-25),
        ];
        await expect(instance.gavg.staticCall(inputs[0], inputs[1])).to.be
          .reverted;
      });
    });
  });

  describe('#pow', function () {
    it('calculates power', async function () {
      const input = await instance.fromInt.staticCall(5);
      expect(await instance.pow.staticCall(input, 5)).to.equal(
        57646075230342348800000n,
      );
    });

    describe('reverts if', function () {
      it('overflow', async function () {
        const input = await instance.fromInt.staticCall(2);
        await expect(instance.pow.staticCall(input, 129)).to.be.reverted;
      });
    });
  });

  describe('#sqrt', function () {
    it('calculates square root', async function () {
      const input = await instance.fromInt.staticCall(25);
      expect(await instance.sqrt.staticCall(input)).to.equal(
        92233720368547758080n,
      );
    });

    describe('reverts if', function () {
      it('x is negative', async function () {
        const input = await instance.fromInt.staticCall(-1);
        await expect(instance.sqrt.staticCall(input)).to.be.reverted;
      });
    });
  });

  describe('#log_2', function () {
    it('calculates binary logarithm of x', async function () {
      const input = await instance.fromInt.staticCall(8);
      expect(await instance.log_2.staticCall(input)).to.equal(
        55340232221128654848n,
      );
    });

    describe('reverts if', function () {
      it('x is 0', async function () {
        const input = await instance.fromInt.staticCall(0);
        await expect(instance.log_2.staticCall(input)).to.be.reverted;
      });
    });
  });

  describe('#ln', function () {
    it('calculates natural log of x', async function () {
      const input = await instance.fromInt.staticCall(54);
      expect(await instance.ln.staticCall(input)).to.equal(
        73583767821081474575n,
      );
    });

    describe('reverts if', function () {
      it('x is 0', async function () {
        const input = await instance.fromInt.staticCall(0);
        await expect(instance.ln.staticCall(input)).to.be.reverted;
      });
    });
  });

  describe('#exp_2', function () {
    it('calculate binary exponent of x', async function () {
      const input = await instance.fromInt.staticCall(8);
      expect(await instance.exp_2.staticCall(input)).to.equal(
        4722366482869645213696n,
      );
    });

    describe('reverts if', function () {
      it('overflows', async function () {
        const input = await instance.fromInt.staticCall(64);
        await expect(instance.exp_2.staticCall(input)).to.be.reverted;
      });
    });
  });
});
