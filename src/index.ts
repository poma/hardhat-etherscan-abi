import { extendEnvironment, extendConfig } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import "@nomiclabs/hardhat-ethers";
import "./type-extensions";

import { getVerifiedContractAt } from "./helpers";
import { etherscanConfigExtender } from "./config";

extendConfig(etherscanConfigExtender);

extendEnvironment((hre) => {
  const prevEthers = hre.ethers;
  hre.ethers = lazyObject(() => {
    // @ts-ignore
    prevEthers.getVerifiedContractAt = getVerifiedContractAt.bind(null, hre);
    return prevEthers;
  });
});
