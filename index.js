var express = require("express");
var bodyParser = require('body-parser');
var XiabingChain = require('./xiabingchain')

var http_port = process.env.HTTP_PORT || 8888;

var block = new XiabingChain()
var initHttpServer = () => {
  var app = express();
  app.use(bodyParser.json());

  app.get('/blocks', (req, res) => res.send(JSON.stringify({
    chain: block.chain,
    length: block.chain.length,
  })));

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


  app.post('/mine', (req, res) => {
    var newBlock = generateNextBlock(req.body.data);
    addBlock(newBlock);
    broadcast(responseLatestMsg());
    console.log('block added: ' + JSON.stringify(newBlock));
    res.send();
  });
  app.get('/peers', (req, res) => {
    res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
  });
  app.post('/addPeer', (req, res) => {
    connectToPeers([req.body.peer]);
    res.send();
  });
  app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};

initHttpServer()
