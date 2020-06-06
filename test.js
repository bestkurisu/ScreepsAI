module.exports = (workRoom) => {
    return {
        prepare: creep => {
            if(Game.time%10==0){
                console.log(Game.shard.name+'  '+creep.room.name)
            }
            if(creep.body[0].boost) creep.memory.isBoost=true
            var paths = [
                {shard:'shard3',roomName:'W30S0',x:27,y:9},
                {shard:'shard2',roomName:'W30S0',x:33,y:24},
                {shard:'shard1',roomName:'W30S0',x:26,y:7},
                {shard:'shard0',roomName:'W60S1',x:4,y:1},
                {shard:'shard0',roomName:'W70S0',x:42,y:28},
                {shard:'shard1',roomName:'W40N0',x:24,y:39},
                {shard:'shard2',roomName:'W40N0',x:28,y:31},
            ]
			if(!creep.memory.isBoost){
                if(creep.pos.isEqualTo(new RoomPosition(38,23,'W29S4'))){
                    var labs=creep.pos.findInRange(FIND_STRUCTURES,1,{
                        filter: s=>s.structureType == 'lab' &&
                        (s.store['XGHO2']>300 || s.store['XZH2O']>300 || s.store['XZHO2']>300)
                    })
                    if(labs.length>0){
                        for(let i=0;i<labs.length;i++){
                            labs[i].boostCreep(creep)
                        }
                        creep.memory.isBoost=true
                    }
                }
                else{
                    creep.moveTo(38,23)
                }
            }
            else{
                if(creep.pos.roomName=='W40N0'&&Game.shard.name=='shard3')creep.memory.state=1
                if(creep.memory.state){
                    if(!creep.pos.isEqualTo(new RoomPosition(27,1,'W37N1'))){
                        creep.moveTo(new RoomPosition(27,1,'W37N1'))
                    }
                }
                else{
                    creep.moveTo(fr(creep,paths))
                }
            }
		},
		isReady: creep => {
			if(creep.pos.isEqualTo(27,1,'W37N1')){
                var healer=creep.room.lookForAt(LOOK_CREEPS,26,1)
                if(healer.length>0&&healer[0].owner.username=='Nishiki'){
                    creep.move(TOP)
                    return true
                }
            }
        },
        target: creep =>{
            if(creep.pos.y==49||creep.pos.y==0){
                creep.move(TOP)
            }
            else{
                if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
                var healer=Game.creeps['healer']
                if(creep.pos.isNearTo(healer)){
                    creep.say('☠',true)
                    if(creep.hits>creep.hitsMax-1500){
                        var target=Game.getObjectById('5df903970cf0c56a4e7acad7')
                        if(target){
                            if(creep.dismantle(target)==ERR_NOT_IN_RANGE){
                                creep.moveTo(target)
                            }
                        }
                        else{
                            var target = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                                filter: s => s.structureType == STRUCTURE_TOWER ||
                                s.structureType == STRUCTURE_SPAWN 
                            })
                            if(target){
                                if(creep.dismantle(target)==ERR_NOT_IN_RANGE){
                                    creep.moveTo(target)
                                }
                            }
                            else{
                                var target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,{
                                    filter: s=> s.structureType != STRUCTURE_RAMPART
                                })
                                if(target){
                                    if(creep.dismantle(target)==ERR_NOT_IN_RANGE){
                                        creep.moveTo(target)
                                    }
                                }
                            }
                        }
                    }
                    else{
                        creep.moveTo(new RoomPosition(27,1,'W37N1'))
                    }
                }
                else{
                    creep.moveTo(healer)
                }
            }
        }
    }
};