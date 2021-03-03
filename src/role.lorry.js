module.exports = (flagName) => {
    return {
		prepare: creep => {
            creep.memory.state=1
            if(!creep.memory.heal) creep.memory.heal = true
            if(Game.flags[flagName]){
                creep.moveTo(Game.flags[flagName],{range:1})
            }
			else{
                creep.suicide()
            }
		},
		isReady: creep => {
            if(Game.flags[flagName]){
                if(creep.pos.getRangeTo(Game.flags[flagName].pos) <= 1){
                    return true
                } 
            }
		},
		target: creep => {
            creep.moveInRoom()
            if(Game.rooms['W31S8']){
                var terminal=Game.rooms['W31S8'].terminal
                if(terminal.store.getUsedCapacity()==0){
                    if(Game.flags['flag']){
                        Game.flags['flag'].remove()
                    }
                }
            }
            if(creep.room.name === 'W31S8' && (creep.store.getFreeCapacity() === 0 || terminal.store.getUsedCapacity() === 0)){
                creep.memory.state=0
            } 
            if(creep.room.name === 'W31S9' && creep.store.getUsedCapacity() === 0){
                creep.memory.state=1
                creep.memory.ready=false
            } 
            if(creep.memory.state){
                if(terminal){
                    if(creep.store.getFreeCapacity()>0){
                        for(key in terminal.store){
                            creep.withdraw(terminal,key)
                        }
                    }
                }
                else{
                    creep.moveTo(Game.flags[flagName],{range:1})
                }
            }
            else{
                var home=Game.rooms['W31S9'].terminal
                if(creep.pos.isNearTo(home)){
                    for(key in creep.store){
                        creep.transfer(home,key)
                    }
                }
                else{
                    creep.moveTo(home)
                }
            }
        },
	}
}