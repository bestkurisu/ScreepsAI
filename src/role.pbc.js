module.exports = (flagName) => {
    return {
		prepare: creep => {
            if(!creep.memory.pbc)creep.memory.pbc=true
            if(Game.flags[flagName]){
                creep.moveTo(Game.flags[flagName],{range:2})
            }
			else{
                creep.godie()
            }
		},
		isReady: creep => {
            if(Game.flags[flagName]){
                if(creep.pos.getRangeTo(Game.flags[flagName].pos) <= 2){
                    return true
                } 
            }
			else{
                creep.godie()
            }
		},
		target: creep => {
            // 如果旗子还没拔，而且已经挖完
            if(Game.flags[flagName]&&Memory.flags[flagName].state == 2){
                // 如果有空间且处于待命阶段
                if(creep.store.getFreeCapacity()>0&&creep.memory.pbc){
                    // 找ruin
                    var ruin = creep.room.find(FIND_RUINS,{
                        filter: s => s.store['power']>0
                    })
                    // 有就捡
                    if(ruin.length>0) creep.goWithdraw(ruin[0],RESOURCE_POWER)
                    else{
                        // 没有的话找掉落资源
                        var drop = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
                            filter: s => s.resourceType == RESOURCE_POWER
                        })
                        if(drop){
                            // 有就捡
                            if(creep.pickup(drop) == ERR_NOT_IN_RANGE) creep.moveTo(drop)
                        }
                        else{
                            // 也没有的话拆旗子
                            Game.flags[flagName].remove()
                        }
                    }
                    // 如果捡到了切换运输模式
                    if(creep.store['power']>0) creep.memory.pbc=false
                }
            }
            // 如果身上有power就运回家
            if(creep.store['power']>0){
                creep.memory.pbc=false
                var Storage = Game.getObjectById('5e843bd5837b7673c3718b8d')
                creep.goTransfer(Storage,RESOURCE_POWER)
            }
            // 如果没有且没旗子再自杀
            else if(!creep.memory.pbc||!Game.flags[flagName]){
                creep.godie()
            }
        },
	}
}