module.exports = () => {
    return {
        prepare: creep =>{
            var paths = [
                {shard:'shard3',roomName:'W30N0',x:8,y:17},
                {shard:'shard2',roomName:'W30N0',x:25,y:9},
                {shard:'shard1',roomName:'W30N0',x:11,y:35},
                {shard:'shard0',roomName:'W51N0',x:48,y:20},
                {shard:'shard0',roomName:'W49N10',x:1,y:27},
                {shard:'shard0',roomName:'W50S20',x:32,y:45},
                {shard:'shard1',roomName:'W30S10',x:18,y:31},
                {shard:'shard2',roomName:'W30S10',x:38,y:25},
            ]
            if(!(creep.pos.roomName=='W30S10'&&Game.shard.name=='shard3')){
                creep.moveTo(fr(creep,paths),{ignoreSwamps: true})
                if(Game.time%10==0){
                    console.log(Game.shard.name+creep.pos.roomName)
                }
            }
            if(creep.pos.roomName=='W30S10'&&Game.shard.name=='shard3'){
                if(!creep.memory) creep.memory = {ready:true}
            }
        },
        isReady: creep =>{
            if(creep.pos.roomName=='W30S10'&&Game.shard.name=='shard3'){
                if(!creep.memory) creep.memory = {ready:true}
                return true
            }
        },
        source: creep => {
            creep.getEnergy(false,true,false,true)
        },
		target: creep => {
            if(creep.pos.roomName!='W31S9'){
                creep.moveTo(new RoomPosition(25,25,'W31S9'))
            }
            else{
                creep.moveInRoom()
                creep.memory.state=1
            }
            if(creep.memory.state){
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller,{range:3})
                /*
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
                if(target){
                    if(creep.build(target)==ERR_NOT_IN_RANGE){
                        creep.moveTo(target)
                    }
                }
                */
            }
        },
        switch: creep => {
            if(creep.pos.roomName=='W31S9'){
                return creep.updateState()
            }
            else{
                return true
            }
        },
	}
}