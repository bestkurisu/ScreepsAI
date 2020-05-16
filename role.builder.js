module.exports = (workRoom) => {
    return {
        // 准备到达工作房间
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
            creep.getEnergy(false,true,false,true)
        },
		target: creep => {
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
            }
        },
        switch: creep => creep.updateState(),
	}
}