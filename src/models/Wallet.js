const mongoose = require('mongoose');
const { Schema } = mongoose;

const walletSchema = new Schema({
  user_id: { type: Number, required: true },
  address: { type: String, required: true },
  private_key: { type: String, required: true }
});

const Wallet = mongoose.model('wallet', walletSchema);

module.exports = Wallet;