const bodyConfigs = require('config.body')

var setMemory = function(creep){
    creep.memory = []
    for(i=0;i<creep.role.length;i++){
        if(creep.role.length>0){
            creep.memory[i] = {memory: {role: creep.name+creep.role[i]}}
        }
    }
}
var setTask = function(creep,i){
    if(!creep.directions) creep.directions = TOP
    var task = {
        body: creep.body,
        name: creep.name,
        memory: creep.memory[i],
        directions: creep.directions
    }
    return task
}

module.exports = function(spawn) {
    if(Game.spawns[spawn].pos.roomName == 'W59N31'){
        var config0 = {
            spawntrans: {
                name: 'lorry',
                role: [0],
                body: bodyConfigs.lorry.body2,
                amount: 1,
            },
            centertransporter: {
                name: 'centertransporter',
                role: [0],
                body: bodyConfigs.centertransporter.body0,
                amount: 1,
            },
            harvester: {
                name: 'harvester',
                role: [0,1],
                body: bodyConfigs.harvester.body3,
                amount: 1,
            },
            upgrader: {
                name: 'upgrader',
                role: [0],
                body: bodyConfigs.upgrader.body3,
                amount: 1,
            },
            wallrepairer: {
                name: 'wallrepairer',
                role: [0],
                body: bodyConfigs.wallrepairer.body0,
                amount: 0,
            },
            builder: {
                name: 'builder',
                role: [0],
                body: bodyConfigs.builder.body2,
                amount: 0,
            },
            scout: {
                name: 'scout',
                role: [0],
                body: bodyConfigs.scout.body0,
                amount: 0,
            },
        }
        var config1 = {
            upgrader: {
                name: 'upgrader',
                role: [0],
                body: bodyConfigs.upgrader.body3,
                amount: 4,
                roomName: ['W59N31'],
            },
            harvester: {
                name: 'harvester',
                role: [2],
                body: bodyConfigs.harvester.body3,
                amount: 1,
                flag: ['Flag2']
            },
            depo: {
                name: 'depo',
                role: [0,1,2],
                body: bodyConfigs.depo.body0,
                amount: 1,
                flag: ['depo0','depo1','depo2']
            },
            pba: {
                name: 'pba',
                role: [0,1],
                body: bodyConfigs.pba.body1,
                flag: ['pb0','pb1'],
            },
            pbb: {
                name: 'pbb',
                role: [0,1],
                body: bodyConfigs.pbb.body1,
                flag: ['pb0','pb1']
            },
            pbc: {
                name: 'pbc',
                role: [0,1],
                body: bodyConfigs.pbc.body0,
                flag: ['pb0','pb1']
            },
            transporter: {
                name: 'transporter',
                role: [0],
                body: bodyConfigs.transporter.body2,
                amount: 1,
            }
        }
    }
    spawnlist = []
    if(Game.rooms[Game.spawns[spawn].pos.roomName].memory.spawnlist.length == 0){
        if(Game.time%10 == 0){
            for(creep in config1){
                setMemory(config1[creep])
                var cc = config1[creep]
                for(i=0;i<cc.role.length;i++){
                    var creepRole = _.filter(Game.creeps, (c) => c.memory.role == cc.name+cc.role[i])
                    if(cc.name == 'harvester'){
                        var source = Game.getObjectById(Game.flags[cc.flag[i]].memory.sourceID)
                        if(creepRole.length<cc.amount &&
                            (!source || source.mineralAmount>0)){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                    else if(cc.name == 'upgrader'){
                        if(creepRole.length<cc.amount && Game.rooms[cc.roomName[i]].storage.store['energy']>200000){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                    else if(cc.name == 'depo'){
                        if(Game.flags[cc.flag[i]]){
                            var flag = Memory.flags[cc.flag[i]]
                            if(creepRole.length<1 && (!flag || flag.lastCooldown<100)){
                                var task = setTask(cc,i)
                                spawnlist.push(task)
                            }
                        }
                    }
                    else if(cc.name == 'pba'){
                        if(Game.flags[cc.flag[i]]){
                            var flag = Memory.flags[cc.flag[i]]
                            if(creepRole.length<1 && flag.state!=2){
                                var attack = setTask(cc,i)
                                spawnlist.push(attack)
                                flag.count0++
                            }
                        }
                    }
                    else if(cc.name == 'pbb'){
                        if(Game.flags[cc.flag[i]]){
                            var flag = Memory.flags[cc.flag[i]]
                            if(creepRole.length<1 && flag.state!=2){
                                var task = setTask(cc,i)
                                spawnlist.push(task)
                            }
                        }
                    }
                    else if(cc.name == 'pbc'){
                        if(Game.flags[cc.flag[i]]){
                            var flag = Memory.flags[cc.flag[i]]
                            if(creepRole.length<flag.amount1 && flag.state!=0){
                                var task = setTask(cc,i)
                                spawnlist.push(task)
                            }
                        }
                    }
                    else if(cc.name == 'upgrader'){
                        if(creepRole.length<cc.amount && Game.spawns[spawn].room.controller.ticksToDowngrade<150000){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                    else if(cc.name == 'transporter'){
                        if(creepRole.length<cc.amount && Game.spawns[spawn].room.memory.translist.length>0){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                }
            }
        }
    }
    // 通过数量判断生成的creep
    if(Game.rooms[Game.spawns[spawn].pos.roomName].memory.spawnlist.length == 0){
        for(creep in config0){
            var cc = config0[creep]
            setMemory(cc)
            for(i=0;i<cc.role.length;i++){
                var creepRole = _.filter(Game.creeps, (c) => c.memory.role == cc.name+cc.role[i])
                if(creepRole.length<cc.amount){
                    var task = setTask(cc,i)
                    spawnlist.push(task)
                }
            }
        }
    }
    return spawnlist
}