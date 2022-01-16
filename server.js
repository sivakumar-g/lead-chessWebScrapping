const express = require("express");
const mongoose = require("mongoose");
const bodyParser  = require("body-parser");
const cors = require('cors');
const db = require('./config/keys').MONGO_URI;
const path = require('path');
const app = express();
var http = require('http');
const axios = require('axios')
const {parse} = require('node-html-parser')
const router = express.Router();

var http = require('http');

const config = require('./config/keys',{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true}) 

const items = require('./routes/items');

app.use(bodyParser.json());

var globalData=''

async function makeGetRequest() {

var resObj={}
try{
  let res = await axios.get('https://www.chessgames.com/chessecohelp.html');
  let data =res.data;
  let dom = parse(data)

  //   let trData = dom.querySelectorAll('td').reduce((acc,{text})=> acc+text+'\n','');
  let prevValue=''
  let trData = dom.querySelectorAll('td').forEach((item,index) => {
        if(index%2 == 0)
        prevValue = item.text
        else{
            let temp = item.text.split('\n')
            let values = temp[1].split[' ']
            resObj[prevValue]= {moves:temp[1].split(' '),names:temp[0]}
        }
  });
  return resObj
}
catch(e){
console.log("error",e)
}//catch
}//makeGetRequest



app.get('*',async(req,res)=>{
    console.log('entered route',req.path)
    let params = req.path.split('/')
    console.log(params)

    var restObj = await makeGetRequest()

    if(params.length ==2){//single / route
         
         let plainText = ''

          restObj.map(pd=>{
            console.log(pd)
          })
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
        
        let nextMove = keyObjArr.moves.map((pd,index)=>{
            if(pd.charCodeAt(0) == lastMove.charCodeAt(0)){
                lastMoveIndex=index;
            }

                // console.log("pd----",pd,lastMove,typeof(pd),typeof(lastMove),pd.charCodeAt(0),lastMove.charCodeAt(0))
        })
        console.log('keyObjArr',keyObjArr,lastMoveIndex,lastMove)

        if(lastMoveIndex== -1 || lastMoveIndex>=keyObjArr.length-1){
             res.json('Next move NOT FOUND');
        }
        else
             res.json(keyObjArr.moves[lastMoveIndex+1]);
    }//else
});

app.use('/items', items);
app.use(cors());
app.use(cors({origin : 'http://localhost:3000'}))

  const port = process.env.PORT || 5000;
  app.listen(port,()=> console.log('server connected at'+ port));

  