# hardhat-etherscan-abi [![Build Status](https://github.com/poma/hardhat-etherscan-abi/workflows/build/badge.svg)](https://github.com/poma/hardhat-etherscan-abi/actions) [![npm](https://img.shields.io/npm/v/hardhat-etherscan-abi.svg)](https://www.npmjs.com/package/hardhat-etherscan-abi) [![hardhat](https://hardhat.org/buidler-plugin-badge.svg?1)](https://hardhat.org)

[Hardhat](https://hardhat.org) plugin that fetches verified contract ABI from [Etherscan](https://etherscan.io).

## What

This plugin adds extra features on top of `@nomiclabs/hardhat-ethers`. It supports mainnet, bsc, and most common testnets.

## Installation

```bash
npm install --save-dev hardhat-etherscan-abi
```

And add the following statement to your `hardhat.config.js`:

```js
require("hardhat-etherscan-abi");
```

Or, if you are using TypeScript, add this to your `hardhat.config.ts`:

```js
import "hardhat-etherscan-abi";
```

## Tasks

This plugin creates no additional tasks.

## Environment extensions

This object has adds some extra `hardhat-etherscan-abi` specific functionalities by adding new extra fields to `hre.ethers`

### Helpers

These helpers are added to the `ethers` object:

```typescript
export async function getVerifiedContractAt(
  hre: HardhatRuntimeEnvironment,
  address: string,
  signer?: ethers.Signer
): Promise<ethers.Contract>;
```

## Usage

You need to add the following Etherscan config to your `hardhat.config.js` file:

```js
module.exports = {
  networks: {
    mainnet: { ... }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "YOUR_ETHERSCAN_API_KEY"
  }
};
```

Then use the function:

```js
const contract = await hre.ethers.getVerifiedContractAt('<address>');
```

It requires only contract address and will fetch the ABI for the contract automatically from Etherscan
