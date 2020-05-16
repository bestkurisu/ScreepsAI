module.exports = (roomName) => {
    return {
        //如果可以boost，则boost
        prepare: creep => {
            if(creep.pos.roomName != roomName){
                creep.moveTo(new RoomPosition(25,25,roomName))
            }
            else{
                creep.moveInRoom()
                if(Game.rooms[roomName].memory.boostUpgrader){
                    if(creep.memory.isBoost == undefined){
                        var pos = Game.rooms[roomName].memory.boostPos[0]
                        if(!creep.pos.isEqualTo(pos[0],pos[1])){
                            creep.moveTo(pos[0],pos[1])
                        }
                        else{
                            let lab = creep.pos.findInRange(FIND_STRUCTURES,1,{
                                filter: s => s.structureType == STRUCTURE_LAB &&
                                             (s.store["GH"] > 20 ||
                                             s.store["XGH2O"] > 20)
                            })
                            lab = lab[0]
                            if(lab && lab.boostCreep(creep) == OK){
                                creep.memory.isBoost = true
                            }
                        }
                    }
                }
            }
        },
        //如果有link就过去，没有就算了
        isReady: creep => {
            creep.moveInRoom()
            var Link = Game.getObjectById(Game.rooms[roomName].memory.linkForUpgrader)
            if(((Game.rooms[roomName].memory.boostUpgrader && creep.memory.isBoost)||!Game.rooms[roomName].memory.boostUpgrader)&&creep.pos.roomName == roomName){
                if(Link && creep.pos.getRangeTo(Link) > 1){
                    creep.moveTo(Link)
                }
                else{
                    return true
                }
            }
        },
        source: creep => {
            if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
            let Link = Game.getObjectById(Game.rooms[roomName].memory.linkForUpgrader)
            if(Link){
                creep.goWithdraw(Link)
                creep.upgradeController(creep.room.controller)
            }
            else{
                creep.getEnergy(false,true,false,true,true)
            }
        },
        target: creep => {
            creep.moveInRoom()
            const controller = creep.room.controller
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) creep.moveTo(controller,{range:3})
        },
        switch: creep => creep.updateState(),
        dead: creep => {
            if(creep.memory.isBoost){
                if(creep.unboost()==0){
                    creep.suicide()
                }
            }
            else{
                creep.memory.dead = false
            }
        }
    }
}