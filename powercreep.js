module.exports = (name) => {
    return {
        target: creep =>{
            if(name == 'YoRHa-6o'){
                var factory = Game.getObjectById('5e92351a25a591e9b96737b4')
                if(Game.time%50 - 1==0){
                    creep.usePower(PWR_GENERATE_OPS)
                }
                if(creep.store['ops']<100){
                    if(creep.pos.getRangeTo(creep.room.storage)>1){
                        creep.moveTo(creep.room.storage)
                    }
                    else{
                        creep.withdraw(creep.room.storage,'ops',creep.store.getCapacity()*0.5)
                    }
                }
                else{
                    if(creep.store.getFreeCapacity()<50){
                        creep.say('ops搓满啦')
                        if(creep.pos.getRangeTo(creep.room.storage)>1){
                            creep.moveTo(creep.room.storage)
                        }
                        else{
                            creep.transferAll(creep.room.storage)
                        }
                    }
                    if(!factory.effects||factory.effects.ticksRemaining<10||factory.effects.length==0){
                        creep.say('点工厂啦')
                        if(creep.usePower(PWR_OPERATE_FACTORY,factory)==ERR_NOT_IN_RANGE){
                            creep.moveTo(factory)
                        }
                    }
                    else if(creep.room.energyAvailable<creep.room.energyCapacityAvailable*0.7){
                        creep.say('填ext啦')
                        if(creep.usePower(PWR_OPERATE_EXTENSION,creep.room.storage)==ERR_NOT_IN_RANGE)
                        creep.moveTo(creep.room.storage)
                    }
                    else{
                        var source = creep.room.find(FIND_SOURCES,{
                            filter: s => !s.effects || s.effects.length == 0
                        })
                        if(source.length>0){
                            if(creep.powers[PWR_REGEN_SOURCE].cooldown==0){
                                if(creep.usePower(PWR_REGEN_SOURCE,source[0])==ERR_NOT_IN_RANGE){
                                    creep.moveTo(source[0])
                                }
                            }
                            else{
                                creep.say('能量等冷却啦')
                            }
                        }
                        else{
                            var lab = creep.room.find(FIND_STRUCTURES,{
                                filter: s => s.structureType == STRUCTURE_LAB &&
                                (!s.effects || s.effects.length == 0) && s.cooldown>0
                            })
                            if(lab.length>0){
                                if(creep.powers[PWR_OPERATE_LAB].cooldown==0){
                                    if(creep.usePower(PWR_OPERATE_LAB,lab[0])==ERR_NOT_IN_RANGE){
                                        creep.moveTo(lab[0])
                                    }
                                }
                                else{
                                    creep.say('lab等冷却啦')
                                }
                            }
                            else{
                                if(Game.time%10==0){
                                    creep.say('好无聊啊')
                                }
                            }
                        }
                    }
                }
            }
            else if(name == 'YoRHa-4o'){
                if(Game.time%50 - 1==0){
                    creep.usePower(PWR_GENERATE_OPS)
                }
                if(creep.store['ops']<100){
                    var storage = Game.getObjectById('5e843bd5837b7673c3718b8d')
                    if(creep.withdraw(storage,'ops',300)==ERR_NOT_IN_RANGE){
                        creep.moveTo(storage)
                    }
                }
                else{
                    var factory = Game.getObjectById('5e9e46f9c285c9cb71654775')
                    if(!factory.effects||factory.effects.ticksRemaining<10||factory.effects.length==0){
                        if(creep.usePower(PWR_OPERATE_FACTORY,factory)==ERR_NOT_IN_RANGE){
                            creep.moveTo(factory)
                        }
                        else if(creep.usePower(PWR_OPERATE_FACTORY,factory)==-10){
                            if(creep.enableRoom(creep.room.controller)==ERR_NOT_IN_RANGE){
                                creep.moveTo(creep.room.controller)
                            }
                        }
                    }
                    else{
                        if(!creep.pos.isEqualTo(new RoomPosition(26,35,'W29N6'))){
                            creep.moveTo(new RoomPosition(26,35,'W29N6'))
                        }
                        if(creep.room.energyAvailable<creep.room.energyCapacityAvailable*0.8){
                            if(creep.room.storage.store['energy']>5000){
                                if(creep.usePower(PWR_OPERATE_EXTENSION,creep.room.storage)){
                                    creep.moveTo(creep.room.storage)
                                }
                            }
                            else{
                                if(creep.usePower(PWR_OPERATE_EXTENSION,creep.room.terminal)){
                                    creep.moveTo(creep.room.terminal)
                                }
                            }
                        }
                    }
                }
            }
            else{
                if(Game.time%50 - 1==0){
                    creep.usePower(PWR_GENERATE_OPS)
                }
                if(creep.store['ops']<100){
                    var storage = Game.getObjectById('5e843bd5837b7673c3718b8d')
                    if(creep.withdraw(storage,'ops',300)==ERR_NOT_IN_RANGE){
                        creep.moveTo(storage)
                    }
                }
                else{
                    if(creep.room.name!='W29N5'){
                        creep.moveTo(new RoomPosition(19,37,'W29N5'))
                    }
                    else{
                        creep.moveInRoom()
                        if(creep.room.energyAvailable<creep.room.energyCapacityAvailable*0.8){
                            if(creep.room.storage.store['energy']>5000){
                                if(creep.usePower(PWR_OPERATE_EXTENSION,creep.room.storage)){
                                    creep.moveTo(creep.room.storage)
                                }
                            }
                            else{
                                if(creep.usePower(PWR_OPERATE_EXTENSION,creep.room.terminal)){
                                    creep.moveTo(creep.room.terminal)
                                }
                            }
                        }
                        else{
                            if(creep.store.getFreeCapacity()<50){
                                if(creep.pos.getRangeTo(creep.room.storage)>1){
                                    creep.moveTo(creep.room.storage)
                                }
                                else{
                                    creep.transferAll(creep.room.storage)
                                }
                            }
                        }
                    }
                }
            }
        },
        dead: creep =>{
            var ps = Game.getObjectById(creep.room.memory.powerspawn)
            if(ps){
                if(creep.pos.getRangeTo(ps)>1){
                    creep.moveTo(ps)
                }
                else{
                    creep.renew(ps)
                    if(creep.ticksToLive>4900) creep.memory.dead = false
                }
            }
            else{
                creep.moveTo(new RoomPosition(25,25,'W29N4'))
            }
        }
    }
};