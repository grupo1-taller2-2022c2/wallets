const WalletAlreadyExistsForUser = require('../services/exceptions');

function schema() {
  return {
    body: {
      type: 'object',
      properties: {
        user_id: { type: 'integer' }
      },
      required: ["user_id"],
    }
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const user_id = req.body.user_id
    console.log(user_id)
    try {
      const body = await walletService.createWallet(user_id);
      return reply.code(200).send(body);
    } catch (e) {
      if (e instanceof WalletAlreadyExistsForUser) {
        return reply.code(409).send("Error: Wallet already created for this user_id");
      } else {
        throw e; // devuelve internal server error
      }
    }
  };
}

module.exports = { handler, schema };
