import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  _ABDKMath64x64Constants,
  _ABDKMath64x64Constants__factory,
} from '../typechain-types';

import {
  MIN_64x64,
  MAX_64x64,
  ONE_64x64,
  E_64x64,
  PI_64x64,
} from '../src/constants';

describe('ABDKMath64x64Constants', function () {
  let instance: _ABDKMath64x64Constants;

  before(async function () {
    const [deployer] = await ethers.getSigners();
    instance = await new _ABDKMath64x64Constants__factory(deployer).deploy();
  });

  describe('MIN_64x64', () => {
    it('returns correct value', async () => {
      expect(await instance._MIN_64x64.staticCall()).to.eq(MIN_64x64);
    });
  });

  describe('MAX_64x64', () => {
    it('returns correct value', async () => {
      expect(await instance._MAX_64x64.staticCall()).to.eq(MAX_64x64);
    });
  });

  describe('ONE_64x64', () => {
    it('returns correct value', async () => {
      expect(await instance._ONE_64x64.staticCall()).to.eq(ONE_64x64);
    });
  });

  describe('E_64x64', () => {
    it('returns correct value', async () => {
      expect(await instance._E_64x64.staticCall()).to.eq(E_64x64);
    });
  });

  describe('PI_64x64', () => {
    it('returns correct value', async () => {
      expect(await instance._PI_64x64.staticCall()).to.eq(PI_64x64);
    });
  });
});
