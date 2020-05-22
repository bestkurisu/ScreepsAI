module.exports = (flagName) => {
    return {
		prepare: creep => {
            if(Game.flags[flagName]){
                if(Game.flags[flagName].pos.roomName=='W31N0'){
                    if(creep.pos.roomName!='W30N4'&&!creep.memory.state){
                        creep.moveTo(new RoomPosition(25,25,'W30N4'))
                    }
                    else{
                        creep.moveInRoom()
                        creep.memory.state=1
                        if(!creep.pos.isEqualTo(Game.flags[flagName].pos)) creep.moveTo(Game.flags[flagName],{range:1})
                    }
                }
                else{
                    if(!creep.pos.isEqualTo(Game.flags[flagName].pos)) creep.moveTo(Game.flags[flagName],{range:1})
                }
            }
		},
		isReady: creep => {
            if(Game.flags[flagName]){
                if(creep.pos.getRangeTo(Game.flags[flagName].pos) == 1) return true
            }
			else{
                return true
            }
		},
		target: creep => {
            if(Game.flags[flagName]){
                if(!Memory.flags[flagName]){
                    var depo = creep.pos.findInRange(FIND_DEPOSITS,1)
                    if(depo.length>0){
                        Memory.flags[flagName]={source:depo[0].id}
                    }
                }
                else{
                    var depo = Game.getObjectById(Memory.flags[flagName].source)
                    if(creep.store.getFreeCapacity()>10 && creep.ticksToLive>300){
                        if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
                        if(creep.pos.getRangeTo(Game.flags[flagName].pos) > 1) creep.ready = false
                        if(depo){
                            if(creep.harvest(depo) == ERR_NOT_IN_RANGE){
                                creep.moveTo(depo)
                            }
                        }
                    }
                    else{
                        if(depo){
                            Game.flags[flagName].memory.lastCooldown = depo.lastCooldown
                            if(depo.lastCooldown>90){
                                Game.flags[flagName].remove()
                            }
                        }
                        if(creep.memory.dontPullMe) creep.memory.dontPullMe = false
                        if(flagName=='depo0'||flagName=='depo1'||flagName=='depo2'||flagName=='depo3'||flagName=='depo4'){
                            var Storage = Game.getObjectById('5e92e9fca1606d71a271269f')
                        }
                        else{
                            var Storage = Game.getObjectById('5ec18146726bbf3045e5c02f')
                        }
                        if(Storage){
                            if(creep.store['silicon']>0){
                                creep.goTransfer(Storage,RESOURCE_SILICON)
                            }
                            else if(creep.store['metal']>0){
                                creep.goTransfer(Storage,RESOURCE_METAL)
                            }
                        }
                    }
                }
                if(creep.store.getUsedCapacity() == 0){
                    if(creep.ticksToLive>300){
                        creep.memory.ready=false
                    }
                    else{
                        creep.godie()
                    }
                }
            }
            else{
                if(creep.store.getUsedCapacity()>0){
                    if(flagName=='depo0'||flagName=='depo1'||flagName=='depo2'){
                        var Storage = Game.getObjectById('5e92e9fca1606d71a271269f')
                    }
                    else{
                        var Storage = Game.getObjectById('5ec18146726bbf3045e5c02f')
                    }
                    if(Storage){
                        if(creep.store['silicon']>0){
                            creep.goTransfer(Storage,RESOURCE_SILICON)
                        }
                        else if(creep.store['metal']>0){
                            creep.goTransfer(Storage,RESOURCE_METAL)
                        }
                    }
                }
                else{
                    creep.godie()
                }
            }
        },
	}
}