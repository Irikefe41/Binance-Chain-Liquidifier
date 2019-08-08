"use strict"

const trader = require('../trader/dexAPI')

class topBook {
    constructor(privateKey, address, pair, stepPrice, side, total, priceLimit) {
        // Members...        
        this._privateKey = privateKey
        this._address = address;
        this._pair = pair
        this._stepPrice = stepPrice
        this._side = side
        this._total = total
        this._priceLimit = priceLimit
        this._minOrder = 0.15 
        this._orderStamp = {}
        this._trader = trader.init(privateKey, address)
        this._trackHash = ''
        this._orderFlag = false
    }

    run(filled){
        // For every stream update 'run' checks if an order exists and creates a new order if not.
        // Tracks the position of the created order on the orderBook and updates it to first position if displaced.
        // Returns ordered and filled status flags.

        let bookUpdate = this.parseOrderBook()

        if (!self._orderFlag){
            let priceUpdate = this.updatePrice(bookUpdate.price)

            if(priceUpdate.status){
                
                try{
                    //order.addr, order.sym, order.realside, order.price, order.amt, sequence
                    let prepOrder = {
                        addr:this._address, 
                        sym: this._pair,
                        side: this._side, 
                        price: priceUpdate.newPrice, 
                        amt: priceUpdate.amount,
                        realside: priceUpdate.realside
                    }
                    order = self._trader.newTrade(prepOrder)
                
                    self._trackHash = order.hash
                    self._orderFlag = order.orderStatus

                }catch(e){
                    console.log(e)
                    console.log('Error creating order...')
                }
            }else{
                console.log('Possibly price update exceeds price limit.')
            }
        }else{            
            let orderInfo = self.trackOrder()

            if(orderInfo.isOpen){
                console.log(`Order for ${this._pair} is still opened`)

            }
        }
    }

    trackOrder(){
        //Confims if order is still opened.
        //Returns status flag and extra order information
        return {
            "isOpen": status
        }
    }
    
    updatePrice(price){
        // Given price, update the newOrder price and check if the 
        // update price exceeds the price limit
        // Returns the updated Price,exceed flag and amount for future order if allowed.
                
        let status = true
        let amt = 0.0
        let dside = 0
        let newPrice = 0.0

        if (this._side === 'bids'){
            console.log('Updating bid price...')
            newPrice = price * (1 + (this._stepPrice/100))
            amt = this._total / newPrice
            dside = 1

            // message = "Buying {} now with a threshold price of {}".format(self.pair, self.max_price)
            // publish(message) 
            if (newPrice > this._priceLimit){
                status = false
            }
        }else if (this._side === 'asks'){
            console.log('Updating ask price...')
            newPrice = price * (1 - (this._stepPrice/100))
            amt = this._total * newPrice
            dside = 2

            // message = "Buying {} now with a threshold price of {}".format(self.pair, self.max_price)
            // publish(message) 
            if (newPrice < this._priceLimit){
                status = false
            }
        }else{
            throw "Invalid marketside ! Use either bids or asks"
        }
        return {
            amount: amt,
            newPrice: newPrice,
            status: status,
            realside: dside
        }
    }

    parseOrderBook(){
        // Consume stream from the streamer producer
        // Returns orders on the top of the queried orderBook.

        topOrder = listBook[0]
        return {
                "price": parseFloat(topOrder[0]), 
                "amount": parseFloat(topOrder[1])
                }
        
    }

    parseOrderEvents(){
        return events
    }
}

module.exports = topBook


