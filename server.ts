import express from 'express'
import bodyParser from 'body-parser'
import {
  JSONRPCServer,
  TypedJSONRPCServer,
  createJSONRPCErrorResponse,
} from 'json-rpc-2.0'

type Methods = {
  echo(params: { message: string }): string
  sum(params: { x: number; y: number }): number
  terminals_list(params: { user_id: string }): string[]
  terminals_block(params: { serial_number: string; model: string }): string
  test_filipe(params: { nome: string; idade: number }): string
}

const server: TypedJSONRPCServer<Methods> = new JSONRPCServer()

// @ts-ignore
const logMiddleware = (next, request, serverParams) => {
  console.log(`Received ${JSON.stringify(request)}`)
  // @ts-ignore
  return next(request, serverParams).then((response) => {
    // @ts-ignore
    console.log(`Responding ${JSON.stringify(response)}`)
    // @ts-ignore
    return response
  })
}

// @ts-ignore
const exceptionMiddleware = async (next, request, serverParams) => {
  try {
    // @ts-ignore
    return await next(request, serverParams)
  } catch (error) {
    // @ts-ignore
    if (error.code) {
      // @ts-ignore
      return createJSONRPCErrorResponse(request.id, error.code, error.message)
    } else {
      throw error
    }
  }
}
server.applyMiddleware(logMiddleware, exceptionMiddleware)

// @ts-ignore
const verifyAge = async ({ nome, idade }: any) => {
  throw new Error('oieeees')
}

// First parameter is a method name.
// Second parameter is a method itself.
// A method takes JSON-RPC params and returns a result.
// It can also return a promise of the result.
server.addMethod('echo', ({ message }) => message)
server.addMethod('sum', ({ x, y }) => x + y)
server.addMethod('terminals_list', ({ user_id }) => ['alan o brabo, milho'])
server.addMethod('terminals_block', ({ serial_number, model }) => 'OK')
server.addMethod('test_filipe', verifyAge)

const app = express()
app.use(bodyParser.json())

app.post('/json-rpc', (req: any, res: any) => {
  const jsonRPCRequest = req.body

  console.log(req.body)

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
