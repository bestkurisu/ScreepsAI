module.exports = () => {
    return {
        prepare: creep =>{
            return
        },
        isReady: creep =>{
            creep.memory.state=0
            return true
        },
		target: creep => {
            /*
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
            if(creep.pos.roomName=='W30S10'&&Game.shard.name=='shard3')creep.memory.state=1
            if(creep.memory.state){
                creep.moveTo(new RoomPosition(11,18,'W31S9'),{ignoreSwamps: true})
                if(creep.pos.isEqualTo(new RoomPosition(11,18,'W31S9'))){
                    creep.claimController(creep.room.controller)
                    console.log('OK')
                }
            }
            else{
                creep.moveTo(fr(creep,paths),{ignoreSwamps: true})
            }
            */
        }
	}
}