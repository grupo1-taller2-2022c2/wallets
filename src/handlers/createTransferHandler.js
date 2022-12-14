function schema() {
  return {
    body: {
      type: 'object',
      properties: {
        passenger_user_id: { type: "integer" },
        driver_user_id: { type: "integer" },
        amount_in_ethers: { type: "string" },
      },
      required: ["passenger_user_id", "driver_user_id", "amount_in_ethers"],
    }
  };
}
  
  function handler({ contractInteraction, walletService }) {
    return async function (req) {
      const sender_wallet = await walletService.getWallet(req.body.passenger_user_id)
      const receiver_wallet = await walletService.getWallet(req.body.driver_user_id)
      return contractInteraction.transfer(sender_wallet, receiver_wallet.address, await walletService.getDeployerWallet(), req.body.amount_in_ethers);
    };
  }
  
  module.exports = { schema, handler };
  