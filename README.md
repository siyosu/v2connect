# v2connect

Javascript wrapper for SMM with V2 API.

## Installation
```bash
npm i v2connect
```

## Usage
```ts
import { Provider } from 'v2connect'

// create new instance
const smm = new Provider(process.env.PROVIDER_URL, process.env.PROVIDER_KEY);

(async () => {
  try {
    // check your balance on the provider
    const balance = await smm.balance()
    // get all services from the provider
    const services = await smm.services()
    console.log({ balance, services })
  }
  catch (error) {
    console.error(error)
  }
})()
```

## API
| Methods | Description|
| :-------- | :------- |
| `.services()` | Get all services from the provider
| `.balance()` | Check balance
| `.add()` | Create new order
| `.status()` | Get order status
| `.refill()` | Create refill
| `.refill_status()` | Get refill status
| `.cancel()` | Cancel order

## License

[MIT](./LICENSE)
