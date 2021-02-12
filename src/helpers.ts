import { toGetAbiRequest } from "./etherscan/EtherscanGetAbiRequest";
import { getEtherscanEndpoints } from "./network/prober";
import { getAbi } from "./etherscan/EtherscanService";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import { ethers } from "ethers";

const pluginName = "hardhat-etherscan-abi";

export async function getVerifiedContractAt(
  hre: HardhatRuntimeEnvironment,
  address: string,
  signer?: ethers.Signer
): Promise<ethers.Contract> {
  const { isAddress } = await import("@ethersproject/address");
  if (!isAddress(address)) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `${address} is an invalid address.`
    );
  }

  const request = toGetAbiRequest({
    // @ts-ignore
    apiKey: hre.config.etherscan.apiKey,
    address,
  });
  const endpoint = await getEtherscanEndpoints(hre.network.provider, hre.network.name);
  const abi = await getAbi(endpoint.apiURL, request);

  return hre.ethers.getContractAt(abi, address, signer);
}
