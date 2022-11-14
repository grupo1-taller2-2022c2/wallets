function schema() {
    return {
      body: {
        type: 'object',
        properties: {
          receiver_user_id: { type: "integer" },
          amount_in_ethers: { type: "string" },
        },
        required: ["receiver_user_id", "amount_in_ethers"],
      }
    };
  }
  
  function handler({ contractInteraction, walletService }) {
    return async function (req) {
      const receiver_wallet = await walletService.getWallet(req.body.receiver_user_id)
      // return contractInteraction.sendPaymentFromSystemWallet(walletService.getDeployerWallet(), 
      //                                                       receiver_wallet.address, 
      //                                                       req.body.amount_in_ethers)
      const system_wallet = walletService.getDeployerWallet()
      return contractInteraction.transfer(system_wallet, receiver_wallet.address, system_wallet, req.body.amount_in_ethers)
    };
  }
  
  module.exports = { schema, handler };
  