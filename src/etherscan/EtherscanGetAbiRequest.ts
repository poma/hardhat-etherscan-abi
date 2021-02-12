export interface EtherscanRequest {
  apikey: string;
  module: "contract";
  action: string;
}

export interface EtherscanGetAbiRequest extends EtherscanRequest {
  action: "getabi";
  address: string;
}

export function toGetAbiRequest(params: {
  apiKey: string;
  address: string;
}): EtherscanGetAbiRequest {
  return {
    apikey: params.apiKey,
    module: "contract",
    action: "getabi",
    address: params.address,
  };
}
