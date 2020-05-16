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
		target: creep => {
            var targets = [Game.getObjectById('5d3a03fce0b50879feedc4bc'),
                            Game.getObjectById('5d39deb07b54a34625aa7ed2')]
            if(targets[0]){
                if(creep.dismantle(targets[0])==ERR_NOT_IN_RANGE){
                    creep.moveTo(target)
                }
            }
            else{
                if(targets[1]){
                    if(creep.dismantle(targets[1])==ERR_NOT_IN_RANGE){
                        creep.moveTo(target)
                    }
                }
            }
            
        },
	}
}