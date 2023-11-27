# poc-json-rpc

## Start server

```bash
npm run dev
```

## Test method echo:

Body req:

```json
{
  "method": "echo",
  "jsonrpc": "2.0",
  "params": {
    "text": "Test World!"
  },
  "id": "darlan"
}
```

## Test method log:

Body req:

```json
{
  "method": "log",
  "jsonrpc": "2.0",
  "params": {
    "message": "Hello World!"
  },
  "id": "darlan"
}
```
