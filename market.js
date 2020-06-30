module.exports=function(){
    if(Game.time%10==0){
        var roomName = ['W29N4','W29N5','W29N6','W28N6']
        var order = Game.market.getAllOrders(order => 
            order.resourceType == RESOURCE_ENERGY && order.type == ORDER_BUY)
        order.sort((a,b)=>b.price-a.price)
        var price = Math.min(0.25,order[0].price)
        var deal=false
        if(_.size(Game.market.orders)>250){
            for(o in Game.market.orders){
                var order = Game.market.getOrderById(o)
                if(!order.active){
                    console.log(Game.market.cancelOrder(o))
                    
                }
            }
        }
        for(let i=0;i<roomName.length;i++){
            if(Game.rooms[roomName[i]].storage.store['energy']<350000){
                var order = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
                    order.type == ORDER_SELL && order.amount>30000)
                for(let j=0;j<order.length;j++){
                    order[j].realPrice=order[j].amount*order[j].price/(order[j].amount-Game.market.calcTransactionCost(order[j].amount, 'W29N5', order[j].roomName))
                }
                if(order.length>0){
                    order.sort((a,b)=>a.realPrice-b.realPrice)
                    if(order[0].realPrice<price){
                        if(Game.market.deal(order[0].id,30000,roomName[i])==0){
                            console.log(roomName[i]+'买了'+(30000-Game.market.calcTransactionCost(30000,roomName[i], order[0].roomName))+ '能量')
                        }
                        else{
                            deal=true
                        }
                    }
                }
                if(!deal){
                    var order = _.filter(Game.market.orders, o => o.type=="buy" && o.resourceType=='energy' &&
                                        o.roomName==roomName[i] && o.active==true)
                    if(order.length>0){
                        if(order[0].price<price){
                            Game.market.changeOrderPrice(order[0].id,price)
                        }
                        var amount = 400000-Game.rooms[roomName[i]].storage.store['energy']-order[0].remainingAmount
                        if(amount>0){
                            Game.market.extendOrder(order[0].id,amount)
                            console.log(roomName[i]+'挂了'+amount+'能量')
                        }
                    }
                    else if(Game.rooms[roomName[i]].terminal.store.getFreeCapacity()>10000){
                        buy('energy',price,400000-Game.rooms[roomName[i]].storage.store['energy'],roomName[i])
                    }
                }
            }
            if(Game.rooms[roomName[i]].storage.store['ops']+Game.rooms[roomName[i]].terminal.store['ops']<15000){
                var order = Game.market.getAllOrders(order => 
                    order.resourceType == 'ops' && order.type == ORDER_BUY)
                order.sort((a,b)=>b.price-a.price)
                var opsprice = Math.min(10,order[0].price)
                var order = _.filter(Game.market.orders, o => o.type=="buy" && o.resourceType=='ops' &&
                    o.roomName==roomName[i] && o.active==true)
                if(order.length>0){
                    if(order[0].price<opsprice){
                        Game.market.changeOrderPrice(order[0].id,opsprice)
                    }
                    var amount = 15000-Game.rooms[roomName[i]].storage.store['ops']-order[0].remainingAmount-Game.rooms[roomName[i]].terminal.store['ops']
                    if(amount>0){
                        Game.market.extendOrder(order[0].id,amount)
                        console.log(roomName[i]+'挂了'+amount+'ops')
                    }
                }
                else{
                    buy('ops',price,15000-Game.rooms[roomName[i]].storage.store['ops']-Game.rooms[roomName[i]].terminal.store['ops'],roomName[i])
                }
            }
        }
        var bar = Memory.stats.bar
        var barlist={
            Zbar: 'zynthium_bar',
            Kbar: 'keanium_bar',
            Ubar: 'utrium_bar',
            Lbar: 'lemergium_bar',
            Obar: 'oxidant',
            Hbar: 'reductant',
            Xbar: 'purifier'
        }
        for(key in bar){
            if(bar[key]<30000){
                var order = Game.market.getAllOrders(o => o.resourceType==barlist[key] &&
                    o.type==ORDER_BUY)
                if(order.length>0){
                    order.sort((a,b)=>b.price-a.price)
                    var price = Math.min(1.5,order[0].price)
                }
                else{
                    if(key=='Xbar') var price = 1
                    else var price = 0.5
                }
                var myOrder = _.filter(Game.market.orders, o => o.type=="buy" && o.resourceType==barlist[key] && o.active==true)
                if(myOrder.length>0){
                    if(myOrder[0].price<price){
                        Game.market.changeOrderPrice(myOrder[0].id,price)
                    }
                    var amount = 60000-bar[key]-myOrder[0].remainingAmount
                    if(amount>0){
                        Game.market.extendOrder(myOrder[0].id,amount)
                        console.log('W29N5挂了'+amount+key)
                    }
                }
                else{
                    buy(barlist[key],price,60000-bar[key],'W29N5')
                    console.log('W29N5新挂了'+(60000-bar[key])+key)
                }
            }
        }
        if(Game.rooms['W29N4'].terminal.store['machine']>0){
            var order = Game.market.getAllOrders(order => 
                order.resourceType == 'battery' && order.type == ORDER_BUY && order.amount>0)
            order.sort((a,b)=>b.price-a.price)
            if(order[0].price>200000){
                Game.market.deal(order[0].id,Math.min(order[0].amount,Game.rooms['W29N4'].terminal.store['machine'],'W29N4'))
            }
        }

        var order = Game.market.getAllOrders(order => 
            order.resourceType == 'silicon' && order.type == ORDER_BUY)
        order.sort((a,b)=>b.price-a.price)
        var price = Math.min(10,order[0].price)
        var myorder=_.filter(Game.market.orders, o => o.type=="buy" && o.resourceType=='silicon' && o.active==true)
        if(myorder.length>0){
            if(order[0].remainingAmount<20000){
                Game.market.extendOrder(order[0].id,50000-order[0].remainingAmount)
            }
            if(order[0].price<price){
                Game.market.changeOrderPrice(order[0].id,price)
            }
        }
    }
}