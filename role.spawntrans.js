module.exports = (roomName) => {
    return {
		target: creep => {
            if(creep.room.energyAvailable<creep.room.energyCapacityAvailable){
                var home = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType == STRUCTURE_EXTENSION && i.store.getFreeCapacity(RESOURCE_ENERGY)>0) || 
                    (i.structureType == STRUCTURE_SPAWN && i.store.getFreeCapacity(RESOURCE_ENERGY) > 100)
                })
            }
            if(!home || Memory.rooms[roomName].enemys){
                home = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType == STRUCTURE_TOWER && i.store[RESOURCE_ENERGY] < 900)
                })
            }
            if(home){ 
                if(creep.store[RESOURCE_ENERGY] < 50){
                    creep.getEnergy(false,true,false,false,true)
                }
                else{
                    creep.goTransfer(home)
                }
            }
            else{
                if(creep.store.getFreeCapacity()>0){
                    creep.getEnergy(false,true,false,false)
                }
                else{
                    if(Memory.rooms[roomName].sparePos){
                        sparePos = Memory.rooms[roomName].sparePos
                        creep.moveTo(sparePos[0],sparePos[1])
                    }
                }
            }
        },
        dead: creep => {
            if(creep.store.getUsedCapacity() == 0){
                creep.godie()
            }
            else{
                if(creep.room.storage){
                    for(const resourceType in creep.store) {
                        creep.goTransfer(creep.room.storage, resourceType);
                    }
                }
                else{
                    creep.godie()
                }
            }
        }
	}
}
