const WalletDB = require("../models/Wallet")

const parseQueriesToJson = async (queries) => {
    return queries.map(query => query._doc)
}

const findAllWallets = async () => {
    let queries = await WalletDB.find({}).exec()
    return await parseQueriesToJson(queries)
}

const findWalletByUserId = async (user_id) => {
    let wallet_wrap = await WalletDB.findOne({user_id: user_id}).exec()
    return wallet_wrap == null ? null : wallet_wrap._doc
}

const insertWallet = async (user_id, address, private_key) => {
    const wallet = {
        user_id: user_id,
        address: address,
        private_key: private_key
    }
    const inserted_wallet = await WalletDB.create(wallet)
    return inserted_wallet._doc
}

module.exports = {
    findAllWallets,
    findWalletByUserId,
    insertWallet
}