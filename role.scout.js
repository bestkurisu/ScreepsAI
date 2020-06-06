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
            
            var paths = [
                {shard:'shard3',roomName:'W30S0',x:27,y:9},
                {shard:'shard2',roomName:'W30S0',x:33,y:24},
                {shard:'shard1',roomName:'W30S0',x:26,y:7},
                {shard:'shard0',roomName:'W60S1',x:4,y:1},
                {shard:'shard0',roomName:'W70S0',x:42,y:28},
                {shard:'shard1',roomName:'W40N0',x:24,y:39},
                {shard:'shard2',roomName:'W40N0',x:28,y:31},
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
            
        }
	}
}