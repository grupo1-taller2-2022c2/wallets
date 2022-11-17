const getWalletData = require("./handlers/getWalletHandler");
const getWalletsData = require("./handlers/getWalletsHandler");
const createWallet = require("./handlers/createWalletHandler");
const createDeposit = require("./handlers/createDepositHandler");
const getDeposit = require("./handlers/getDepositHandler");
const createTransfer = require("./handlers/createTransferHandler");
const withdrawFundsFromWallet = require("./handlers/withdrawFundsFromWalletHandler")
const getSystemWallet = require("./handlers/getSystemWalletHandler")
const transferFromSystemWallet = require("./handlers/transferFromSystemWalletHandler")
const resetDatabase = require("./handlers/resetDatabaseHandler")

function getWalletDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets/:user_id",
    schema: getWalletData.schema(config),
    handler: getWalletData.handler({ config, ...services }),
  };
}

function getWalletsDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets",
    schema: getWalletsData.schema(config),
    handler: getWalletsData.handler({ config, ...services }),
  };
}

function createWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallets",
    schema: createWallet.schema(config),
    handler: createWallet.handler({ config, ...services }),
  };
}

function withdrawFundsFromWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallets/:user_id/withdrawals",
    schema: withdrawFundsFromWallet.schema(config),
    handler: withdrawFundsFromWallet.handler({ config, ...services }),
  };
}


function createDepositRoute({ services, config }) {
  return {
    method: "POST",
    url: "/deposits",
    schema: createDeposit.schema(config),
    handler: createDeposit.handler({ config, ...services }),
  };
}

function getDepositRoute({ services, config }) {
  return {
    method: "GET",
    url: "/deposits/:txHash",
    schema: getDeposit.schema(config),
    handler: getDeposit.handler({ config, ...services }),
  };
}

function createTransferRoute({ services, config }) {
  return {
    method: "POST",
    url: "/transfers",
    schema: createTransfer.schema(config),
    handler: createTransfer.handler({ config, ...services }),
  };
}

function getSystemWalletRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets/system",
    schema: getSystemWallet.schema(config),
    handler: getSystemWallet.handler({ config, ...services }),
  };
}

function transferFromSystemWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/transfers/system",
    schema: transferFromSystemWallet.schema(config),
    handler: transferFromSystemWallet.handler({ config, ...services }),
  };
}

function resetDatabaseRoute({ services, config }) {
  return {
    method: "DELETE",
    url: "/reset_db",
    schema: resetDatabase.schema(config),
    handler: resetDatabase.handler({ config, ...services }),
  };
}

module.exports = [
  getWalletDataRoute, 
  getWalletsDataRoute, 
  createWalletRoute, 
  // createDepositRoute, 
  // getDepositRoute, 
  createTransferRoute, 
  withdrawFundsFromWalletRoute, 
  getSystemWalletRoute, 
  transferFromSystemWalletRoute,
  resetDatabaseRoute
];
