const WalletDB = require("../models/Wallet")

const findWalletByUserId = async (user_id) => {
    return await WalletDB.find({user_id: user_id}).exec()
}

const insertWallet = async (user_id, address, private_key) => {
    const wallet = {
        user_id: user_id,
        address: address,
        private_key: private_key
    }
    return await WalletDB.create(wallet)
}

module.exports = {
    findWalletByUserId,
    insertWallet
}