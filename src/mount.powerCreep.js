const creepConfigs = require('config.role')
// 挂载PowerCreep原型扩展
module.exports = function () {
    _.assign(PowerCreep.prototype, pcExtension)
}
const pcExtension = {
    // 添加 work 方法
    work: function(){
        if(!(this.name in creepConfigs)){
            this.say('草草')
            return 
        }
        // 还没出生就啥也不干
        if(!this.hits) return
        // 获取对应配置项
        const creepConfig = creepConfigs[this.name]
        if(!this.memory) this.memory = {}
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
        if(this.ticksToLive<2000) this.memory.dead = true
        // 获取是否工作
        if(!this.memory.dead && this.memory.ready){
            if (creepConfig.target) creepConfig.target(this)
        }
        if(this.memory.dead){
            creepConfig.dead(this)
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
    moveInRoom: function(){
        if(this.pos.x == 0) this.move(RIGHT)
        else if(this.pos.x == 49) this.move(LEFT)
        else if(this.pos.y == 0) this.move(BOTTOM)
        else if(this.pos.y == 49) this.move(TOP)
    },
}
