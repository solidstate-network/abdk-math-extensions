import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  _ABDKMath64x64Token,
  _ABDKMath64x64Token__factory,
} from '../typechain-types';

describe('ABDKMath64x64Token', function () {
  let instance: _ABDKMath64x64Token;

  const decimalValues = ['0', '1', '2.718281828459045', '9223372036854775807'];

  const fixedPointValues = [
    '0x00000000000000000',
    '0x10000000000000000',
    '0x2b7e151628aed1975',
    '0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
  ];

  before(async function () {
    const [deployer] = await ethers.getSigners();
    instance = await new _ABDKMath64x64Token__factory(deployer).deploy();
  });

  describe('#toDecimals', function () {
    it('returns scaled decimal representation of 64x64 fixed point number', async function () {
      for (let decimals = 0; decimals < 22; decimals++) {
        for (let fixed of fixedPointValues) {
          const bn = BigInt(fixed);

          expect(await instance._toDecimals.staticCall(bn, decimals)).to.equal(
            (bn * BigInt(`1${'0'.repeat(decimals)}`)) >> 64n,
          );
        }
      }
    });

    describe('reverts if', function () {
      it('given 64x64 fixed point number is negative', async function () {
        for (let decimals = 0; decimals < 22; decimals++) {
          for (let fixed of fixedPointValues.filter((f) => Number(f) > 0)) {
            const bn = -BigInt(fixed);

            await expect(
              instance._toDecimals.staticCall(bn, decimals),
            ).to.be.revertedWith('Transaction reverted without a reason');
          }
        }
      });
    });
  });

  describe('#fromDecimals', function () {
    it('returns 64x64 fixed point representation of scaled decimal number', async function () {
      for (let decimals = 0; decimals < 22; decimals++) {
        for (let decimal of decimalValues) {
          const truncatedArray = decimal.match(
            new RegExp(`^\\d+(.\\d{,${decimals}})?`),
          );

          const truncated = truncatedArray?.[0] ?? '0';

          const bn = ethers.parseUnits(truncated, decimals);

          expect(
            await instance._fromDecimals.staticCall(bn, decimals),
          ).to.equal((bn << 64n) / BigInt(`1${'0'.repeat(decimals)}`));
        }
      }
    });

    describe('reverts if', function () {
      it('given number exceeds range of 64x64 fixed point representation', async function () {
        const max = BigInt('0x7FFFFFFFFFFFFFFF');

        for (let decimals = 0; decimals < 22; decimals++) {
          const bn = (max + 1n) * BigInt(`1${'0'.repeat(decimals)}`) - 1n;

          await expect(instance._fromDecimals.staticCall(bn, decimals)).not.to
            .be.reverted;

          await expect(instance._fromDecimals.staticCall(bn + 1n, decimals)).to
            .be.reverted;
        }
      });
    });
  });

  describe('#toWei', function () {
    it('returns wei representation of 64x64 fixed point number', async function () {
      for (let fixed of fixedPointValues) {
        const bn = BigInt(fixed);

        expect(await instance._toWei.staticCall(bn)).to.equal(
          (bn * BigInt(`1${'0'.repeat(18)}`)) >> 64n,
        );
      }
    });

    describe('reverts if', function () {
      it('given 64x64 fixed point number is negative', async function () {
        for (let fixed of fixedPointValues.filter((f) => Number(f) > 0)) {
          const bn = -BigInt(fixed);

          await expect(instance._toWei.staticCall(bn)).to.be.revertedWith(
            'Transaction reverted without a reason',
          );
        }
      });
    });
  });

  describe('#fromWei', function () {
    it('returns 64x64 fixed point representation of wei number', async function () {
      for (let decimal of decimalValues) {
        const bn = ethers.parseEther(decimal);

        expect(await instance._fromWei.staticCall(bn)).to.equal(
          (bn << 64n) / BigInt(`1${'0'.repeat(18)}`),
        );
      }
    });

    describe('reverts if', function () {
      it('given wei number exceeds range of 64x64 fixed point representation', async function () {
        const max = BigInt('0x7FFFFFFFFFFFFFFF');

        const bn = (max + 1n) * BigInt(`1${'0'.repeat(18)}`) - 1n;

        await expect(instance._fromWei.staticCall(bn)).not.to.be.reverted;

        await expect(instance._fromWei.staticCall(bn + 1n)).to.be.reverted;
      });
    });
  });
});
