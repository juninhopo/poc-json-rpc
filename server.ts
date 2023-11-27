import express from 'express'
import bodyParser from 'body-parser'
import { JSONRPCServer, TypedJSONRPCServer } from 'json-rpc-2.0'

type Methods = {
  echo(params: { message: string }): string
  sum(params: { x: number; y: number }): number
  terminals_list(params: { user_id: string }): string[]
}

const server: TypedJSONRPCServer<Methods> = new JSONRPCServer()

// First parameter is a method name.
// Second parameter is a method itself.
// A method takes JSON-RPC params and returns a result.
// It can also return a promise of the result.
server.addMethod('echo', ({ message }) => message)
server.addMethod('sum', ({ x, y }) => x + y)
server.addMethod('terminals_list', ({ user_id }) => ['alan o brabo, milho'])

const app = express()
app.use(bodyParser.json())

app.post('/json-rpc', (req: any, res: any) => {
  const jsonRPCRequest = req.body

  console.log(req.body)

  // Colocando uma Auth
  // const api_key = verifyApiKey() Podemos fazer ele chamar em uma tabela
  // onde fica armazenados as api-key de aplicações que podem utilizar
  // a rota.

  // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
  // It can also receive an array of requests, in which case it may return an array of responses.
  // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
  server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse)
    } else {
      // If response is absent, it was a JSON-RPC notification method.
      // Respond with no content status (204).
      res.sendStatus(204)
    }
  })
})

const port = 3000

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`)
})
