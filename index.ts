import express from "express"
const app=express();

app.use(express.json());

const BALANCES={

};

const ORDER_BOOK={
sol:{},
btc: {}
}

app.post("signup",(req,res)=>{

})
app.post("signin",(req,res)=>{

})

app.post("/order",(req,res)=>{

})

app.get("/order/:orderId",(req,res)=>{

})
app.delete("/order/:orderId",(req,res)=>{

})
app.get("/depth:symbol",(req,res)=>{

})

app.get("/order",(req,res)=>{

})
app.get("/fills",(req,res)=>{

})
app.get("/balance/usd",(req,res)=>{

})
app.get("/balance",(req,res)=>{

})

app.listen(3000)