// 需要从memory读取centerPos和是否填link和中央link的id

module.exports = (roomName) => {
    return {
        // 到达centerPos
		prepare: creep => {
            var pos = Game.rooms[roomName].memory.centerPos
			if(!creep.pos.isEqualTo(pos[0],pos[1])){
                creep.moveTo(pos[0],pos[1])
            }
		},
		isReady: creep => {
			if(creep.pos.isEqualTo(Game.rooms[roomName].memory.centerPos[0],Game.rooms[roomName].memory.centerPos[1])) return true
		},
		target: creep => {
            if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
            if(creep.memory.centerlist == undefined && ((!Game.rooms[creep.pos.roomName].memory.fillLink &&
                !Game.rooms[creep.pos.roomName].memory.clearLink) || Game.rooms[creep.pos.roomName].storage.store[RESOURCE_ENERGY]<800)){
                // 如果有任务就接任务
                if(!Game.rooms[roomName].memory.centerlist)Game.rooms[roomName].memory.centerlist=[]
                if(Game.rooms[roomName].memory.centerlist.length>0){
                    creep.memory.centerlist = Game.rooms[roomName].memory.centerlist[0]
                    Game.rooms[roomName].memory.centerlist.shift()
                }
                else{
                    //creep.say('疯狂暗示',true)
                }
            }
            else{
                var Storage = creep.room.storage
                var Link = Game.getObjectById(Game.rooms[creep.pos.roomName].memory.link)
                var Terminal = creep.room.terminal
                // 判断是否要优先填link
                if(Game.rooms[creep.pos.roomName].memory.fillLink && Storage.store[RESOURCE_ENERGY]>800){
                    // 如果creep存了其他东西先放下
                    if(creep.store.getFreeCapacity(RESOURCE_ENERGY)+
                    creep.store[RESOURCE_ENERGY]<creep.store.getCapacity()){
                        creep.transferAll(Storage)
                    }
                    else{
                        creep.withdraw(Storage,RESOURCE_ENERGY)
                        creep.transfer(Link,RESOURCE_ENERGY)
                    }
                    if(Link.store[RESOURCE_ENERGY] == 800) Game.rooms[creep.pos.roomName].memory.fillLink = false
                }
                // 判断是否要优先取link
                else if(Game.rooms[creep.pos.roomName].memory.clearLink){
                    // 如果creep存了其他东西先放下
                    if(creep.store.getFreeCapacity(RESOURCE_ENERGY)+
                    creep.store[RESOURCE_ENERGY]<creep.store.getCapacity()){
                        creep.transferAll(Storage)
                    }
                    else{
                        creep.withdraw(Link,RESOURCE_ENERGY)
                        creep.transfer(Storage,RESOURCE_ENERGY)
                    }
                    if(Link.store[RESOURCE_ENERGY] == 0) Game.rooms[creep.pos.roomName].memory.clearLink = false
                }
                // 正常工作
                else if(creep.memory.centerlist){
                    var sfrom = Game.getObjectById(creep.memory.centerlist.from)
                    var sto = Game.getObjectById(creep.memory.centerlist.to)
                    var resource = creep.memory.centerlist.resource
                    if(creep.store.getFreeCapacity(resource)+creep.store[resource]<creep.store.getCapacity()){
                        if(Storage.store.getFreeCapacity()==0){
                            creep.transferAll(Terminal)
                        }
                        else{
                            creep.transferAll(Storage)
                        }
                    }
                    else{
                        if(creep.store.getFreeCapacity() == creep.store.getCapacity()){
                            creep.withdraw(sfrom,resource)
                        }
                        else{
                            if(creep.memory.centerlist.amount-creep.memory.centerlist.count<creep.store[resource]){
                                var count = creep.memory.centerlist.amount-creep.memory.centerlist.count
                                if(sto.store.getFreeCapacity(resource)<count){
                                    if(creep.transfer(sto,resource,sto.store.getFreeCapacity(resource)) == OK) creep.memory.centerlist.count += sto.store.getFreeCapacity(resource)
                                }
                                else if(creep.transfer(sto,resource,count) == OK) creep.memory.centerlist.count += count
                            }
                            else{
                                var count = creep.store[resource]
                                if(creep.transfer(sto,resource) == OK) creep.memory.centerlist.count += count
                            }
                        }
                    }
                    if(sfrom.store[resource] == 0 || 
                    creep.memory.centerlist.count >= creep.memory.centerlist.amount ||
                    sto.store.getFreeCapacity(resource)<=50){
                        creep.memory.centerlist = undefined
                    }
                }
            }
        },
	}
}