import { NomicLabsHardhatPluginError } from "hardhat/plugins";

import { EtherscanGetAbiRequest } from "./EtherscanGetAbiRequest";

const pluginName = "hardhat-etherscan-abi";

export async function getAbi(
  url: string,
  req: EtherscanGetAbiRequest
): Promise<any[]> {
  const parameters = new URLSearchParams({ ...req });
  const urlWithQuery = new URL(url);
  urlWithQuery.search = parameters.toString();

  const { default: fetch } = await import("node-fetch");
  let response;
  try {
    response = await fetch(urlWithQuery);

    if (!response.ok) {
      // This could be always interpreted as JSON if there were any such guarantee in the Etherscan API.
      const responseText = await response.text();
      const message = `The HTTP server response is not ok. Status code: ${response.status} Response text: ${responseText}`;

      throw new NomicLabsHardhatPluginError(pluginName, message);
    }
  } catch (error) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Failure fetching ABI from Etherscan.
Endpoint URL: ${urlWithQuery}
Reason: ${(error as Error).message}`,
        (error as Error)
    );
  }

  const etherscanResponse = new EtherscanAbiResponse(await response.json());

  if (etherscanResponse.isRatelimit()) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Max rate limit reached, please provide an Etherscan API token via hardhat config.
E.g.: { [...], etherscan: { apiKey: 'an API key' }, [...] }
See https://etherscan.io/apis`
    );
  }

  if (!etherscanResponse.isOk()) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `The Etherscan API responded with a failure status.
Reason: ${etherscanResponse.result}`
    );
  }

  try {
    return JSON.parse(etherscanResponse.result);
  } catch (error) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Failure parsing ABI JSON from Etherscan.
Reason: ${(error as Error).message}`,
        (error as Error)
    );
  }
}

export default class EtherscanAbiResponse {
  public readonly status: number;

  public readonly result: string;

  public constructor(response: any) {
    this.status = parseInt(response.status, 10);
    this.result = response.result;
  }

  public isRatelimit(): boolean {
    return this.result === "Max rate limit reached, please use API Key for higher rate limit";
  }

  public isOk(): boolean {
    return this.status === 1;
  }
}
