class XiabingChain {
  constructor(obj) {
    this.chain = []
    this.current_transactions = []
    this.new_block(1, 100)
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
    let guess = last_proof + proof
    const guess_hash = CryptoJS.SHA256(guess).hexdigest()
    return guess_hash.substr(0, 4) === '0000'
  }
}

module.exports = XiabingChain
