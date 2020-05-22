module.exports = (roomName) => {
    return {
		target: creep => {
            
            if(!creep.memory.lablist){
                if(creep.store.getUsedCapacity()>0){
                    if(creep.pos.getRangeTo(creep.room.storage)>1){
                        creep.moveTo(creep.room.storage)
                    }
                    else{
                        creep.transferAll(Game.rooms[creep.pos.roomName].storage)
                    }
                }
                else{
                    if(Game.rooms[roomName].memory.lablist.length>0){
                        creep.memory.lablist = Game.rooms[roomName].memory.lablist[0]
                        Game.rooms[roomName].memory.lablist.shift()
                    }
                    else{
                        creep.say('~')
                    }
                }
            }
            else{
                var sfrom = Game.getObjectById(creep.memory.lablist.from)
                var sto = Game.getObjectById(creep.memory.lablist.to)
                var resource = creep.memory.lablist.resource
                var Storage = Game.rooms[creep.pos.roomName].storage
                if(creep.store.getFreeCapacity()==creep.store.getCapacity()){
                    creep.goWithdraw(sfrom,resource)
                } 
                else{
                   if(creep.store[resource]+creep.store.getFreeCapacity(resource)<creep.store.getCapacity()){
                       creep.moveTo(Storage)
                       creep.transferAll(Storage)
                   }
                   else{
                       creep.goTransfer(sto,resource)
                   }
                } 
                if(sto.store.getFreeCapacity(resource)<20){
                    creep.memory.lablist = undefined
                } 
                else{
                    if((sfrom.store[resource]==0 && sfrom.structureType == STRUCTURE_LAB)||
                    (sfrom.store[resource]<50&&sfrom.structureType != STRUCTURE_LAB)){
                        creep.memory.lablist = undefined
                    }
                    else if(creep.store[resource]>0){
                        creep.goTransfer(sto,resource)
                    }
                }
            }
        },
        dead: creep => {
            if(creep.store.getUsedCapacity()==0){
                creep.godie()
            }
            else{
                for(const resourceType in creep.store) {
                    creep.goTransfer(creep.room.storage, resourceType);
                }
            }
        }
	}
}
