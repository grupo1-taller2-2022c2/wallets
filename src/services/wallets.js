const ethers = require("ethers");
const { findWalletByUserId, insertWallet } = require("../cruds/walletCruds");
const WalletAlreadyExistsForUser = require("./exceptions");
const accounts = [];

const getDeployerWallet =
  ({ config }) =>
  () => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    const wallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
    console.log("Deployer wallet" + wallet.address);
    return wallet;
  };

const createWallet =
  ({ config }) =>
  async (user_id) => {
    //chequeamos que no haya ya una wallet con ese user_id
    const existing_wallet = await findWalletByUserId(user_id)
    if (existing_wallet.length != 0){
      throw new WalletAlreadyExistsForUser
    }

    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);
    // This may break in some environments, keep an eye on it
    const wallet = ethers.Wallet.createRandom().connect(provider);
    const created_wallet = insertWallet(user_id, wallet.address, wallet.privateKey)
    accounts.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
    return created_wallet
  };

const getWalletsData = () => () => {
  return accounts;
};

const getWalletData = () => index => {
  return accounts[index - 1];
};

const getWallet =
  ({ config }) =>
  index => {
    const provider = new ethers.providers.AlchemyProvider(config.network, process.env.ALCHEMY_API_KEY);

    return new ethers.Wallet(accounts[index - 1].privateKey, provider);
  };

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
});
