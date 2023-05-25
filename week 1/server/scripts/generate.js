const  {secp256k1} = require("ethereum-cryptography/secp256k1") 
const  {toHex} = require("ethereum-cryptography/utils") 

const privateKey = secp256k1.utils.randomPrivateKey()

console.log('private key:',toHex(privateKey))

const publicKey = secp256k1.getPublicKey(privateKey)

console.log('public key:',toHex(publicKey))

/*
private key: 2bf3b8f8ca2e37ed083b78569eced614f85ab4c2b6567d736d0b85e78fd42cae
public key: 0238c1fe41d4ca16373d60161657cde02efa3395274fe4b084522d3c4e5649b769

================================================================================
private key: 24c3f459ea095872a49d3b396b1d0423be0f4adab52f7ee38af457dcc5cde109
public key: 021fafba5bc70372591a4e6ee42b28e55d09df167b884ea7de817d39c3e8c94753

================================================================================

private key: 552e4720c9debf91cd1b5d25b8f3d191299b6516e597caebe7aadab8cab77b90
public key: 03b8bbdfb15cbe7c1f645d7f5838ed1841da6f45559d5f13d95fa4e04a7dd5c593
 */