import express from "express"

import prisma from "./prisma.config";
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware";

const app=express();
app.use(express.json());

const BALANCES:any ={

    "user1": {
        usd: {
            available: 10000,
            locked: 0
        },
        sol: {
            available: 10,
            locked: 0
        }
    }

};

const ORDER_BOOK={
sol:{
    bids:[],
     ask:[]
},
btc: {
    bids:[],
    ask:[]
}
}

app.post("/signup",async(req,res)=>{
const username=req.body.username;
const password=req.body.password;

const userExist= await  prisma.user.findUnique({
where: {
   username
   }
});

if(userExist){
    return res.status(403).json({
    message: "user with this username already exist"
    })
}
const user= await prisma.user.create({
    data: {
        username: username,
        password: password
    }
})
 return res.status(200).json({
   message:  "Signined up successfully"
})
})

app.post("/signin",async(req,res)=>{
const username=req.body.username;
const password=req.body.password;

//fetch by username and compare using bcrypt in V2
const userExist= await prisma.user.findUnique({
    where: {
        username,
        password
    }
})
if(!userExist){
return res.status(403).json({
    message : "Wrong credientials"
})

}

const token= jwt.sign({
    id: userExist.id
},"Secret123")

 return res.status(201).json({
    token
})
})

app.post("/order",authMiddleware,async(req:any,res)=>{
const userId=req.userId;
const {market,price,qty,side,type} = req.body;

const balance=BALANCES[userId];
if (!balance) {
    return res.status(404).json({
        message: "Balance not found"
    });
}

if(side == "buy"){
const total=price*qty;
if(balance.usd.available >=total){
balance.usd.available -= total;
balance.usd.locked += total;
   const order= await prisma.order.create({
    data:{
        userId,
        market,
        price,
        qty,
        side,
        type,
        filledQty: 0,
        status: "OPEN"
    }
    
})

return res.status(201).json({
    message: "order created successfully"
})


}
else{


 return res.status(403).json({
    message: "Insuficient balance"
})
}

}
else if(side=="sell"){
    if(balance.sol.available >=qty){
        balance.sol.available -= qty;
        balance.sol.locked +=qty;


        await prisma.order.create({
            data:{
                userId,
                market,
                price,
                qty,
                side,
                type,
                filledQty: 0,
                status: "OPEN"
            }
        });
       return res.status(201).json({
            message: "order created successfully"
        })
    }
    else{
        return res.status(403).json({
            message: "Insufficient asset"
        })
    }
}    

}) 


app.get("/order/:orderId",authMiddleware,(req,res)=>{

})
app.delete("/order/:orderId",authMiddleware,(req,res)=>{

})
app.get("/depth/:symbol",(req,res)=>{

})

app.get("/order",authMiddleware,(req,res)=>{

})
app.get("/fills",authMiddleware,(req,res)=>{

})
app.get("/balance/usd",authMiddleware,(req,res)=>{

})
app.get("/balance",authMiddleware,(req,res)=>{

})

app.listen(3000)