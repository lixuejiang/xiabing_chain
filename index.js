var express = require("express");
var bodyParser = require('body-parser');
var XiabingChain = require('./xiabingchain')
const uuidv1 = require('uuid/v1');
const node_identifier = uuidv1();

var http_port = process.env.HTTP_PORT || 8888;

var block = new XiabingChain()
var initHttpServer = () => {
  var app = express();
  app.use(bodyParser.json());

  app.get('/blocks', (req, res) => res.send({
    chain: block.chain,
    length: block.chain.length,
  }));

  app.post('/transactions/new', (res, req) => {
    const values = req.body
    const required = ['sender', 'recipient', 'amount']
    if (!require.every(item => item in values)) {
      res.send('参数不合法')
    }
    index = block.new_transaction(values['sender'], values['recipient'], values['amount'])

    response = { 'message': `Transaction will be added to Block ${index}`}
    res.send(
      response
    )
  })


  app.get('/mine', (req, res) => {
    last_block = block.last_block
    last_proof = block['proof'] || 0
    proof = block.proof_of_work(last_proof)

    block.new_transaction("0", node_identifier, 1)
    new_block = block.new_block(proof)

    let response = {
      'message': "New Block Forged",
      'index': new_block['index'],
      'transactions': new_block['transactions'],
      'proof': new_block['proof'],
      'previous_hash': new_block['previous_hash'],
    }
    res.send(response);
  });
  app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};

initHttpServer()
