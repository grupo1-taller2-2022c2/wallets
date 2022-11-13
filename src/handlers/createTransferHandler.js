function schema() {
    return {
      params: {
        type: "object",
        properties: {
          senderUserId: {
            type: "integer",
          },
          receiverUserId: {
            type: "integer",
          },
          amountInEthers: {
            type: "string",
          },
        },
      },
      required: ["senderUserId", "receiverUserId", "amountInEthers"],
    };
  }
  
  function handler({ contractInteraction, walletService }) {
    return async function (req) {
      const sender_wallet = await walletService.getWallet(req.body.senderUserId)
      const receiver_wallet = await walletService.getWallet(req.body.receiverUserId)
      return contractInteraction.transfer(sender_wallet, receiver_wallet, walletService.getDeployerWallet(), req.body.amountInEthers);
    };
  }
  
  module.exports = { schema, handler };
  