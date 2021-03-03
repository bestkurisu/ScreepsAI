module.exports = (roomName) => {
    return {
		target: creep => {
            if(creep.memory.translist == undefined){
                if(creep.ticksToLive<300) creep.godie()
                else{
                    if(Game.rooms[roomName].memory.translist.length>0){
                        creep.memory.translist = Game.rooms[roomName].memory.translist[0]
                        Game.rooms[roomName].memory.translist.shift()
                        creep.say('get task')
                    }
                    else{
                        creep.say('ready')
                    }
                }
            }
            else{
                sfrom = Game.getObjectById(creep.memory.translist.from)
                sto = Game.getObjectById(creep.memory.translist.to)
                if(!sfrom){
                    creep.memory.translist = undefined
                    return
                } 
                // 默认运输
                if(creep.memory.translist.type == 1){
                    if(creep.store[creep.memory.translist.resource]+creep.store.getFreeCapacity(creep.memory.translist.resource)<creep.store.getCapacity()){
                        if(creep.room.storage){
                            if(!creep.pos.isNearTo(creep.room.storage)){
                                creep.moveTo(creep.room.storage)
                            }
                            else{
                                creep.transferAll(creep.room.storage)
                            }
                        }
                    }
                    else{
                        if(creep.store.getUsedCapacity() == 0){
                            if(creep.withdraw(sfrom, creep.memory.translist.resource) == ERR_NOT_IN_RANGE){
                                creep.moveTo(sfrom,{reusePath: 50})
                            }
                        }
                        else{
                            if(creep.transfer(sto, creep.memory.translist.resource) == ERR_NOT_IN_RANGE){
                                creep.moveTo(sto,{reusePath: 50})
                            }
                        }
                    }
                    // container到container
                    // 注意这里有修改
                    if(creep.memory.translist.complete == 1){
                        if((sto.store.getFreeCapacity() < creep.store.getFreeCapacity()*0.5 || sfrom.store[RESOURCE_ENERGY] < 800)){
                            creep.memory.translist = undefined
                        }
                    }
                    // container到storage
                    else if(creep.memory.translist.complete == 2){
                        if(sfrom && sfrom.store[creep.memory.translist.resource] < 900 && creep.store[creep.memory.translist.resource] == 0){
                            creep.memory.translist = undefined
                        }
                    }
                    // storage到storage
                    else if(creep.memory.translist.complete == 3){
                        if(sfrom.store[creep.memory.translist.resource] < 5000||
                            sto.store[creep.memory.translist.resource]>50000){
                            creep.memory.translist = undefined
                        }
                    }
                    else if(creep.memory.translist.complete == 4){
                        if(sto.store.getFreeCapacity(creep.memory.translist.resource) == 0){
                            creep.memory.translist = undefined
                        }
                        else if(sfrom.store[creep.memory.translist.resource]<2000){
                            if(creep.store[creep.memory.translist.resource]>0){
                                creep.goTransfer(sfrom,creep.memory.translist.resource)
                            }
                            else{
                                creep.memory.translist = undefined
                            }
                        }
                    }
                    else if(creep.memory.translist.complete == 5){
                        if(sfrom.store.getFreeCapacity()>20000){
                            creep.memory.translist=undefined
                        }
                    }
                }
            }
        },
	}
}
