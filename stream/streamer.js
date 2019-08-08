"use strict"
const WebSocket = require('ws')
const useJson = require('../utils/useJson')
const path = require('path')
// const topBot = require('../strategy/topOrder')


const configPath = path.join(__dirname, '../configs/configs.json')
const configs = useJson(configPath)

const url = `wss://dex.binance.org/api/ws/${configs.address}`
const conn = new WebSocket(url)
// const bot = new topBot(configs.privateKey, configs.address, configs.pair, configs.stepPrice, configs.side, configs.total, configs.priceLimit)


conn.onopen = function(evt) {        
    conn.send(JSON.stringify({ method: "subscribe", topic: "orders", address: configs.address}));
    // conn.send(JSON.stringify({ method: "subscribe", topic: configs.subscribeTo, symbols: configs.pair }));
    conn.send(JSON.stringify({ method: "keepAlive" }));
}

conn.onmessage = function(evt) {
    // bot.run()
    console.info('received data', evt.data);
    console.log('New data.......')
};

conn.onerror = function(evt) {
    console.error('an error occurred', evt.data);
};

