const mountCreep = require('mount.creep')
const mountSpawn = require('mount.spawn')
const mountRoom = require('mount.room')
const mountTower = require('mount.tower')
const mountPowerCreep = require('mount.powerCreep')

// 挂载所有的额外属性和方法
module.exports = function (){
    if (!global.hasExtension){
        console.log('[mount] 重新挂载拓展')
        global.hasExtension = true;
        global.WALLHITS = 15000000
        
        mountCreep()
        mountSpawn()
        mountRoom()
        mountTower()
        mountPowerCreep()
        global.analyseEnemys = function(creepArray){
            var hongqiu = 0
            var lvqiu = 0
            var huangqiu = 0
            var lanqiu = 0
            var yitiji = 0
            var enemys = []
            for(i=0;i<creepArray.length;i++){
                var creepBody = creepArray[i].analyseBody()
                if(creepBody.attack>creepBody.ranged_attack+creepBody.heal){
                    creepBody.role = 'hongqiu'
                    hongqiu++
                    enemys.push(creepBody)
                }
                else if(creepBody.heal>0 && creepBody.attack == 0 && creepBody.ranged_attack == 0){
                    creepBody.role = 'lvqiu'
                    lvqiu++
                    enemys.push(creepBody)
                }
                else if(creepBody.ranged_attack>0 && creepBody.heal>0){
                    creepBody.role = 'yitiji'
                    yitiji++
                    enemys.push(creepBody)
                }
                else if(creepBody.ranged_attack>0 && creepBody.heal == 0){
                    creepBody.role = 'lanqiu'
                    lanqiu++
                    enemys.push(creepBody)
                }
                else if(creepBody.work>0 && creepBody.tough>0 && 
                    creepBody.attack == 0 && creepBody.ranged_attack == 0){
                    creepBody.role = 'huangqiu'
                    huangqiu++
                    enemys.push(creepBody)
                }
                var config = {
                    hongqiu: hongqiu,
                    lvqiu: lvqiu,
                    lanqiu: lanqiu,
                    yitiji: yitiji,
                    huangqiu: huangqiu,
                    total: hongqiu+lvqiu+yitiji+lanqiu+huangqiu,
                }
                return [enemys,config]
            }
        }
        global.findVacancy = function(pos){
            var terrain = new Room.Terrain(pos.roomName)
            var count = 0
            for(x=pos.x-1;x<=pos.x+1;x++){
                for(y=pos.y-1;y<=pos.y+1;y++){
                    if(!(x==pos.x && y==pos.y)){
                        if(terrain.get(x,y) != 1){
                            count++
                        }
                    }
                }
            }
            return count
        }
        global.send = function(from,to,resource,amount){
            var num = Game.rooms[from].terminal.send(resource,amount,to)
            return num
        }
        global.buy = function(resource,price,amount,roomName){
            var order = {
                type: ORDER_BUY,
                resourceType: resource,
                price: price,
                totalAmount: amount,
                roomName: roomName,
            }
            return Game.market.createOrder(order)
        }
        global.sell = function(resource,price,amount,roomName){
            var order = {
                type: ORDER_SELL,
                resourceType: resource,
                price: price,
                totalAmount: amount,
                roomName: roomName,
            }
            return Game.market.createOrder(order)
        }
        global.fr = function(creep,paths){
            paths = _.filter(paths,(o)=>(o.shard == Game.shard.name))
            let ret = _.min(paths,(o)=>(Game.map.getRoomLinearDistance(creep.pos.roomName,o.roomName)))
            if(ret)return new RoomPosition(ret.x,ret.y,ret.roomName)
            else return null;
        }
        Object.defineProperty(Structure.prototype,'memory',{
            get(){
                return this.room.memory.objects[this.id]=this.room.memory.objects[this.id] || {}
            }
        })
    }
}