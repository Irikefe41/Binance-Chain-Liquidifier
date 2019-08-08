"use strict"
const trader = require('./trader/dexAPI')
const useJson = require('./utils/useJson')
const path = require('path')
// const topBot = require('../strategy/topOrder')

const api = 'https://dex.binance.org/'
const configPath = path.join(__dirname, './configs/configs.json')
const configs = useJson(configPath)

const sequenceURL = `${api}api/v1/account/${configs.address}/sequence`


async function trade (configs){
    await trader.init(configs.privateKey, configs.address)

    const orderObj = {
        addr: configs.address,
        sym: configs.pair[0],
        price: 0.0011/4,
        amt: 500,
        side: 'bids',
        realside: 1
    }
    // const cancel = {
    //     address: 'bnb13zq5k5dj36a2ghkdpfc9dzvtxd0rnqt7z7gq99',
    //     sym: 'MDAB-D42_BNB',
    //     hash: '3DD3F517E30E5168C8248C2D6A8FE85BB1C1B8B54A979FE816F0E79822EAD2A9',
    //     orderStatus: true,
    //     sequenceNo: 99,
    //     orderID: '88814B51B28EBAA45ECD0A7056898B335E39817E-100'
    //   }
    trader.triggerOrder(orderObj)
    
}


trade(configs)
console.log('Checking...')

