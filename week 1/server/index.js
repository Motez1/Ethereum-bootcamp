const express = require("express");
const app = express();
const cors = require("cors");
const {hashMessage, hexToSig} = require("./scripts/signTx.js")
const {secp256k1} = require("ethereum-cryptography/secp256k1.js")
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0238c1fe41d4ca16373d60161657cde02efa3395274fe4b084522d3c4e5649b769": 100,
  "021fafba5bc70372591a4e6ee42b28e55d09df167b884ea7de817d39c3e8c94753": 50,
  "03b8bbdfb15cbe7c1f645d7f5838ed1841da6f45559d5f13d95fa4e04a7dd5c593": 75,
};

const nonces = {
  "0238c1fe41d4ca16373d60161657cde02efa3395274fe4b084522d3c4e5649b769": 0,
  "021fafba5bc70372591a4e6ee42b28e55d09df167b884ea7de817d39c3e8c94753": 0,
  "03b8bbdfb15cbe7c1f645d7f5838ed1841da6f45559d5f13d95fa4e04a7dd5c593": 0,
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature} = req.body;
  
  const messageHash = hashMessage("" + sender + amount + recipient + nonces[sender])
  const sig = hexToSig(signature)
  const isValid = secp256k1.verify(sig,messageHash,sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (!isValid){
    res.status(400).send({ message: "Not a valid transaction!" });
  }
  else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    nonces[sender]++;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
