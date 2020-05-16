module.exports = (workRoom) => {
    return {
		prepare: creep => {
            if(workRoom=='W26N7') creep.memory.claim=true
			if(creep.pos.roomName != workRoom){
                creep.moveTo(new RoomPosition(25, 25, workRoom))
            }
		},
		isReady: creep => {
			if(creep.pos.roomName == workRoom){
                creep.moveInRoom()
                return true
            } 
		},
		target: creep => {
            if(creep.pos.roomName =='W28N6'){
                creep.claimController(creep.room.controller)
            }
            if(!creep.memory.claim) {
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller)
                }
            }
            else{
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller)
                }
            }
        },
	}
}