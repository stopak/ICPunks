import dfxConfig from "../../../dfx.json";

const DFX_NETWORK = process.env.REACT_APP_DFX_NETWORK || "ic";


export function getHost() {
  if (DFX_NETWORK === 'ic')
    return dfxConfig.networks.ic.providers[0];
  
  return dfxConfig.networks.local.bind;
}