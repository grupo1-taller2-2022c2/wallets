const ethers = require("ethers");
const { commissionPercentage } = require("../config");
const getDepositHandler = require("../handlers/getDepositHandler");

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const deposits_in_sc = {}; // TODO: persistir depositos y pagos de ser necesario
const payments_to_users = {};

const deposit =
  ({ config }) =>
  async (senderWallet, amountToSend) => {
    const basicPayments = await getContract(config, senderWallet);
    const tx = await basicPayments.deposit({
      value: await ethers.utils.parseEther(amountToSend).toHexString(),
    });
    tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "DepositMade") {
          deposits_in_sc[tx.hash] = {
            senderAddress: firstEvent.args.sender,
            amountSent: firstEvent.args.amount,
          };
        } else {
          console.error(`Payment not created in tx ${tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );
    return tx;
  };

const getDepositReceipt =
  ({}) =>
  async depositTxHash => {
    return deposits_in_sc[depositTxHash];
  };

const sendPaymentFromSystemWallet =
  ({ config }) =>
  async (systemWallet, receiverWalletAddress, amountToSend) => {
    const basicPayments = await getContract(config, systemWallet);
    const tx = await basicPayments.sendPayment(ethers.utils.getAddress(receiverWalletAddress), 
                                              await ethers.utils.parseEther(amountToSend).toHexString());
    tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "PaymentMade") {
          payments_to_users[tx.hash] = {
            receiverAddress: firstEvent.args.receiver,
            amountSent: firstEvent.args.amount,
          };
        } else {
          console.error(`Payment not created in tx ${tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );
    return tx;
};

const transfer =
  ({ config }) =>
  async (senderWallet, receiverWalletAddress, system_wallet, amountToSend) => {
    const basicPayments_sender = await getContract(config, senderWallet);
    const deposit_to_sc_tx = await basicPayments_sender.deposit({
      value: await ethers.utils.parseEther(amountToSend).toHexString(),
    });
    console.log("Making deposit in smart contract -being sender the owner-")
    await deposit_to_sc_tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "DepositMade") {
          deposits_in_sc[deposit_to_sc_tx.hash] = {
            senderAddress: firstEvent.args.sender,
            amountSent: firstEvent.args.amount,
          };
        } else {
          console.error(`Payment not created in tx ${deposit_to_sc_tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );
    console.log("Deposit made in smart contract. Now sending payment from smart contract -being the system the owner- to receiver")
    const amountToReceiver = (parseFloat(amountToSend) * (1 - commissionPercentage)).toString()
    const commission = (parseFloat(amountToSend) * (commissionPercentage)).toString()
    console.log("amount to receiver: " + amountToReceiver)
    console.log("commission: " + commission)

    const basicPayments_system = await getContract(config, system_wallet);
    const payment_to_receiver_tx = await basicPayments_system.sendPayment(ethers.utils.getAddress(receiverWalletAddress), await ethers.utils.parseEther(amountToReceiver).toHexString());
    payment_to_receiver_tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "PaymentMade") {
          payments_to_users[payment_to_receiver_tx.hash] = {
            receiverAddress: firstEvent.args.receiver,
            amountSent: firstEvent.args.amount,
          };
        } else {
          console.error(`Payment not created in tx ${payment_to_receiver_tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );

    console.log("Deposit made in receiver wallet. Now depositing commission to system wallet")
    const deposit_commision_to_system_tx = await basicPayments_system.sendPayment(system_wallet.address, await ethers.utils.parseEther(commission).toHexString());
    deposit_commision_to_system_tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "PaymentMade") {
          payments_to_users[payment_to_receiver_tx.hash] = {
            receiverAddress: firstEvent.args.receiver,
            amountSent: firstEvent.args.amount,
          };
        } else {
          console.error(`Payment not created in tx ${payment_to_receiver_tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );

    console.log(deposits_in_sc)
    console.log(payments_to_users)
    return payment_to_receiver_tx;
  };

  const transferWithoutCommission =
  ({ config }) =>
  async (senderWallet, receiverWalletAddress, system_wallet, amountToSend) => {
    const basicPayments_sender = await getContract(config, senderWallet);
    const deposit_to_sc_tx = await basicPayments_sender.deposit({
      value: await ethers.utils.parseEther(amountToSend).toHexString(),
    });
    console.log("Making deposit in smart contract -being sender the owner-")
    await deposit_to_sc_tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "DepositMade") {
          deposits_in_sc[deposit_to_sc_tx.hash] = {
            senderAddress: firstEvent.args.sender,
            amountSent: firstEvent.args.amount,
          };
        } else {
          console.error(`Payment not created in tx ${deposit_to_sc_tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );
    console.log("Deposit made in smart contract. Now sending payment from smart contract -being the system the owner- to receiver")
    const basicPayments_system = await getContract(config, system_wallet);
    const payment_to_receiver_tx = await basicPayments_system.sendPayment(ethers.utils.getAddress(receiverWalletAddress), await ethers.utils.parseEther(amountToSend).toHexString());
    payment_to_receiver_tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "PaymentMade") {
          payments_to_users[payment_to_receiver_tx.hash] = {
            receiverAddress: firstEvent.args.receiver,
            amountSent: firstEvent.args.amount,
          };
        } else {
          console.error(`Payment not created in tx ${payment_to_receiver_tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );

    console.log("Deposit made in receiver wallet")

    console.log(deposits_in_sc)
    console.log(payments_to_users)
    return payment_to_receiver_tx;
  };

module.exports = dependencies => ({
  deposit: deposit(dependencies),
  getDepositReceipt: getDepositReceipt(dependencies),
  transfer: transfer(dependencies),
  sendPaymentFromSystemWallet: sendPaymentFromSystemWallet(dependencies),
  transferWithoutCommission: transferWithoutCommission(dependencies)
});
