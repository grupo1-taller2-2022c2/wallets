function schema() {
    return {
      params: {
        type: "object",
        properties: {
          senderId: {
            type: "integer",
          },
          receiverId: {
            type: "integer",
          },
          amountInEthers: {
            type: "string",
          },
        },
      },
      required: ["senderId", "receiverId", "amountInEthers"],
    };
  }
  
  function handler({ contractInteraction, walletService }) {
    return async function (req) {
      return contractInteraction.transfer(walletService.getWallet(req.body.senderId), walletService.getWallet(req.body.receiverId), walletService.getDeployerWallet(), req.body.amountInEthers);
    };
  }
  
  module.exports = { schema, handler };
  