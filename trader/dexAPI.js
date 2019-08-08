"use strict"
const axios = require('axios')
const api = 'https://dex.binance.org/'

const bnbClient = require('@binance-chain/javascript-sdk')
const client = new bnbClient(api)
const httpClient = axios.create({ baseURL:api });


let sequenceURL = ''
let sequence = 0
let address = ''


async function init(privy, address){
  //Initializes the DEX client and sets the privateKey.
    sequenceURL = `${api}api/v1/account/${address}/sequence`
    await client.chooseNetwork('mainnet')
    await client.setPrivateKey(privy)
    await client.initChain()
    console.log('Binance chain client fully initialized... ')
}

const newOrder = function (order, callback){
    // Execute a limit order trade on the Dex using the parameters addr, sym, side, price, amt.
    // Returns the successfully created order hash and a status flag.
    
    address = order.addr
    console.log(`Creating order for ${order.sym}...`)
    httpClient.get(sequenceURL).then((res) => {
      sequence = res.data.sequence || 0
      console.log(sequence)
      return client.placeOrder(order.addr, order.sym, order.realside, order.price, order.amt, sequence)
  })
    .then((result) => {
      console.log(result);
      if (result.status === 200) {
        console.log(Date(Date.now()).toString())
        let orderlog = `Successfully ordered ${order.amt} of ${order.sym} at ${order.price} on the ${order.side} side`
        console.log(orderlog)
        const out = {
          address: address,
          sym: order.sym,
          hash: result.result[0].hash,
          orderStatus: true,
          sequenceNo: sequence,
          orderID: JSON.parse(result.result[0].data).order_id
      }
        // console.log(out)
        return callback(out)
      } else {
        console.error('error', result);
      }
  })
    .catch((error) => {
      console.error('caught error', error);
  });
}


const triggerOrderEvent = function(order){
  newOrder(order, (data) => {    
    cancelOrder(data)
    console.log('Successfully completed dummy order event...')
  })
}


// client.cancelOrder(fromAddress, symbols, orderIds, refids, sequence)
const cancelOrder = function (info){
  client.cancelOrder(info.address, info.sym, info.orderID, info.sequence)
  .then((result) => {
    console.log(result);
    if (result.status === 200) {
      console.log(Date(Date.now()).toString())
      let orderlog = `Successfully cancelled order for ${info.sym} to be updated...`
      console.log(orderlog)
      
      return {
          "hash": result.result[0].hash,
          "orderStatus": true
      }
    } else {
      console.error('error', result);
    }
})
  .catch((error) => {
    console.error('error', error);
});
}

// const checkOpenOrders = function (pair, orderInfo){
//   // Checks for opened order information
//   // returns bool status flag and position of the order in the books.

//   httpClient.get(openOrdersUrl).then((res) => {
//     const openOrders = res.data.orders
//     console.log(openOrders)
//     return openOrders
// }).then((orders) => {
//     const status = orders.flag

//     return {
//       "position": position,
//       "status": status
//     }
//   })

// }


module.exports = {
    init: init,
    newOrder: newOrder,
    cancelOrder: cancelOrder,
    triggerOrder: triggerOrderEvent
}