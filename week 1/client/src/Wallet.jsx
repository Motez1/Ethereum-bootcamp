import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1"

import {hexToBytes , bytesToUtf8} from "ethereum-cryptography/utils"

function hexToSig(hexSig) {
  const sig_json = JSON.parse(bytesToUtf8(hexToBytes(hexSig)))
  return new secp256k1.Signature(BigInt(sig_json.r), BigInt(sig_json.s)).addRecoveryBit(sig_json.recovery)
}

function Wallet({ address, setAddress, balance, setBalance, signature, setSignature, messageHash, setMessageHash}) {

  async function updateBalance(hash, sign) {
    try {
      const sig = hexToSig(sign)
      const address = sig.recoverPublicKey(hash).toHex();
      setAddress(address);
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (e) {
      setBalance(0)
      setAddress("")
    }
    
  }

  async function onMessageChange(evt) {
    setMessageHash(evt.target.value)
    await updateBalance(evt.target.value, signature)
  }

  async function onSignatureChange(evt) {
    setSignature(evt.target.value)
    await updateBalance(messageHash, evt.target.value)
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        transaction hash
        <input placeholder="Input the transaction hash" value={messageHash} onChange={onMessageChange}></input>
      </label>

      <label>
        Signature
        <input placeholder="Input the transaction signature" value={signature} onChange={onSignatureChange}></input>
      </label>
      

      <div className="balance">Balance: {balance}</div>
      <div className="balance">Address: {address}</div>
    </div>
  );
}

export default Wallet;
