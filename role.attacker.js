module.exports = (workRoom) => {
    return {
        prepare: creep => {
			if(creep.pos.roomName != workRoom){
                creep.moveTo(new RoomPosition(25,25,workRoom))
            }
            if(creep.hits<creep.hitsMax){
                if(creep.getActiveBodyparts(HEAL)>0 && creep.getActiveBodyparts(ATTACK)==0){
                    creep.heal(creep)
                }
            }
            if(creep.pos.roomName != workRoom){
                creep.memory.ready = false
            }
		},
		isReady: creep => {
			if(creep.pos.roomName == workRoom){
                creep.moveInRoom()
                return true
            } 
        },
        target: creep =>{
            var creepArray = creep.room.find(FIND_HOSTILE_CREEPS)
            if(creepArray.length>0){
                var enemys = analyseEnemys(creepArray)[0]
                var config = analyseEnemys(creepArray)[1]
            }
            var targets = []
            if(config){
                if(config.lvqiu>0){
                    for(i=0;i<enemys.length;i++){
                        if(enemys[i].role == 'lvqiu'){
                            let target = Game.getObjectById(enemys[i].id)
                            targets.push(target)
                        }
                    }
                }
                else if(config.huangqiu>0){
                    for(i=0;i<enemys.length;i++){
                        if(enemys[i].role == 'huangqiu'){
                            let target = Game.getObjectById(enemys[i].id)
                            targets.push(target)
                        }
                    }
                }
                else if(config.total>0){
                    for(i=0;i<enemys.length;i++){
                        let target = Game.getObjectById(enemys[i].id)
                        targets.push(target)
                    }
                }
            }
            if(targets.length>0){
                var target = creep.pos.findClosestByPath(targets)
                if(creep.getActiveBodyparts(RANGED_ATTACK) > 0){
                    if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target)
                    }
                    if(creep.pos.getRangeTo(target)<3){
                        var direction = creep.pos.getDirectionTo(target)
                        if(direction+4>8){
                            direction = (direction+4)%8
                        }
                        else{
                            direction = direction+4
                        }
                        if(creep.pos.x>1 && creep.pos.x<48 && creep.pos.y>1 && creep.pos.y<48){
                            creep.move(direction)
                        }
                    }
                }
                else{
                    if(creep.attack(target) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target)
                    }
                }
            }
            else{
                creep.say('☠',true)
            }
            if(creep.hits<creep.hitsMax){
                if(creep.getActiveBodyparts(HEAL)>0 && creep.getActiveBodyparts(ATTACK)==0){
                    creep.heal(creep)
                }
            }
            if(creep.pos.roomName != workRoom){
                creep.memory.ready = false
            }
        }
    }
};