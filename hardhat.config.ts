import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-exposed';
import 'hardhat-gas-reporter';
import 'hardhat-spdx-license-identifier';
import 'solidity-coverage';

import Dotenv from 'dotenv';

Dotenv.config();

const { REPORT_GAS } = process.env;

export default {
  solidity: {
    version: '0.8.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  exposed: { prefix: '_' },

  gasReporter: {
    enabled: REPORT_GAS === 'true',
  },

  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },

  typechain: {
    alwaysGenerateOverloads: true,
  },
};
