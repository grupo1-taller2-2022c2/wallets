const ethers = require("ethers");
const _config = require("../config")
const { findWalletByUserId, insertWallet, findAllWallets } = require("../cruds/walletCruds");
const WalletAlreadyExistsForUser = require("./exceptions");

const getDeployerWallet =
  ({ config }) =>
  async () => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const wallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
    wallet["balance"] = await getBalance(wallet)
    console.log("Deployer wallet" + wallet.address);
    return wallet;
  };

const createWallet =
  ({ config }) =>
  async (user_id) => {
    //chequeamos que no haya ya una wallet con ese user_id
    const existing_wallet = await findWalletByUserId(user_id)
    if (existing_wallet != null){
      throw new WalletAlreadyExistsForUser
    }

    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    // This may break in some environments, keep an eye on it
    const wallet = ethers.Wallet.createRandom().connect(provider);
    const created_wallet = insertWallet(user_id, wallet.address, wallet.privateKey)
    return created_wallet
  };

const getWalletsData = () => async () => {
  let users_wallets  = await findAllWallets();
  for (let user_wallet of users_wallets){
    user_wallet["balance"] = await getBalance(user_wallet)
  }
  return users_wallets
};

const getWalletData = () => async (user_id) => {
  let user_wallet = await findWalletByUserId(user_id);
  // A lo que viene de la DB le agregamos el balance
  user_wallet["balance"] = await getBalance(user_wallet)
  return user_wallet
};

const getWallet =
  ({ config }) =>
  async (user_id) => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const user_wallet = await findWalletByUserId(user_id)
    return new ethers.Wallet(user_wallet.private_key, provider);
  };

const getBalance = 
  async (wallet) => {
    const provider = new ethers.providers.AlchemyProvider(_config.network, process.env.ALCHEMY_API_KEY);
    const balanceInWei = await provider.getBalance(wallet.address)
    const balanceInEth = ethers.utils.formatEther(balanceInWei)
    return balanceInEth
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
});
