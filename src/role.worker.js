module.exports = (flagName) => {
    return {
		source: creep => {
			if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
            var resource = Game.getObjectById(Game.flags[flagName].memory.sourceID)
            if(resource){
                if(creep.harvest(resource)==ERR_NOT_IN_RANGE){
                    creep.moveTo(resource)
                }
            }
		},
		target: creep => {
            if(creep.memory.dontPullMe) creep.memory.dontPullMe = false
            if(creep.room.controller.ticksToDowngrade&&creep.room.controller.ticksToDowngrade>2000){
                if(creep.room.energyAvailable<creep.room.energyCapacityAvailable){
                    var home = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (i) => (i.structureType == STRUCTURE_EXTENSION && i.store.getFreeCapacity(RESOURCE_ENERGY)>0) || 
                        (i.structureType == STRUCTURE_SPAWN && i.store.getFreeCapacity(RESOURCE_ENERGY) > 100)
                    })
                }
                if(!home || Memory.rooms[creep.room.name].enemys){
                    home = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (i) => (i.structureType == STRUCTURE_TOWER && i.store[RESOURCE_ENERGY] < 900)
                    })
                }
                if(home){
                    creep.goTransfer(home)
                }
                else{
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
                    if(targets.length>0){
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE){
                            creep.moveTo(targets[0])
                        }
                    }
                    else{
                        var targets = creep.room.find(FIND_STRUCTURES,{
                            filter: s => s.hits<s.hitsMax &&
                            s.structureType != STRUCTURE_WALL &&
                            s.structureType != STRUCTURE_RAMPART
                        })
                        if(targets.length>0){
                            if(creep.repair(targets[0])==ERR_NOT_IN_RANGE){
                                creep.moveTo(targets[0])
                            }
                        }
                        else{
                            if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
                            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller,{range:3})
                        }
                    }
                }
            }
            else{
                if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
                            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller,{range:3})
            }
		},
		switch: creep => creep.updateState(),
	}
}