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
    if(!creep.memory[i]) creep.memory[i]={}
    var task = {
        body: creep.body,
        name: creep.name,
        memory: creep.memory[i],
        directions: creep.directions
    }
    return task
}

module.exports = function(spawn) {
    if(Game.spawns[spawn].pos.roomName == 'W29N4'){
        var config0 = {
            spawntrans: {
                name: 'spawntrans',
                role: [0],
                body: bodyConfigs.spawntrans.body3,
                amount: 1,
                add: '',
            },
            centertransporter: {
                name: 'centertransporter',
                role: [0],
                body: bodyConfigs.centertransporter.body1,
                amount: 1,
                add: '',
            },
            harvester: {
                name: 'harvester',
                role: [0,1],
                body: bodyConfigs.harvester.body3,
                amount: 1,
                add: '',
            },
            wallrepairer: {
                name: 'wallrepairer',
                role: [0],
                body: bodyConfigs.wallrepairer.body1,
                amount: 0,
                add: ''
            },
            claimer: {
                name: 'claimer',
                role: [1],
                body: [CLAIM,CLAIM,MOVE,MOVE,MOVE,MOVE],
                amount: 1,
            }
        }
        var config1 = {
            upgrader: {
                name: 'upgrader',
                role: [0],
                body: bodyConfigs.upgrader.body5,
                amount: 1,
                add: '',
            },
            harvester: {
                name: 'harvester',
                role: [10],
                body: bodyConfigs.harvester.body2,
                amount: 1,
                flag: ['Flag10']
            },
            labman: {
                name: 'labman',
                role: [0],
                body: bodyConfigs.labman.body2,
                amount: 1,
                add: '',
                room: ['W29N4']
            },
            depo: {
                name: 'depo',
                role: [0,1,2,3,4],
                body: bodyConfigs.depo.body0,
                amount: 1,
                flag: ['depo0','depo1','depo2','depo3','depo4']
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
            },
        }
    }
    if(Game.spawns[spawn].pos.roomName == 'W29N6'){
        var config0 = {
            spawntrans: {
                name: 'spawntrans',
                role: [1],
                body: bodyConfigs.spawntrans.body3,
                amount: 1,
                add: '',
            },
            upgrader: {
                name: 'upgrader',
                role: [3],
                body: bodyConfigs.upgrader.body3,
                amount: 1,
                add: '',
            },
            harvester: {
                name: 'harvester',
                role: [4,5],
                body: bodyConfigs.harvester.body3,
                amount: 1,
                add: '',
            },
            centertransporter: {
                name: 'centertransporter',
                role: [1],
                body: bodyConfigs.centertransporter.body1,
                amount: 1,
                add: '',
            },
            wallrepairer: {
                name: 'wallrepairer',
                role: [1],
                body: bodyConfigs.wallrepairer.body1,
                amount: 0,
                add: ''
            },
            claimer: {
                name: 'claimer',
                role: [0],
                body: [CLAIM,CLAIM,MOVE,MOVE,MOVE,MOVE],
                amount: 1,
            }
        }
        var config1 = {
            harvester: {
                name: 'harvester',
                role: [11],
                body: bodyConfigs.harvester.body2,
                amount: 1,
                flag: ['Flag11']
            },
            upgrader: {
                name: 'upgrader',
                role: [1],
                body: bodyConfigs.upgrader.body5,
                amount: 1,
            },
            labman: {
                name: 'labman',
                role: [1],
                body: bodyConfigs.labman.body2,
                amount: 1,
                add: '',
                room: ['W29N6']
            },
            transporter: {
                name: 'transporter',
                role: [1],
                body: bodyConfigs.transporter.body2,
                amount: 1,
            },
        }
    }
    if(Game.spawns[spawn].pos.roomName == 'W29N5'){
        var config0 = {
            spawntrans: {
                name: 'spawntrans',
                role: [2],
                body: bodyConfigs.spawntrans.body3,
                amount: 1,
                add: '',
            },
            harvester: {
                name: 'harvester',
                role: [2,3],
                body: bodyConfigs.harvester.body3,
                amount: 1,
                add: '',
            },
            centertransporter: {
                name: 'centertransporter',
                role: [2],
                body: bodyConfigs.centertransporter.body1,
                amount: 1,
                add: '',
            },
            wallrepairer: {
                name: 'wallrepairer',
                role: [2],
                body: bodyConfigs.wallrepairer.body1,
                amount: 0,
                add: ''
            },
            builder: {
                name: 'builder',
                role: [2],
                body: bodyConfigs.builder.body0,
                amount: 0,
            },
        }
        var config1 = {
            claimer: {
                name: 'claimer',
                role: [2],
                body: bodyConfigs.claimer.body1,
                amount: 0,
                room: ['W28N5']
            },
            upgrader: {
                name: 'upgrader',
                role: [2],
                body: bodyConfigs.upgrader.body5,
                amount: 1,
            },
            harvester: {
                name: 'harvester',
                role: [15],
                body: bodyConfigs.harvester.body2,
                amount: 1,
                flag: ['Flag15']
            },
            labman: {
                name: 'labman',
                role: [2],
                body: bodyConfigs.labman.body2,
                amount: 1,
                room: ['W29N5']
            },
            transporter: {
                name: 'transporter',
                role: [3],
                body: bodyConfigs.transporter.body2,
                amount: 1,
            },
        }
    }
    if(Game.spawns[spawn].pos.roomName == 'W28N6'){
        var config0 = {
            spawntrans: {
                name: 'spawntrans',
                role: [3],
                body: bodyConfigs.spawntrans.body2,
                amount: 1,
                add: '',
            },
            upgrader: {
                name: 'upgrader',
                role: [3],
                body: bodyConfigs.upgrader.body3,
                amount: 2,
            },
            harvester: {
                name: 'harvester',
                role: [12,13],
                body: bodyConfigs.harvester.body2,
                amount: 1,
            },
            centertransporter: {
                name: 'centertransporter',
                role: [3],
                body: bodyConfigs.centertransporter.body1,
                amount: 1,
                add: '',
            },
            wallrepairer: {
                name: 'wallrepairer',
                role: [3],
                body: bodyConfigs.wallrepairer.body1,
                amount: 0,
                add: ''
            },
            builder: {
                name: 'builder',
                role: [2],
                body: bodyConfigs.builder.body0,
                amount: 0,
            },
        }
        var config1 = {
            harvester: {
                name: 'harvester',
                role: [20],
                body: bodyConfigs.harvester.body2,
                amount: 1,
                flag: ['Flag20']
            },
        }
    }
    if(Game.spawns[spawn].pos.roomName == 'W31S9'){
        var config0 = {
            spawntrans: {
                name: 'spawntrans',
                role: [4],
                body: bodyConfigs.spawntrans.body1,
                amount: 1,
                add: '',
            },
            upgrader: {
                name: 'upgrader',
                role: [4],
                body: bodyConfigs.upgrader.body3,
                amount: 1,
                add: '',
            },
            harvester: {
                name: 'harvester',
                role: [14,16],
                body: bodyConfigs.harvester.body1,
                amount: 1,
                add: '',
            },
            centertransporter: {
                name: 'centertransporter',
                role: [4],
                body: bodyConfigs.centertransporter.body1,
                amount: 0,
                add: '',
            },
            transporter: {
                name: 'transporter',
                role: [2],
                body: bodyConfigs.transporter.body1,
                amount: 1,
            },
            wallrepairer: {
                name: 'wallrepairer',
                role: [4],
                body: bodyConfigs.wallrepairer.body0,
                amount: 0,
                add: ''
            },
            builder: {
                name: 'builder',
                role: [5],
                body: bodyConfigs.builder.body0,
                amount: 0,
            },
        }
        var config1 = {
            depo: {
                name: 'depo',
                role: [5,6,7],
                body: bodyConfigs.depo.body1,
                amount: 1,
                flag: ['depo5','depo6','depo7']
            },
            harvester: {
                name: 'harvester',
                role: [19],
                body: bodyConfigs.harvester.body2,
                amount: 1,
                flag: ['Flag19']
            },
            lorry: {
                name: 'lorry',
                role: [0],
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                amount: 1,
                flag: ['flag']
            }
        }
    }
    if(Game.spawns[spawn].pos.roomName == 'W29S5'){
        var config0 = {
            worker: {
                name: 'worker',
                role: [0,1],
                body: bodyConfigs.worker.body0,
                amount: 0,
            },
            spawntrans: {
                name: 'spawntrans',
                role: [5],
                body: bodyConfigs.spawntrans.body1,
                amount: 1,
            },
            upgrader: {
                name: 'upgrader',
                role: [5],
                body: bodyConfigs.upgrader.body2,
                amount: 1,
                add: '',
            },
            harvester: {
                name: 'harvester',
                role: [17,18],
                body: bodyConfigs.harvester.body2,
                amount: 1,
                add: '',
            },
            centertransporter: {
                name: 'centertransporter',
                role: [5],
                body: bodyConfigs.centertransporter.body1,
                amount: 0,
                add: '',
            },
            transporter: {
                name: 'transporter',
                role: [4],
                body: bodyConfigs.transporter.body2,
                amount: 2,
                add: '',
            },
            wallrepairer: {
                name: 'wallrepairer',
                role: [4],
                body: bodyConfigs.wallrepairer.body1,
                amount: 0,
                add: ''
            },
            builder: {
                name: 'builder',
                role: [5],
                body: bodyConfigs.builder.body0,
                amount: 0,
            },
        }
        var config1 = {
            harvester: {
                name: 'harvester',
                role: [6],
                body: bodyConfigs.harvester.body2,
                amount: 1,
                flag: ['Flag6']
            },
        }
    }
    spawnlist = []
    // 通过额外条件判断生成的creep
    if(Game.rooms[Game.spawns[spawn].pos.roomName].memory.spawnlist.length == 0){
        if(Game.time%10 == 0){
            for(creep in config1){
                setMemory(config1[creep])
                var cc = config1[creep]
                for(i=0;i<cc.role.length;i++){
                    var creepRole = _.filter(Game.creeps, (c) => c.memory.role == cc.name+cc.role[i])
                    if(cc.name == 'claimer'){
                        if(creepRole.length<cc.amount && 
                            Game.rooms[cc.room[i]] != undefined && 
                            (Game.rooms[cc.room[i]].controller.reservation == undefined || 
                            Game.rooms[cc.room[i]].controller.reservation.ticksToEnd < 3000)){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                    else if(cc.name == 'harvester'){
                        var source = Game.getObjectById(Game.flags[cc.flag[i]].memory.sourceID)
                        if(creepRole.length<cc.amount &&
                            (!source || source.mineralAmount>0)){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                    else if(cc.name == 'defender'){
                        if(creepRole.length<cc.amount &&
                            Memory.rooms[cc.room[i]] &&
                            Memory.rooms[cc.room[i]].enemys){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                    else if(cc.name == 'labman'){
                        if(creepRole.length<cc.amount &&
                            Memory.rooms[cc.room[i]].lablist.length>0){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                    else if(cc.name == 'attacker'){
                        if(creepRole.length<cc.amount){
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
                    else if(cc.name == 'spawntrans'){
                        if(creepRole.length<cc.amount&&(Game.flags['pb0']||Game.flags['pb1'])){
                            var task = setTask(cc,i)
                            spawnlist.push(task)
                        }
                    }
                    else if(cc.name == 'upgrader'){
                        if(creepRole.length<cc.amount && (Game.spawns[spawn].room.controller.ticksToDowngrade<150000
                            || Game.spawns[spawn].room.storage.store.getFreeCapacity()<50000)){
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
                    else if(cc.name == 'lorry'){
                        if(creepRole.length<cc.amount && Game.flags['flag']){
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
};