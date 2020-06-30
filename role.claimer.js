module.exports = (workRoom) => {
    return {
		prepare: creep => {
            var paths = [
                {shard:'shard3',roomName:'W30N10',x:20,y:40},
                {shard:'shard2',roomName:'W30N10',x:24,y:40},
                {shard:'shard1',roomName:'W30N10',x:39,y:30},
                {shard:'shard0',roomName:'W60N11',x:9,y:48},
                {shard:'shard0',roomName:'W70N10',x:35,y:21},
                {shard:'shard1',roomName:'W40N10',x:21,y:23},
                {shard:'shard2',roomName:'W40N10',x:15,y:13},
            ]
            if(!(creep.pos.roomName=='W40N10'&&Game.shard.name=='shard3')){
                creep.moveTo(fr(creep,paths),{ignoreSwamps: true})
                if(Game.time%20==0){
                    console.log(Game.shard.name+creep.pos.roomName)
                }
            }
            if(creep.pos.roomName=='W40N10'&&Game.shard.name=='shard3'){
                if(!creep.memory) creep.memory = {ready:true}
            }
		},
		isReady: creep => {
			if(creep.pos.roomName=='W40N10'&&Game.shard.name=='shard3'){
                if(!creep.memory) creep.memory = {ready:true}
                return true
            }
		},
		target: creep => {
            if(creep.room.name == 'W39N9'){
                if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller)
                }
                else if(creep.attackController(creep.room.controller) == OK){
                    creep.suicide()
                }
            }
            else{
                creep.moveTo(new RoomPosition(25,25,'W39N9'))
            }
        },
	}
}