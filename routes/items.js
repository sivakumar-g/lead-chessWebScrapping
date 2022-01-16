const express = require('express');
const router = express.Router();
const Request = require('request')
const Item = require('.././models/items');
const axios = require('axios')
const {parse} = require('node-html-parser')

var http = require('http');






async function makeGetRequest() {

var resObj={}
try{
  let res = await axios.get('https://www.chessgames.com/chessecohelp.html');
  let data =res.data;
  let dom = parse(data)
//   let dom = data
//   let trData = dom.querySelectorAll('td').reduce((acc,{text})=> acc+text+'\n','');
  
  let prevValue=''
  let trData = dom.querySelectorAll('td').forEach((item,index) => {
    //   console.log(item.text +'\n'+'----------------',index)
        if(index%2 == 0)
        prevValue = item.text
        else{
            let temp = item.text.split('\n')
            let values = temp[1].split[' ']
            resObj[prevValue]= {moves:temp[1].split(' '),names:temp[0]}
        }
    //   console.log(item.innerHTML +'\n'+'----------------',index)
 
  });
//   console.log(resObj);
  return resObj
}
catch(e){
console.log("error",e)
}//catch
}//makeGetRequest



router.get('*',async(req,res)=>{
    console.log('entered route',req.path)
    let params = req.path.split('/')
    console.log(params)

    var restObj = await makeGetRequest()

    if(params.length ==2){
         res.json(restObj);
    }
    else if(params.length ==3){
        let obj = params[1]
        let str = '';
        restObj[obj].moves.map(pd=>{
        str+=pd+' '    
        })
         res.json(str);
    }

    else{
        let path_arr = params.splice(0,1) 
        let path_arr_ = params.splice(params.length-1,1)
        console.log('else_block') 
        console.log(path_arr_,params) 

        let initial_key = params[0]
        params.splice(0,1)

        let keyObjArr = restObj[initial_key];
        let lastMove = params[params.length-1];
        let lastMoveIndex=-1;
        
        console.log('keyObjArr',keyObjArr)
        let nextMove = keyObjArr.moves.map((pd,index)=>{
            if(pd == lastMove){
                lastMoveIndex=index;
            }
        })

        if(lastMoveIndex== -1 || lastMoveIndex>=keyObjArr.length-1){
             res.json('Next move NOT FOUND');
        }
        else
             res.json(keyObjArr.moves[lastMoveIndex+1]);



    }//else
});



router.get('/:id',async(req,res)=>{
    var restObj = await makeGetRequest()
    let returnObj='ECO Chess Opening Codes: \n'
console.log(restObj['A00'].names)
// object.entries(restObj).forEach(([key, value]) => console.log(`${key}: ${value}`))
// OBJECT.entries(restObj).forEach(([key, value]) => console.log(key))

restObj.map(item=>{
    console.log(item)
})

res.json(restObj);
});





/*
router.get('/sample',(req,res)=>{

console.log("get route");
// var body=''
var options = {
  host: 'www.chessgames.com',
  path: '/chessecohelp.html'
};

var req = http.get(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    console.log('BODY: ' + body);
    // ...and/or process the entire body here.
  })
});

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});


});
*/



module.exports = router;