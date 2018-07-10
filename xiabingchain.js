var CryptoJS = require("crypto-js");
var URL = require('url-parse');
class XiabingChain {
  constructor(obj) {
    this.chain = []
    this.current_transactions = []
    this.nodes = new Set()
    this.new_block(1, 100)
  }
  register_node(address) {
    var url = new URL(address)
    this.nodes.add(url.pathname)
  }
  valid_chain(chain) {
    var last_block = chain[0]
    var current_index = 1
    while (current_index < chain.length) {
      var block = chain[current_index]
      var last_block_hash = this.hash(last_block)
      if (block['previous_hash'] != last_block_hash) {
        return false
      }
      if (!this.valid_proof(last_block['proof'], block['proof'], last_block_hash)) {
        return false
      }
      last_block = block
      current_index += 1
    }
    return true
  }
  new_block(proof, previous_hash) {
    let block = {
      'index': (this.chain.length) + 1,
      'timestamp': new Date().getTime(),
      'transactions': this.current_transactions,
      'proof': proof,
      'previous_hash': previous_hash ? previous_hash: this.hash(this.chain[this.chain.length - 1]),
    }
    this.current_transactions = []
    this.chain.push(block)
    return block
  }
  last_block(){
    return this.chain[this.chain.length - 1]
  }
  new_transaction(sender, recipient, amount){
    this.current_transactions.push({
      'sender': sender,
      'recipient': recipient,
      'amount': amount,
    })
    return this.last_block['index'] + 1
  }
  hash(block){
    CryptoJS.SHA256(JSON.stringify(block)).toString();
  }
  proof_of_work(last_proof) {
    let proof = 0
    while(!this.valid_proof(last_proof, proof)) {
      proof += 1
    }
    return proof
  }
  valid_proof(last_proof, proof){
    let guess = '' + last_proof + proof
    console.log('guess', guess)
    const guess_hash = CryptoJS.SHA256(guess).toString(CryptoJS.enc.Hex)
    console.log('guess_hash', guess_hash)
    return guess_hash.substr(0, 4) === '0000'
  }
}

module.exports = XiabingChain
