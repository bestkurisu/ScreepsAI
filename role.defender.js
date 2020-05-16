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
            creep.defend()
        },
	}
}