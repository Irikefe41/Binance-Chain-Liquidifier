const fs = require('fs')

const useJson = function(path){

    try{

        const dataBuffer = fs.readFileSync(path)
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)

    }catch(e){
        console.log(e)
    }

}
module.exports = useJson