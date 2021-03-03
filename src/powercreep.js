var update=function(num1,num2,list){
    if(num1<num2-1){
        return num1+1
    }
    else{
        return 0
    }
}
var ops=function(creep){
    if(creep.powers['1'].cooldown>0){
        return -1
    }
    creep.usePower(PWR_GENERATE_OPS)
}
var opfac=function(creep,facid){
    if(creep.powers['19'].cooldown>0){
        return -1
    }
    var factory=Game.getObjectById(facid)
    if(!factory) return -1
    if(!factory.effects||factory.effects.ticksRemaining<10||factory.effects.length==0){
        creep.say('点工厂啦')
        if(creep.usePower(PWR_OPERATE_FACTORY,factory)==ERR_NOT_IN_RANGE){
            creep.moveTo(factory)
        }
    }
    else{
        creep.say('fac检查完毕')
        return -1
    }
}
var opsource=function(creep){
    if(creep.powers['13'].cooldown>0){
        return -1
    }
    var source = creep.room.find(FIND_SOURCES,{
        filter: s => !s.effects || s.effects.length == 0
    })
    if(source.length>0){
        creep.say('点能量啦')
        if(creep.usePower(PWR_REGEN_SOURCE,source[0])==ERR_NOT_IN_RANGE){
            creep.moveTo(source[0])
        }
    }
    else{
        return -1
    }
}
var opext=function(creep){
    if(creep.powers['6'].cooldown>0){
        return -1
    }
    if(creep.room.energyAvailable<creep.room.energyCapacityAvailable*0.8){
        if(creep.room.storage.store['energy']>1000){
            creep.say('填ext啦')
            if(creep.usePower(PWR_OPERATE_EXTENSION,creep.room.storage)==ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.storage)
            }
        }
        else if(creep.room.terminal.store['energy']>1000){
            creep.say('填ext啦')
            if(creep.usePower(PWR_OPERATE_EXTENSION,creep.room.terminal)==ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.terminal)
            }
        }
        else{
            return -1
        }
    }
    else{
        return -1
    }
}
var oplab=function(creep){
    if(creep.powers['5'].cooldown>0){
        return -1
    }
    var lab = creep.room.find(FIND_STRUCTURES,{
        filter: s => s.structureType == STRUCTURE_LAB &&
        (!s.effects || s.effects.length == 0) && s.cooldown>0
    })
    if(lab.length>0){
        if(creep.usePower(PWR_OPERATE_LAB,lab[0])==ERR_NOT_IN_RANGE){
            creep.moveTo(lab[0])
        }
    }
    else{
        return -1
    }
}
var opsto=function(creep,stoid){
    if(creep.powers['4'].cooldown>0){
        return -1
    }
    var storage=Game.getObjectById(stoid)
    if(storage.store.getUsedCapacity()>850000){
        if(creep.usePower(PWR_OPERATE_STORAGE,storage)==ERR_NOT_IN_RANGE){
            creep.moveTo(storage)
        }
    }
    else{
        return -1
    }
}
var powers=[]
powers[1]=ops
powers[4]=opsto
powers[5]=oplab
powers[6]=opext
powers[13]=opsource
powers[19]=opfac

module.exports = (name) => {
    return {
        target: creep =>{
            if(name == 'YoRHa-6o'){
                var configs={
                    roomName:'W29N4',
                    facid:Game.rooms['W29N4'].factory.id,
                    stoid:Game.rooms['W29N4'].storage.id
                }
            }
            if(name == 'YoRHa-4o'){
                var configs={
                    roomName:'W29N6',
                    facid:Game.rooms['W29N6'].factory.id,
                    stoid:Game.rooms['W29N6'].storage.id
                }
            }
            if(name == 'YoRHa-8o'){
                var configs={
                    roomName:'W29N5',
                    facid:Game.rooms['W29N5'].factory.id,
                    stoid:Game.rooms['W29N5'].storage.id
                }
            }
            if(name == 'YoRHa-7o'){
                var configs={
                    roomName:'W28N6',
                    facid:Game.rooms['W28N6'].factory.id
                }
            }
            var powerlist=[]
            for(key in creep.powers){
                powerlist.push(key*1)
            }
            if(!creep.memory.state){
                creep.memory.state=0
            }
            if(creep.store['ops']<150){
                if(creep.room.storage.store['ops']>200){
                    if(creep.pos.isNearTo(creep.room.storage)){
                        creep.withdraw(creep.room.storage,'ops',150)
                    }
                    else{
                        creep.moveTo(creep.room.storage)
                    }
                }
                else if(creep.room.terminal.store['ops']>200){
                    if(creep.pos.isNearTo(creep.room.terminal)){
                        creep.withdraw(creep.room.terminal,'ops',150)
                    }
                    else{
                        creep.moveTo(creep.room.terminal)
                    }
                }
                else{
                    var storage = Game.getObjectById('5e843bd5837b7673c3718b8d')
                    if(creep.pos.isNearTo(creep.room.storage)){
                        creep.withdraw(storage,'ops',150)
                    }
                    else{
                        creep.moveTo(storage)
                    }
                }
            }
            else{
                if(creep.room.name !== configs.roomName){
                    creep.moveTo(new RoomPosition(25,25,configs.roomName))
                }
                else{
                    creep.moveInRoom()
                    if(creep.store.getFreeCapacity()<50 && creep.room.controller && creep.room.controller.my){
                        if(creep.pos.getRangeTo(creep.room.storage)>1){
                            creep.moveTo(creep.room.storage)
                        }
                        else{
                            creep.transferAll(creep.room.storage)
                        }
                    }
                    else{
                        if(powerlist[creep.memory.state] == 4){
                            if(powers[4](creep,configs.stoid) == -1){
                                creep.memory.state = update(creep.memory.state,powerlist.length)
                            }
                        }
                        else if(powerlist[creep.memory.state] == 5){
                            creep.memory.state = update(creep.memory.state,powerlist.length)
                        }
                        else if(powerlist[creep.memory.state] == 19){
                            if(powers[19](creep,configs.facid) == -1){
                                creep.memory.state = update(creep.memory.state,powerlist.length)
                            }
                        }
                        else if(powers[powerlist[creep.memory.state]](creep,configs.facid) == -1){
                            creep.memory.state = update(creep.memory.state,powerlist.length)
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