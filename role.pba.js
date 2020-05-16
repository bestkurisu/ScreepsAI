module.exports = (flagName) => {
    return {
		prepare: creep => {
            if(!creep.memory.attack) creep.memory.attack = true
            if(Game.flags[flagName]){
                creep.moveTo(Game.flags[flagName],{range:1})
            }
            else{
                creep.suicide()
            }
		},
		isReady: creep => {
            if(Game.flags[flagName]){
                if(creep.pos.getRangeTo(Game.flags[flagName].pos) == 1){
                    var healer = creep.pos.findInRange(FIND_MY_CREEPS, 3, {
                        filter: c => c.memory.heal == true
                    })
                    Memory.flags[flagName].ticks = creep.ticksToLive
                    if(healer&&healer.length>0){
                        return true
                    } 
                } 
            }
			else{
                creep.suicide()
            }
		},
		target: creep => {
            if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
            if(Game.flags[flagName]){
                var pb = Game.getObjectById(Memory.flags[flagName].source)
                var pbc = creep.pos.findInRange(FIND_MY_CREEPS,10,{
                    filter: c => c.memory.pbc == true
                })
                if(creep.ticksToLive==50&&pb){
                    Memory.flags[flagName].amount0 = Math.floor(pb.hits/420/Memory.flags[flagName].ticks)+1
                }
                if(pbc.length!=Memory.flags[flagName].amount1){
                    creep.say('没就位')
                    if(pb){
                        Memory.flags[flagName].hits = 420*2*(1500-Memory.flags[flagName].ticks+144*Memory.flags[flagName].amount1)
                        if(pb.hits<600*(1500-Memory.flags[flagName].ticks+144*Memory.flags[flagName].amount1*0.5) && Memory.flags[flagName].state==0){
                            Memory.flags[flagName].state = 1
                        }
                        if(creep.hits>creep.hitsMax*0.5){
                            if(creep.hits>creep.hitsMax*0.5&&pb.hits>1500){
                                creep.attack(pb)
                            }
                        }
                    }
                    else{
                        Memory.flags[flagName].state = 2
                        creep.say('complete')
                        creep.suicide()
                    }
                }
                else{
                    creep.say('就位了')
                    if(pb){
                        creep.attack(pb)
                    }
                    else{
                        Memory.flags[flagName].state = 2
                        creep.say('complete')
                        creep.suicide()
                    }
                }
            }
            else{
                creep.suicide()
            }
        },
	}
}