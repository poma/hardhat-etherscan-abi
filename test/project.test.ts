import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
const expect = chai.expect;

import { useEnvironment, sleep } from "./helpers";

describe("Integration tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    // EIP-2470 Deployer has pretty short ABI, and is deployed on most networks
    const testAddress = "0xce0042B868300000d44A59004Da54A005ffdcf9f";
    const testABI = "function deploy(bytes _initCode, bytes32 _salt) returns (address createdContract) @8500000";
    const eoaAddress = "0x000000000000000000000000000000000000dEaD";

    it("should get the Contract ABI from Etherscan", async function () {
      // @ts-ignore
      const contract = await this.env.ethers.getVerifiedContractAt(testAddress);
      const abi = contract.interface.format();
      expect(abi.length).to.be.equal(1);
      expect(abi[0]).to.be.equal(testABI);
    });

    it("should display rate limit error", async function () {
      // @ts-ignore
      await expect(this.env.ethers.getVerifiedContractAt(testAddress)).to.be.rejectedWith(
        "Max rate limit reached, please provide an Etherscan API token via hardhat config.\nE.g.: { [...], etherscan: { apiKey: 'an API key' }, [...] }\nSee https://etherscan.io/apis"
      );
    });

    it("should detect bad address", async function () {
      // @ts-ignore
      await expect(this.env.ethers.getVerifiedContractAt("foo")).to.be.rejectedWith(
        "foo is an invalid address."
      );
    });

    it("should correctly fail on unverified contracts", async function () {
      await sleep(10000); // make sure etherscan doesn't rate limit after previous test
      // @ts-ignore
      await expect(this.env.ethers.getVerifiedContractAt(eoaAddress)).to.be.rejectedWith(
        "The Etherscan API responded with a failure status.\nReason: Contract source code not verified"
      );
    });
  });
});
