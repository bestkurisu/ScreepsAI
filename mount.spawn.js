const spawnlist = require('spawnlist')
const mainRoom = {
    W29N4: 0,
    W29N5: 2,
    W29N6: 1,
    W31S9: 4,
    W28N6: 3,
    W29S5: 5,
}
module.exports = function () {
    _.assign(Spawn.prototype, spawnExtension)
}
// 自定义的 Spawn 的拓展
const spawnExtension = {
    // 正常工作
    work: function(){ 
        // 新房间初始化生产序列
        if(Game.rooms[this.pos.roomName].memory.spawnlist == undefined) Game.rooms[this.pos.roomName].memory.spawnlist = []
        // 进行renew
        this.renewCenter()
        // 检查是否需要重新启动
        this.restart()
        // 获取生产队列
        if(Game.rooms[this.pos.roomName].memory.spawnlist.length==0){
            this.getSpawnList()
        }
        // 自己已经在生成了 / 内存里没有生成队列 / 生产队列为空 就啥都不干
        if (this.spawning || !Game.rooms[this.pos.roomName].memory.spawnlist || 
            Game.rooms[this.pos.roomName].memory.spawnlist.length == 0){
            return 
        } 
        // 进行生成
        const spawnSuccess = this.mainSpawn(Game.rooms[this.pos.roomName].memory.spawnlist[0])
        // 生成成功后移除任务
        if (spawnSuccess) Game.rooms[this.pos.roomName].memory.spawnlist.shift()
    },
    // creep 生成主要实现
    mainSpawn: function(taskName){ 
        if(this.spawnCreep(taskName.body,taskName.name+Game.time,taskName.memory,taskName.directions) == 0) return true
    },
    // 生成生产队列
    getSpawnList: function(){
        if(Game.rooms[this.pos.roomName].memory.spawnlist.length == 0){
            Game.rooms[this.pos.roomName].memory.spawnlist = spawnlist(this.name)
        }
    },
    // renew中央搬运工
    renewCenter: function(){
        if(this.name == 'Spawn4' && !this.spawning){
            var found = this.room.lookForAt(LOOK_CREEPS,23,16)
            if(found.length>0){
                var centercreep = found[0]
                if(centercreep.ticksToLive<1300){
                    this.renewCreep(centercreep)
                }
            } 
        }
        if(this.name == 'Spawn6' && !this.spawning){
            var found = this.room.lookForAt(LOOK_CREEPS,29,34)
            if(found.length>0){
                var centercreep = found[0]
                if(centercreep.ticksToLive<1300){
                    this.renewCreep(centercreep)
                }
            } 
        }
        if(this.name == 'Spawn10' && !this.spawning){
            var found = this.room.lookForAt(LOOK_CREEPS,21,36)
            if(found.length>0){
                var centercreep = found[0]
                if(centercreep.ticksToLive<1300){
                    this.renewCreep(centercreep)
                }
            } 
        }
        if(this.name == 'Spawn7' && !this.spawning){
            var found = this.room.lookForAt(LOOK_CREEPS,9,19)
            if(found.length>0){
                var centercreep = found[0]
                if(centercreep.ticksToLive<1300){
                    this.renewCreep(centercreep)
                }
            } 
        }
    },
    // 重启
    restart: function(){
        if(this.room.name in mainRoom){
            var spawntrans = _.filter(Game.creeps,(c)=>c.memory.role == 'spawntrans'+mainRoom[this.room.name])
            if(spawntrans.length == 0){
                this.room.memory.spawnlist = []
                if(this.room.energyAvailable<Math.max(this.room.energyCapacityAvailable*0.25,400)){
                    var count = Math.floor(this.room.energyAvailable/150)
                    var body = []
                    for(i=0;i<count;i++){
                        body.push(MOVE)
                        body.push(CARRY)
                        body.push(CARRY)
                    }
                    this.spawnCreep(body,'linshi'+Game.time,{memory: {role: 'spawntrans'+mainRoom[this.room.name]}})
                }
            }
        }
        else if(this.room.name == 'W26N7'){
            var harvester = _.filter(Game.creeps,(c)=>c.memory.role == 'harvester14')
            if(harvester.length == 0) this.room.memory.spawnlist=[]
        }
    }
}