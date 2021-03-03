module.exports = function () {
    _.assign(StructureTower.prototype, towerExtension)
}
// 自定义的 Spawn 的拓展
const towerExtension = {
    work: function(){
        var enemys = Game.rooms[this.pos.roomName].memory.enemys
        if(enemys && enemys.length>0){
            let enemy = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            this.attack(enemy)
        }
        else if(Game.rooms[this.pos.roomName].memory.repairTarget){
            let target = Game.getObjectById(Game.rooms[this.pos.roomName].memory.repairTarget)
            // 判断修墙还是修其他
            if(target){
                if(target.structureType == STRUCTURE_RAMPART || target.structureType == STRUCTURE_WALL){
                    if(target.hits < 1500) this.repair(target)
                    else Game.rooms[this.pos.roomName].memory.repairTarget = undefined
                }
                else{
                    if(target.hits<target.hitsMax) this.repair(target)
                    else Game.rooms[this.pos.roomName].memory.repairTarget = undefined
                }
            }
        }
        else{
            var creep = this.room.find(FIND_MY_CREEPS, {
                filter: c => c.hits<c.hitsMax
            })
            if(creep.length>0){
                this.heal(creep)
            }
        }
    }
}