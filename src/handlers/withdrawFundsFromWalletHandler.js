function schema() {
    return {
      params: {
        type: "object",
        properties: {
          user_external_wallet_address: {
            type: "string",
          },
          user_id: {
            type: "integer",
          },
          amount_in_ethers: {
            type: "string",
          },
        },
      },
      required: ["user_external_wallet_address", "user_id", "amount_in_ethers"],
    };
  }
  
  function handler({ contractInteraction, walletService }) {
    return async function (req) {
      const user_internal_wallet = await walletService.getWallet(req.params.user_id)
      return contractInteraction.transfer(user_internal_wallet, req.body.user_external_wallet_address, walletService.getDeployerWallet(), req.body.amount_in_ethers);
    };
  }
  
  module.exports = { schema, handler };
  