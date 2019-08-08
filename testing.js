const WebSocket = require('ws')
const useJson = require('./utils/useJson')
const path = require('path')
let Disruptor = require('shared-memory-disruptor').Disruptor


const configPath = path.join(__dirname, './configs/configs.json')
let d = new Disruptor('/example', 1000, 4, 1, -1, true, true); (1)

const configs = useJson(configPath)

const conn = new WebSocket("wss://testnet-dex.binance.org/api/ws");
// const bot = new topBot(configs.

conn.onopen = function(evt) {
    // conn.send(JSON.stringify({ method: "subscribe", topic: "orders", address: configs.address}));
    conn.send(JSON.stringify({ method: "keepAlive" }));
    conn.send(JSON.stringify({ method: "subscribe", topic: configs.subscribeTo, symbols: configs.pair }));
}

conn.onmessage = function(evt) {
    // bot.run()
    let buf = d.produceClaimSync(); (2)
    buf.writeUInt32LE(evt.data, 0, true);
    d.produceCommitSync(); (3)
    // console.info('received data', evt.data);
    console.log('New data.......')
};
conn.onerror = function(evt) {
    console.error('an error occurred', evt.data);
};