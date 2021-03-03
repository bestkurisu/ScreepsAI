module.exports = (flagName) => {
    return {
		prepare: creep => {
            if(!creep.memory.heal) creep.memory.heal = true
            if(Game.flags[flagName]){
                creep.moveTo(Game.flags[flagName],{range:2})
            }
			else{
                creep.suicide()
            }
		},
		isReady: creep => {
            if(Game.flags[flagName]){
                if(creep.pos.getRangeTo(Game.flags[flagName].pos) <= 2){
                    return true
                } 
            }
			else{
                creep.suicide()
            }
		},
		target: creep => {
            if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
            if(Game.flags[flagName]){
                creep.say(Memory.flags[flagName].state)
                if(!creep.memory.target){
                    var attacker = creep.pos.findInRange(FIND_MY_CREEPS, 5, {
                        filter: c => c.memory.attack == true &&
                                    c.hits < c.hitsMax
                    })
                    attacker.sort((a,b) => a.hits - b.hits)
                    if(attacker.length>0){
                        creep.memory.target = attacker[0].id
                    }
                }
                else{
                    var target = Game.getObjectById(creep.memory.target)
                    if(target){
                        if(creep.heal(target)==ERR_NOT_IN_RANGE){
                            creep.moveTo(target)
                        }
                        if(target.hits>target.hitsMax*0.95) creep.memory.target = undefined
                    }
                    else{
                        creep.memory.target = undefined
                    }
                }
                if(Memory.flags[flagName].state == 2) creep.suicide()
            }
            else{
                creep.suicide()
            }
        },
	}
}