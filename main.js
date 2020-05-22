const mount = require('mount')
const market = require('market')
require('超级移动优化v0.9.4')
require('planner v1.0.1')
require('RoomVisual')

const stateScanner = function () {
    if (Game.time % 19) return 
    if (!Memory.stats) Memory.stats = {}
    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100
    Memory.stats.gclLevel = Game.gcl.level
    Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100
    Memory.stats.gplLevel = Game.gpl.level
    Memory.stats.credits = Game.market.credits
    Memory.stats.cpu = Game.cpu.getUsed()
    Memory.stats.bucket = Game.cpu.bucket
    var getBar = function(barName,roomName){
        return Game.rooms[roomName].storage.store[barName]+Game.rooms[roomName].terminal.store[barName]
    }
    Memory.stats.bar={
        Zbar: getBar('zynthium_bar','W29N5'),
        Kbar: getBar('keanium_bar','W29N5'),
        Ubar: getBar('utrium_bar','W29N5'),
        Lbar: getBar('lemergium_bar','W29N5'),
        Obar: getBar('oxidant','W29N5'),
        Hbar: getBar('reductant','W29N5'),
        Xbar: getBar('purifier','W29N5'),
    }
    var getstore = function(roomName){
        var sto = {
            free: Game.rooms[roomName].storage.store.getCapacity()-Game.rooms[roomName].storage.store.getUsedCapacity(),
            energy: Game.rooms[roomName].storage.store['energy'],
            power: Game.rooms[roomName].storage.store['power'],
        }
        return sto
    }
    var rcl = function(roomName){
        var r = {
            level: Game.rooms[roomName].controller.level,
            progress: (Game.rooms[roomName].controller.progress / Game.rooms[roomName].controller.progressTotal) * 100
        }
        return r
    }
    Memory.stats.storage = {
        W29N4: getstore('W29N4',1),
        W29N5: getstore('W29N5',1),
        W29N6: getstore('W29N6',1),
    }
    Memory.stats.rcl = {
        W29N5: rcl('W29N5'),
        W29S5: rcl('W29S5'),
        W31S9: rcl('W31S9'),
        W28N6: rcl('W28N6'),
    }
}
module.exports.loop = function () {
    mount()
    market()
    if(Game.shard.name=='shard3') var startCpu0 = Game.cpu.getUsed()
    for(var name in Memory.creeps){
        if(!Game.creeps[name]){
            delete Memory.creeps[name]
        }
    }
    for(var name in Memory.flags){
        if(!Game.flags[name]){
            delete Memory.flags[name]
        }
    }
    for(var name in Memory.rooms){
        if(!Game.rooms[name]){
            delete Memory.rooms[name]
        }
    }
    
    for(var name in Game.rooms){
        var cpu0 = Game.cpu.getUsed()
        Game.rooms[name].work()
        var cpu = Game.cpu.getUsed()-cpu0
        if(Game.time%5==0){
            //console.log(name+' used '+cpu)
        }
    }
    for(var name in Game.creeps){
        var cpu0 = Game.cpu.getUsed()
        Game.creeps[name].work()
        var cpu = Game.cpu.getUsed()-cpu0
        if(Game.time%10==0){
            //console.log(Memory.creeps[name].role+' used '+cpu)
        }
    }
    for(var name in Game.powerCreeps){
        Game.powerCreeps[name].work()
    }
    for(var name in Game.spawns){
        Game.spawns[name].work()
    }
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for(let tower of towers){
        tower.work()
    }
    if(Game.shard.name=='shard3') stateScanner()
    if(Game.shard.name=='shard3') var elapsed = Math.round(Game.cpu.getUsed() - startCpu0) 
    new RoomVisual('W29N4').text('bucket:'+Game.cpu.bucket, 5, 1, {color: 'green', font: 0.8})
    new RoomVisual('W29N4').text('cpu:'+elapsed, 5, 2, {color: 'green', font: 0.8})
}