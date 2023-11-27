import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
  TypedJSONRPCClient,
  TypedJSONRPCServer,
  TypedJSONRPCServerAndClient,
} from 'json-rpc-2.0'

type Methods = {
  echo(params: { message: string }): string
  sum(params: { x: number; y: number }): number
}

const server: TypedJSONRPCServer<Methods> = new JSONRPCServer(/* ... */)
const client: TypedJSONRPCClient<Methods> = new JSONRPCClient(/* ... */)

// Types are infered from the Methods type
server.addMethod('echo', ({ message }) => message)
server.addMethod('sum', ({ x, y }) => x + y)
// These result in type error
// server.addMethod("ech0", ({ message }) => message); // typo in method name
// server.addMethod("echo", ({ messagE }) => messagE); // typo in param name
// server.addMethod("echo", ({ message }) => 123); // return type must be string

client
  .request('echo', { message: 'hello' })
  .then((result) => console.log(result))
client.request('sum', { x: 1, y: 2 }).then((result) => console.log(result))
// These result in type error
// client.request("ech0", { message: "hello" }); // typo in method name
// client.request("echo", { messagE: "hello" }); // typo in param name
// client.request("echo", { message: 123 }); // message param must be string
// client
//   .request("echo", { message: "hello" })
//   .then((result: number) => console.log(result)); // return type must be string

// The same rule applies to TypedJSONRPCServerAndClient
type ServerAMethods = {
  echo(params: { message: string }): string
}

type ServerBMethods = {
  sum(params: { x: number; y: number }): number
}

const serverAndClientA: TypedJSONRPCServerAndClient<
  ServerAMethods,
  ServerBMethods
> = new JSONRPCServerAndClient(/* ... */)
const serverAndClientB: TypedJSONRPCServerAndClient<
  ServerBMethods,
  ServerAMethods
> = new JSONRPCServerAndClient(/* ... */)

serverAndClientA.addMethod('echo', ({ message }) => message)
serverAndClientB.addMethod('sum', ({ x, y }) => x + y)

serverAndClientA
  .request('sum', { x: 1, y: 2 })
  .then((result) => console.log(result))
serverAndClientB
  .request('echo', { message: 'hello' })
  .then((result) => console.log(result))
