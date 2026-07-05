
import {BALANCES} from "./index"
import { ORDER_BOOK } from "./index";
import prisma from "./db"
export async function matchOrder(order: any){

if(order.side =="buy"){
   
    
 const ask= ORDER_BOOK[order.market].ask;

for(let i=0;i<ask.length;i++){

    const sellOrder= ask[i];

    //price match

    if(sellOrder.price <=order.price){
        
      const tradedQty=Math.min(order.qty,sellOrder.qty)

    const tradeValue= tradedQty * sellOrder.price;

    const buyerBalance=BALANCES[order.userId];
    const sellBalance= BALANCES[sellOrder.userId];

    buyerBalance.usd.locked -=tradeValue;
    buyerBalance.sol.available +=tradedQty;

    sellBalance.sol.locked -=tradedQty;
    sellBalance.usd.available +=tradeValue;

        order.qty -=tradedQty;
        sellOrder.qty-= tradedQty;

        await prisma.fill.create({
            data:{
          
                userId: order.userId,
                market: order.market,
                price: sellOrder.price,
                qty: tradedQty,
                side: order.side,
                type: order.type,
                originalOrderId: order.id
            }
        })
         if(sellOrder.qty ===0){
        ask.splice(i,1);
        i--;
    }
  
    if(order.qty=== 0){
        break;
    }
    }
    
   
}
  if(order.qty >0){
        ORDER_BOOK[order.market].bids.push(order)
        
    }
    }
    //sell
    else{

 const bids= ORDER_BOOK[order.market].bids;

   for(let i=0;i<bids.length;i++){

    const buyOrder= bids[i];

    if(buyOrder.price >=order.price){
       
        const tradedQty= Math.min(order.qty,buyOrder.qty);

        const tradeValue = tradedQty *buyOrder.price;

        const buyerBalance= BALANCES[buyOrder.userId];
        const sellerBalance= BALANCES[order.userId];

        buyerBalance.usd.locked -=tradeValue;
        buyerBalance.sol.available +=tradedQty;

        sellerBalance.sol.locked -=tradedQty;
        sellerBalance.usd.available +=tradeValue;

        order.qty -=tradedQty;
        buyOrder.qty -= tradedQty;

        
      await prisma.fill.create({
    data: {
        userId: order.userId,
        market: order.market,
        price: buyOrder.price,
        qty: tradedQty,
        side: order.side,
        type: order.type,
        originalOrderId: order.id
    }
});
        
        if(buyOrder.qty ===0){
            bids.splice(i,1);
            i--;
        }
        if(order.qty===0){
            break;
        }
    }
   }
   if(order.qty >0){
    ORDER_BOOK[order.market].ask.push(order)
    
   }
    }

}