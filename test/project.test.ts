import { assert } from 'chai';

import { useEnvironment } from './helpers';

describe('Integration tests', function () {
  describe('Hardhat Runtime Environment extension', function () {
    useEnvironment('hardhat-project');

    // EIP-2470 Deployer has pretty short ABI, and is deployed on most networks
    const testAddress = '0xce0042B868300000d44A59004Da54A005ffdcf9f';
    const testABI = 'function deploy(bytes _initCode, bytes32 _salt) returns (address createdContract) @8500000';

    it('should get the Contract ABI from Etherscan', async function () {
      // @ts-ignore
      const contract = await this.env.ethers.getVerifiedContractAt(testAddress);
      const abi = contract.interface.format()
      assert.equal(abi.length, 1);
      assert.equal(abi[0], testABI);
    });
  });
});
