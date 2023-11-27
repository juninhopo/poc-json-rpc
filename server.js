const express = require('express')
const bodyParser = require('body-parser')
const { JSONRPCServer } = require('json-rpc-2.0')

const server = new JSONRPCServer()

// First parameter is a method name.
// Second parameter is a method itself.
// A method takes JSON-RPC params and returns a result.
// It can also return a promise of the result.
server.addMethod('echo', ({ text }) => console.log(text))
server.addMethod('log', ({ message }) => console.log(message))

const app = express()
app.use(bodyParser.json())

app.post('/json-rpc', (req, res) => {
  const jsonRPCRequest = req.body

  // Colocando uma Auth
  // const api_key = verifyApiKey() Podemos fazer ele chamar em uma tabela
  // onde fica armazenados as api-key de aplicações que podem utilizar
  // a rota.

  // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
  // It can also receive an array of requests, in which case it may return an array of responses.
  // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
  server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      console.log('Entrou na req')
      res.json(jsonRPCResponse)
    } else {
      // If response is absent, it was a JSON-RPC notification method.
      // Respond with no content status (204).
      console.log('test')
      res.sendStatus(204)
    }
  })
})

const port = 3000

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`)
})
