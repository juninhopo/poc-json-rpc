import { JSONRPCClient, TypedJSONRPCClient } from 'json-rpc-2.0'

type Methods = {
  echo(params: { message: string }): string
  sum(params: { x: number; y: number }): number
}

const client: TypedJSONRPCClient<Methods> = new JSONRPCClient(
  (jsonRPCRequest) =>
    fetch('http://localhost:3000/json-rpc', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(jsonRPCRequest),
    }).then((response) => {
      if (response.status === 200) {
        // Use client.receive when you received a JSON-RPC response.
        return response
          .json()
          .then((jsonRPCResponse: any) => client.receive(jsonRPCResponse))
      } else if (jsonRPCRequest.id !== undefined) {
        return Promise.reject(new Error(response.statusText))
      }
    })
)

// JSONRPCClient needs to know how to send a JSON-RPC request.
// Tell it by passing a function to its constructor. The function must take a JSON-RPC request and send it.

// Use client.request to make a JSON-RPC request call.
// The function returns a promise of the result.
// client.request('sum', { x: 5, y: 10 }).then((result) => console.log(result))
client.request('echo', { message: 'Test Emerson' }).then(console.log)

// Use client.notify to make a JSON-RPC notification call.
// By definition, JSON-RPC notification does not respond.
// client.notify('log', { message: 'Hello, World!' })
