
const creepConfigs = require('config.role')
// 挂载Creep原型扩展
module.exports = function () {
    _.assign(Creep.prototype, creepExtension)
}
const creepExtension = {
    // 添加 work 方法
    work: function(){
        if(!(this.memory.role in creepConfigs)){
            if(this.name in creepConfigs){
                var creepConfig = creepConfigs[this.name]
            }
            else{
                this.say('草')
                return 
            }
        }
        else{
            // 还没出生就啥也不干
            if(this.spawning) return
            // 获取对应配置项
            var creepConfig = creepConfigs[this.memory.role]
        }
        if (!this.memory.ready){
            // 有准备阶段配置则执行
            if (creepConfig.prepare && creepConfig.isReady){
                creepConfig.prepare(this)
                this.memory.ready = creepConfig.isReady(this)
            }
            // 没有就直接准备完成
            else this.memory.ready = true
            return
        }
        // 对有回收设定的creep进行判断
        if(creepConfig.dead){
            if(Game.time%25 == 0){
                if(this.ticksToLive<60) this.memory.dead = true
            }
        }
        // 获取是否工作
        const working = creepConfig.switch ? creepConfig.switch(this) : true
        if(!this.memory.dead){
            if (working){
                if (creepConfig.target) creepConfig.target(this)
            }
            else{
                if (creepConfig.source) creepConfig.source(this)
            }
        }
        else{
            // 执行自毁程序
            creepConfig.dead(this)
        }
    },
    // 添加 updateState 方法
    updateState: function(){
        // creep 身上没有能量 && creep 之前的状态为“工作”
        if(this.store[RESOURCE_ENERGY] <= 0 && this.memory.working){
            this.memory.working = false
        }
        // creep 身上能量满了 && creep 之前的状态为“不工作”
        if(this.store[RESOURCE_ENERGY] >= this.store.getCapacity() && !this.memory.working){
            this.memory.working = true
        }
        return this.memory.working
    },
    // 添加getEnergy方法
    getEnergy: function (useDropedResorce, normal, onlyStorage, usesource,useterminal){
        /** @type {StructureContainer} */
        
        // 捡能量
        if(useDropedResorce){
            let dropedResorce = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if(dropedResorce && dropedResorce.amount > 150){
                if(this.pickup(dropedResorce) == ERR_NOT_IN_RANGE){
                    this.moveTo(dropedResorce, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return 0
            }
            else{
                useDropedResorce = false
            }
        }
        if(useterminal){
            let terminal = this.room.terminal
            if(terminal&&terminal.store['energy']>1000){
                this.goWithdraw(terminal)
                return 0
            }
            else{
                useterminal=false
            }
        }
        // 从同房间container或storage取
        if(normal&& !useterminal){
            let container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || 
                            s.structureType == STRUCTURE_STORAGE) &&
                            s.store[RESOURCE_ENERGY] > this.store.getCapacity() 
            });
            if (container){
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
                return 0
            }
            else{
                normal = false;
            }
        }
        // 只从storage取
        if(onlyStorage){
            let storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_STORAGE) &&
                            s.store[RESOURCE_ENERGY] > 200
            });
            if(storage){
                if (this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(storage);
                }
                return 0
            }
            else{
                onlyStorage =false;
            }
        }
        if(usesource && !useDropedResorce && !normal && !useterminal){
            let Resource = this.pos.findClosestByPath(FIND_SOURCES)
            if(this.harvest(Resource) == ERR_NOT_IN_RANGE){
                this.moveTo(Resource)
            }
            return 0
        }
    },
    // 添加一些没卵用的方法
    goWithdraw: function(target, RESOURCE_TYPE = RESOURCE_ENERGY,amount){
        if(amount){
            if(this.withdraw(target,RESOURCE_TYPE) == ERR_NOT_IN_RANGE,amount){
                this.moveTo(target)
            }
        }
        else{
            if(this.withdraw(target,RESOURCE_TYPE) == ERR_NOT_IN_RANGE){
                this.moveTo(target)
            }
        }
    },
    goTransfer: function(target, RESOURCE_TYPE = RESOURCE_ENERGY){
        if(this.transfer(target,RESOURCE_TYPE) == ERR_NOT_IN_RANGE){
            this.moveTo(target)
        }
    },
    withdrawAll: function(target){
        for(const resourceType in this.store) {
            this.goWithdraw(target, resourceType);
        }
    },
    transferAll: function(target){
        for(const resourceType in this.store) {
            this.goTransfer(target, resourceType);
        }
    },
    unboost: function(){
        var pos = Game.rooms[this.pos.roomName].memory.boostPos
        if(!this.pos.isEqualTo(28,16)){
            this.moveTo(28,16)
        }
        else{
            let lab = this.pos.findInRange(FIND_MY_STRUCTURES,1,{
                filter: s => s.structureType == STRUCTURE_LAB &&
                             s.id != '5e8a0c4992ec7da63c35cf27' &&
                             s.id != '5e917b23f417f505da965f4b' &&
                             s.id != '5e919301c8154ba26c4f9478' &&
                             s.cooldown == 0
            })
            if(lab.length>0){
                if(lab[0].unboostCreep(this)==OK) return 0
            }
        }
    },
    godie: function(){
        let Storage = Game.rooms[this.pos.roomName].storage
        if(Storage){
            if(Memory.rooms[this.room.name].deadPos){
                var pos = Memory.rooms[this.room.name].deadPos
                if(!this.pos.isEqualTo(pos[0],pos[1])) this.moveTo(pos[0],pos[1])
                else{
                    var spawn = this.pos.findInRange(FIND_MY_SPAWNS,1)
                    if(spawn.length>0){
                        spawn[0].recycleCreep(this)
                    }
                    else this.say('检查代码!')
                }
            }
            else{
                if(this.store.getUsedCapacity()>0){
                    this.moveTo(Storage)
                    this.transferAll(Storage)
                }
                else{
                    this.suicide()
                }
            }
        }
        else{
            this.suicide()
        }
    },
    defend: function(){
        const enemy = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if(enemy){
            this.moveTo(enemy.pos)
            if(this.getActiveBodyparts(RANGED_ATTACK) > 0){
                this.rangedAttack(enemy)
                if(this.getActiveBodyparts(HEAL)>0){
                    this.heal(this)
                }
            } 
            else this.attack(enemy)
        }
        else{
            this.suicide()
        }
    },
    moveInRoom: function(){
        if(this.pos.x == 0) this.move(RIGHT)
        else if(this.pos.x == 49) this.move(LEFT)
        else if(this.pos.y == 0) this.move(BOTTOM)
        else if(this.pos.y == 49) this.move(TOP)
    },
}
