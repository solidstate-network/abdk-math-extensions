# SolidState Extensions for ABDK Libraries

SolidState extensions for the `abdk-libraries-solidity` [package](https://www.npmjs.com/package/abdk-libraries-solidity). Developed as a part of the [Premia Finance smart contracts](https://github.com/Premian-Labs/premia-contracts). SolidState, Premia, and this package are not affiliated with ABDK.

## Installation

Install the package as well as the required ABDK package as development dependencies:

```bash
yarn add --dev @solidstate/abdk-math-extensions abdk-libraries-solidity
```

## Development

Install dependencies via Yarn:

```bash
yarn install
```

Setup Husky to format code on commit:

```bash
yarn prepare
```

Compile contracts via Hardhat:

```bash
yarn run hardhat compile
```

The Hardhat environment relies on the following environment variables. The `dotenv` package will attempt to read them from the `.env` file, if it is present.

| Key          | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `REPORT_GAS` | if `true`, a gas report will be generated after running tests |

### Networks

By default, Hardhat uses the Hardhat Network in-process. Two additional networks, `mainnet` and `testnet` are available, and their behavior is determined by the configuration of environment variables.

### Testing

Test contracts via Hardhat:

```bash
yarn run hardhat test
```

Activate gas usage reporting by setting the `REPORT_GAS` environment variable to `"true"`:

```bash
REPORT_GAS=true yarn run hardhat test
```

Generate a code coverage report using `solidity-coverage`:

```bash
yarn run hardhat coverage
```
