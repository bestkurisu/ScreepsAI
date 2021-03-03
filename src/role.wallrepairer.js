module.exports = (workRoom) => {
    return {
		prepare: creep => {
			if(creep.pos.roomName != workRoom){
                creep.moveTo(new RoomPosition(25,25,workRoom))
            }
		},
		isReady: creep => {
			if(creep.pos.roomName == workRoom){
                creep.moveInRoom()
                return true
            } 
        },
        source: creep => {
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || 
                            s.structureType == STRUCTURE_STORAGE) &&
                            s.store[RESOURCE_ENERGY] > 400 
            });
            creep.goWithdraw(container)
        },
		target: creep => {
            if(creep.pos.roomName!=workRoom) creep.memory.ready=false
            if(creep.memory.dontPullMe) creep.memory.dontPullMe = false
            creep.moveInRoom()
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
            if(targets.length>0){
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[0])
                }
            }
            else{
                if(!creep.memory.target){
                    var target = creep.room.find(FIND_STRUCTURES,{
                        filter: s => (s.structureType == STRUCTURE_WALL ||
                                      s.structureType == STRUCTURE_RAMPART) &&
                                      s.hits < global.WALLHITS
                    })
                    if(target.length>1){
                        target.sort((a,b) => a.hits - b.hits)
                        creep.memory.target = target[0].id
                    }
                    else{
                        global.WALLHITS = 10000000
                    }
                }
                var target = Game.getObjectById(creep.memory.target)
                if(target&&target.hits<global.WALLHITS){
                    if(creep.repair(target) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target,{range:3})
                    }
                }
                else{
                    creep.memory.target = undefined
                }
            }
        },
        switch: creep => creep.updateState(),
        dead: creep => {
            if(creep.memory.isBoost){
                if(creep.unboost()==0){
                    creep.suicide()
                }
            }
            else{
                creep.godie()
            }
        }
	}
}