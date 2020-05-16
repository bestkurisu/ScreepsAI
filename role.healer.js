module.exports = (readyRoom) => {
    return {
		prepare: creep => {
            if(!creep.memory.heal) creep.memory.heal=true
            if(!creep.memory.state) creep.memory.state=0
            if(creep.memory.state==0){
                if(creep.pos.roomName!='W30N3') creep.moveTo(new RoomPosition(25,25,'W30N3'))
                else creep.memory.state=1
            }
            else{
                if(creep.pos.roomName != readyRoom){
                    creep.moveTo(new RoomPosition(25,25,readyRoom))
                }
            }
		},
		isReady: creep => {
			if(creep.pos.roomName == readyRoom){
                creep.moveInRoom()
                var faker = creep.room.find(FIND_MY_CREEPS,{
                    filter: c => c.memory.faker == true
                })
                if(faker.length>0) return true
			} 
		},
		target: creep => {
            var faker = creep.room.find(FIND_MY_CREEPS,{
                filter: c => c.memory.faker == true
            })
            if(faker.length>0){
                if(creep.heal(faker[0])==ERR_NOT_IN_RANGE){
                    creep.moveTo(faker[0])
                }
            }
            else{
                creep.say('人呐')
            }
        },
	}
}