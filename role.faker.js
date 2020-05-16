module.exports = (readyRoom,flagName) => {
    return {
		prepare: creep => {
            if(!creep.memory.faker) creep.memory.faker=true
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
                var healer = creep.room.find(FIND_MY_CREEPS,{
                    filter: c => c.memory.heal == true
                })
                if(healer.length>0) return true
			} 
		},
		target: creep => {
            var target = Game.getObjectById('5c50ff7eff1cf36509e8839e')
            if(target){
                creep.dismantle(target)
            }
            if(creep.hits==creep.hitsMax){
                creep.moveTo(Game.flags[flagName].pos,{range:1})
            }
            if(creep.hits<creep.hitsMax*0.65){
                creep.moveTo(new RoomPosition(48,5,readyRoom))
            }
        },
	}
}