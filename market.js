module.exports=function(){
    if(Game.time%10==0){
        var GPrice=1.3
        var GbarPrice=6
        var roomName = ['W29N4','W29N5','W29N6']
        var order = Game.market.getAllOrders(order => 
            order.resourceType == RESOURCE_ENERGY && order.type == ORDER_BUY)
        order.sort((a,b)=>b.price-a.price)
        var price = Math.min(0.085,order[0].price)
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
                    if(order.length==1){
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
        }
        if(Game.rooms['W29N6'].terminal.store['composite']>3000){
            var order =Game.market.getAllOrders(order => order.resourceType == 'composite' &&
                order.type == ORDER_BUY)
            if(order.length>0){
                order.sort((a,b) => b.price-a.price)
                if(order[0].price>5){
                    Game.market.deal(order[0].id,Math.min(order[0].amount,Game.rooms['W29N6'].terminal.store['composite']),'W29N6')
                }
            }
        }
        if(Game.rooms['W29N4'].terminal.store['crystal']>1000){
            var order =Game.market.getAllOrders(order => order.resourceType == 'crystal' &&
                order.type == ORDER_BUY)
            if(order.length>0){
                order.sort((a,b) => b.price-a.price)
                if(order[0].price>13.5){
                    Game.market.deal(order[0].id,Math.min(order[0].amount,Game.rooms['W29N4'].terminal.store['crystal']),'W29N4')
                }
            }
        }
        /*
        var order = _.filter(Game.market.orders, o => o.type=="sell" && o.resourceType=='G')
        if(order[0].remainingAmount<20000){
            Game.market.extendOrder(order[0].id,20000-order[0].remainingAmount)
        }
        if(order[0].price<GPrice){
            Game.market.changeOrderPrice(order[0].id,GPrice)
        }

        var order = _.filter(Game.market.orders, o => o.type=="sell" && o.resourceType=='ghodium_melt')
        if(order[0].remainingAmount<10000){
            Game.market.extendOrder(order[0].id,10000-order[0].remainingAmount)
        }
        if(order[0].price!==GbarPrice){
            Game.market.changeOrderPrice(order[0].id,GbarPrice)
        }
        */
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
        if(Game.rooms['W29N5'].storage.store['battery']<30000){
            var myOrder = _.filter(Game.market.orders, o => o.type=="buy" && o.resourceType=='battery' &&
            o.active==true)
            var order = Game.market.getAllOrders(order => 
            order.resourceType == 'battery' && order.type == ORDER_BUY)
            order.sort((a,b)=>b.price-a.price)
            var price = Math.min(1.5,order[0].price)
            if(myOrder.length>0){
                var amount = 60000-Game.rooms['W29N5'].storage.store['energy']-myOrder[0].remainingAmount
                if(amount>0){
                    Game.market.extendOrder(myOrder[0].id,amount)
                    console.log('W29N5挂了'+amount+'电池')
                }
                if(myOrder[0].price < price){
                    Game.market.changeOrderPrice(myOrder[0].id,price)
                }
            }
            else{
                var amount = 60000-Game.rooms['W29N5'].storage.store['battery']
                buy('battery',price,amount,'W29N5')
                console.log('W29N5挂了'+amount+'电池')
            }
        }
        if(Game.rooms['W29N4'].terminal.store['fixtures']>10){
            var order = Game.market.getAllOrders(order => 
                order.resourceType == 'fixtures' && order.type == ORDER_BUY && order.amount>0)
            order.sort((a,b)=>b.price-a.price)
            if(order.length>0 && order[0].price>4800){
                Game.market.deal(order[0].id,order[0].amount,'W29N4')
            }
        }
    }
}