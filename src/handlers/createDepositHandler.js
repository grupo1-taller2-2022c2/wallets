function schema() {
  return {
    params: {
      type: "object",
      properties: {
        senderUserId: {
          type: "integer",
        },
        amountInEthers: {
          type: "string",
        },
      },
    },
    required: ["senderUserId", "amountInEthers"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    return contractInteraction.deposit(await walletService.getWallet(req.body.senderUserId), req.body.amountInEthers);
  };
}

module.exports = { schema, handler };
