function schema() {
  return {
    body: {
      type: 'object',
      properties: {
        sender_user_id: { type: 'integer' },
        amount_in_ethers: { type: 'string' }
      },
      required: ["sender_user_id", "amount_in_ethers"],
    }
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    return contractInteraction.deposit(await walletService.getWallet(req.body.sender_user_id), req.body.amount_in_ethers);
  };
}

module.exports = { schema, handler };
