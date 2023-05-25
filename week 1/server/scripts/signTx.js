const secp = require("ethereum-cryptography/secp256k1")
const keccak = require("ethereum-cryptography/keccak")
const {toHex, utf8ToBytes, hexToBytes , bytesToUtf8} = require("ethereum-cryptography/utils")

function hashMessage(message){
    return keccak.keccak256(utf8ToBytes(message))
}

function signTrans(sender, amount, receiver, nonce, privateKey){
    const message = "" + sender + amount + receiver + nonce
    const messageHash = hashMessage(message)
    return secp.secp256k1.sign(messageHash, privateKey)
}

function signatureToHex(sig) {
    const sig_json = {
        r: sig.r.toString(),
        s: sig.s.toString(),
        recovery: sig.recovery
    }
    return toHex(utf8ToBytes(JSON.stringify(sig_json)))
}

function hexToSig(hexSig) {
    const sig_json = JSON.parse(bytesToUtf8(hexToBytes(hexSig)))
    return new secp.secp256k1.Signature(BigInt(sig_json.r), BigInt(sig_json.s)).addRecoveryBit(sig_json.recovery)
}



const tx = {
    sender: "0238c1fe41d4ca16373d60161657cde02efa3395274fe4b084522d3c4e5649b769",
    amount: 10,
    receiver: "021fafba5bc70372591a4e6ee42b28e55d09df167b884ea7de817d39c3e8c94753",
    nonce: 0
}

const privateKey = "2bf3b8f8ca2e37ed083b78569eced614f85ab4c2b6567d736d0b85e78fd42cae"

const message = "" + tx.sender + tx.amount + tx.receiver + tx.nonce 
const messageHash = toHex(hashMessage(message))
const a = secp.secp256k1.sign(messageHash, privateKey)
console.log("messageHash:" , messageHash)
console.log("signature:" , signatureToHex(a));

module.exports = {hashMessage, hexToSig}

/*
const a_json = {
    r: a.r.toString(),
    s: a.s.toString(),
    recovery: a.recovery
}

const a_serialized = JSON.stringify(a_json)
const a_bytes = utf8ToBytes(a_serialized)
const a_hex = toHex(a_bytes)

// reverse 

const bytes_a = hexToBytes(a_hex)
const serialized_a = bytesToUtf8(bytes_a)
const json_a = JSON.parse(serialized_a)
const recovered = {
    r: BigInt(json_a.r),
    s: BigInt(json_a.s),
    recovery: json_a.recovery
}

const reconstructed_a = new secp.secp256k1.Signature(recovered.r , recovered.s).addRecoveryBit(recovered.recovery)

console.log(reconstructed_a.recoverPublicKey())

//const a = new secp.secp256k1.Signature()
*/
