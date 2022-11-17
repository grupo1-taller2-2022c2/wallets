const walletCruds = require('../cruds/walletCruds');

function schema() {
  return {
    params: {},
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const body = await walletCruds.deleteAddedWallets();
    return reply.code(200).send("Database reset");
  };
}

module.exports = { handler, schema };
