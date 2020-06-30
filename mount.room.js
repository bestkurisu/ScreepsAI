var lablist = require('lablist')
var centerlist = require('centerlist')
var translist = require('transportlist')
// 定义物流房和管辖房
const roomTransport = {
    W29N4: ['W29N4'],
    W29N5: ['W29N5'],
    W29N6: ['W29N6','W28N6'],
    W31S9: ['W31S9'],
    W29S5: ['W29S5'],
}
// 定义主要房间
const mainRoom = {
    W29N4: 0,
    W29N5: 2,
    W29N6: 1,
    W28N6: 3,
    W31S9: 4,
    W29S5: 5,
}
// 定义过道房间
const guodao = [
    'W30N3','W30N4','W30N5','W30N6','W30N7','W30N8',
]
StructureFactory.prototype.pro=function(c){
    com=COMMODITIES[c].components
    for(key in com){ 
        if(this.store[key]<com[key]){
            return -1
        }
    }
    return this.produce(c)
}
module.exports = function () {
    _.assign(Room.prototype, roomExtension)
}

const roomExtension = {
    // 生成各种任务队列
    work: function() { 
        this.processpower()
        this.observe()
        this.findSource()
        if(this.memory.lablist != undefined){
            this.memory.lablist = lablist(this.name)
        }
        if(this.memory.centerlist != undefined){
            if(this.memory.centerlist.length == 0){
                this.memory.centerlist = centerlist(this.name)
            }
        }
        if(this.name in roomTransport){
            if(!Game.rooms[this.name].memory.translist)Game.rooms[this.name].memory.translist = []
            if(Game.rooms[this.name].memory.translist.length == 0){
                for(i=0;i<roomTransport[this.name].length;i++){
                    Game.rooms[this.name].memory.translist.push.apply(Game.rooms[this.name].memory.translist,translist(this.name,roomTransport[this.name][i]))
                }
            }
        }
        if(Game.time%7 == 0 && Game.time%10!=0){
            this.findEnemy()
            this.findRepairTarget()
            this.trans()
        }
        if(Game.time%3 == 0){
            this.linkTrans()
            this.produce()
        }
        if(Game.time%20 == 0){
            this.boostCheck()
            this.labtask()
            this.findNuke()
            this.observe()
        }
    },
    // 找敌人
    findEnemy: function(){
        if(this.find(FIND_HOSTILE_CREEPS).length>0){
            this.memory.enemys = this.find(FIND_HOSTILE_CREEPS)
        }
        else{
            this.memory.enemys = undefined
        }
    },
    // 找要修的建筑
    findRepairTarget: function(){
        if(this.name in mainRoom){
            if(!this.memory.repairTarget){
                var target = this.find(FIND_STRUCTURES,{
                    filter: s => s.hits<1000 && s.structureType == STRUCTURE_RAMPART
                })
                if(target.length>0){
                    this.memory.repairTarget = target[0].id
                }
                else{
                    target = this.find(FIND_STRUCTURES,{
                        filter: s => s.hits<s.hitsMax && 
                        s.structureType == STRUCTURE_CONTAINER 
                    })
                    if(target.length>0){
                        target.sort((a,b) => a.hits - b.hits);
                        this.memory.repairTarget = target[0].id
                    }
                    else{
                        target = this.find(FIND_STRUCTURES,{
                            filter: s => s.hits<s.hitsMax && 
                            s.structureType != STRUCTURE_WALL &&
                            s.structureType != STRUCTURE_RAMPART
                        })
                        if(target.length>0){
                            target.sort((a,b) => a.hits - b.hits);
                            this.memory.repairTarget = target[0].id
                        }
                    }
                }
            }
        }
    },
    // 能量传输
    linkTrans: function(){
        if(this.memory.linkTrans == 1){
            var sfrom = Game.getObjectById(this.memory.link)
            var sto = Game.getObjectById(this.memory.linkForUpgrader)
            if(sfrom.store[RESOURCE_ENERGY]<400){
                this.memory.fillLink = true
            }
            else{
                this.memory.fillLink = false
                if(sto.store[RESOURCE_ENERGY]<400){
                    sfrom.transferEnergy(sto)
                }
            }
        }
        else if(this.memory.linkTrans == 2){
            var sfrom = Game.getObjectById(this.memory.linkForHarvester)
            var sto = Game.getObjectById(this.memory.link)
            if(sto.store.getFreeCapacity(RESOURCE_ENERGY)<400){
                this.memory.clearLink = true
            }
            else{
                this.memory.clearLink = false
                if(sfrom.store[RESOURCE_ENERGY]>500){
                    sfrom.transferEnergy(sto)
                }
            }
        }
        else if(this.memory.linkTrans == 3){
            var linkSource = []
            for(i=0;i<this.memory.linkForHarvester.length;i++){
                linkSource[i] = Game.getObjectById(this.memory.linkForHarvester[i])
            }
            var linkUpgrader = Game.getObjectById(this.memory.linkForUpgrader)
            var linkCenter = Game.getObjectById(this.memory.link)
            var x = true
            if(linkUpgrader&&linkUpgrader.store[RESOURCE_ENERGY]<600){
                for(i=0;i<linkSource.length;i++){
                    if(linkSource[i].store[RESOURCE_ENERGY]>400){
                        linkSource[i].transferEnergy(linkUpgrader)
                        x = false
                        this.memory.fillLink = false
                    }
                }
                if(x){
                    if(linkCenter.store[RESOURCE_ENERGY]>400){
                        linkCenter.transferEnergy(linkUpgrader)
                        this.memory.fillLink = true
                    }
                    else{
                        this.memory.fillLink = true
                    }
                }
            }
            else{
                for(i=0;i<linkSource.length;i++){
                    if(linkSource[i].store[RESOURCE_ENERGY]>600){
                        if(linkCenter.store[RESOURCE_ENERGY]<400){
                            linkSource[i].transferEnergy(linkCenter)
                        }
                        this.memory.clearLink = true
                    }
                }
            }
        }
    },
    // boost检查
    boostCheck: function(){
        if(this.name == 'W29N4'){
            var lab = [Game.getObjectById('5e89e735444aab20c0c59e8f'),
                        Game.getObjectById('5e89cae22877540b77f139b3'),
                        Game.getObjectById('5e8a0c4992ec7da63c35cf27'),
                        Game.getObjectById('5e917b23f417f505da965f4b'),
                        Game.getObjectById('5e919301c8154ba26c4f9478'),
                        Game.getObjectById('5e91a9054c37b27c44d63871')]
            if(lab[5].store["GH"]>50) this.memory.boostUpgrader = true
            else this.memory.boostUpgrader = false
        }
    },
    // 创建lab任务
    labtask: function(){
        var storage = this.storage
        var terminal = this.terminal
        if(this.name == 'W29N4'){
            var lab = [Game.getObjectById('5e91a9054c37b27c44d63871'),
                        Game.getObjectById('5e89e735444aab20c0c59e8f')]
            if(this.memory.labstate==0&&storage.store['GH']>50000) this.memory.labstate=1
            if(this.memory.labstate==1&&storage.store['OH']>50000) this.memory.labstate=2
            if(this.memory.labstate==2&&storage.store['GH2O']>49000) this.memory.labstate=3
            if(this.memory.labstate==3&&storage.store['GH2O']<1000) this.memory.labstate=0
            if(this.memory.labstate==0){
                var x='GH'
                var sto = {
                    0: "G",
                    1: "H",
                }
            }
            else if(this.memory.labstate==1){
                var x='OH'
                var sto = {
                    0: "O",
                    1: "H",
                }
            }
            else if(this.memory.labstate==2){
                var x='GH2O'
                var sto = {
                    0: "GH",
                    1: "OH",
                }
            }
            else if(this.memory.labstate==3){
                var x='XGH2O'
                var sto={
                    0: "GH2O",
                    1: "X",
                }
            }
            var sfrom = {
                4: x,
                2: x,
                3: x,
                5: x,
                6: x,
                7: x,
                8: x,
                9: x
            }
            var mid = {

            }
            var reaction = {
                2: [0,1],
                3: [0,1],
                4: [0,1],
                5: [0,1],
                6: [0,1],
                7: [0,1],
                8: [0,1],
                9: [0,1]
            }
            this.memory.labtask = [sfrom,sto,mid,reaction]
        }
        else if(this.name == 'W29N6'){
            var lab = [Game.getObjectById('5e93a9ee8db0f00c6ee61b71'),
                        Game.getObjectById('5e93582c282f2697a10e2775')]
            if(this.memory.labstate==0&&storage.store['LH']>50000) this.memory.labstate=1
            if(this.memory.labstate==1&&storage.store['OH']>50000) this.memory.labstate=2
            if(this.memory.labstate==2&&storage.store['LH2O']>49000) this.memory.labstate=3
            //if(this.memory.labstate==3&&storage.store['LH2O']<1000) this.memory.labstate=0
            if(this.memory.labstate==0){
                var x='LH'
                var sto = {
                    0: "L",
                    1: "H",
                }
            }
            else if(this.memory.labstate==1){
                var x='OH'
                var sto = {
                    0: "H",
                    1: "O",
                }
            }
            else if(this.memory.labstate==2){
                var x='LH2O'
                var sto = {
                    0: "LH",
                    1: "OH",
                }
            }
            else if(this.memory.labstate==3){
                var x='XLH2O'
                var sto={
                    0: "LH2O",
                    1: "X",
                }
            }
            var sfrom = {
                4: x,
                2: x,
                3: x,
                5: x,
                6: x,
                7: x,
                8: x,
                9: x
            }
            var mid = {

            }
            var reaction = {
                2: [0,1],
                3: [0,1],
                4: [0,1],
                5: [0,1],
                6: [0,1],
                7: [0,1],
                8: [0,1],
                9: [0,1]
            }
            this.memory.labtask = [sfrom,sto,mid,reaction]
        }
        else if(this.name == 'W29N5'){
            if(this.memory.labstate==undefined) this.memory.labstate=0
            if(this.memory.labstate==0&&storage.store['LO']>50000) this.memory.labstate=1
            if(this.memory.labstate==1&&storage.store['OH']>50000) this.memory.labstate=2
            if(this.memory.labstate==2&&storage.store['LHO2']>49000) this.memory.labstate=3
            if(this.memory.labstate==3&&storage.store['LHO2']<1000) this.memory.labstate=0
            if(this.memory.labstate==0){
                var x='LO'
                var sto = {
                    0: "L",
                    1: "O",
                }
            }
            else if(this.memory.labstate==1){
                var x='OH'
                var sto = {
                    0: "O",
                    1: "H",
                }
            }
            else if(this.memory.labstate==2){
                var x='LHO2'
                var sto = {
                    0: "LO",
                    1: "OH",
                }
            }
            else if(this.memory.labstate==3){
                var x='XLHO2'
                var sto={
                    0: "LHO2",
                    1: "X",
                }
            }
            var sfrom = {
                4: x,
                2: x,
                3: x,
                5: x,
                6: x,
                7: x,
                8: x,
                9: x
            }
            var mid = {

            }
            var reaction = {
                2: [0,1],
                3: [0,1],
                4: [0,1],
                5: [0,1],
                6: [0,1],
                7: [0,1],
                8: [0,1],
                9: [0,1]
            }
            this.memory.labtask = [sfrom,sto,mid,reaction]
        }
        else if(this.name == 'W28N6'){
            if(this.memory.labstate==undefined) this.memory.labstate=0
            if(this.memory.labstate==0&&storage.store['GH']>50000) this.memory.labstate=1
            if(this.memory.labstate==1&&storage.store['OH']>50000) this.memory.labstate=2
            if(this.memory.labstate==2&&storage.store['GH2O']>50000) this.memory.labstate=3
            if(this.memory.labstate==3&&storage.store['GH2O']<1000) this.memory.labstate=0
            if(this.memory.labstate==0){
                var x='GH'
                var sto = {
                    0: "G",
                    1: "H",
                }
            }
            else if(this.memory.labstate==1){
                var x='OH'
                var sto = {
                    0: "O",
                    1: "H",
                }
            }
            else if(this.memory.labstate==2){
                var x='GH2O'
                var sto = {
                    0: "GH",
                    1: "OH",
                }
            }
            else if(this.memory.labstate==3){
                var x='XGH2O'
                var sto = {
                    0: "XGH2O",
                    1: "X",
                }
            }
            var sfrom = {
                4: x,
                2: x,
                3: x,
                5: x,
                6: x,
                7: x,
                8: x,
                9: x
            }
            var mid = {

            }
            var reaction = {
                2: [0,1],
                3: [0,1],
                4: [0,1],
                5: [0,1],
                6: [0,1],
                7: [0,1],
                8: [0,1],
                9: [0,1]
            }
            this.memory.labtask = [sfrom,sto,mid,reaction]
        }
    },
    // 房间物资传输
    trans: function(){
        if(this.name == 'W29N6'){
            if(this.terminal.store["battery"]>5000){
                this.terminal.send("battery",this.terminal.store['battery'],'W29N4')
            }
            else if(this.terminal.store['G']>20000){
                if(Game.rooms['W29N4'].terminal.store['G']<50000){
                    this.terminal.send('G',10000,'W29N4')
                }
                else{
                    this.terminal.send('G',10000,'W29N5')
                }
            }
        }
        if(this.name == 'W29N4'){
            if(!this.memory.miststate) this.memory.miststate=0
            if(this.terminal.store["power"]>5000 && Game.rooms['W29N5'].storage.store['power']<this.storage.store['power']){
                this.terminal.send("power",5000,'W29N5')
            }
            else if(this.terminal.store['K']>20000){
                this.terminal.send('K',10000,'W28N6')
            }
            else if(this.memory.miststate==0 && this.terminal.store['condensate']>=160){
                this.terminal.send('condensate',160,'W28N6')
                this.memory.miststate=1
            }
            else if(this.memory.miststate==1 && this.terminal.store['condensate']>=30){
                this.terminal.send('condensate',30,'W29N5')
                this.memory.miststate=0
            }
        }
        if(this.name == 'W29N5'){
            if(this.memory.cellstate==undefined){
                this.memory.cellstate=0
            }
            if(this.memory.siliconstate==undefined){
                this.memory.siliconstate=0
            }
            var barlist = {
                W29N4:{
                    keanium_bar:5000,
                    utrium_bar:5000,
                    zynthium_bar:5000,
                    lemergium_bar:5000,
                    reductant:5000,
                    oxidant:5000,
                    purifier:5000,
                },
                W29N6:{
                    keanium_bar:5000,
                    utrium_bar:5000,
                    zynthium_bar:5000,
                    lemergium_bar:5000,
                    reductant:5000,
                    oxidant:5000,
                    purifier:5000,
                },
                W28N6:{
                    keanium_bar:5000,
                    utrium_bar:5000,
                    zynthium_bar:5000,
                    lemergium_bar:5000,
                    reductant:5000,
                    oxidant:5000,
                    purifier:5000,
                }
            }
            var sendBar = function(roomObject,barlist){
                for(key0 in barlist){
                    var storage = Game.rooms[key0].storage
                    var terminal = Game.rooms[key0].terminal
                    for(key1 in barlist[key0]){
                        if(storage.store[key1]+terminal.store[key1]<barlist[key0][key1]*0.5 && 
                            roomObject.terminal.store[key1]>barlist[key0][key1]-storage.store[key1]-terminal.store[key1]){
                            roomObject.terminal.send(key1,barlist[key0][key1]-storage.store[key1]-terminal.store[key1],key0)
                            console.log('向'+key0+'发送'+(barlist[key0][key1]-storage.store[key1]-terminal.store[key1])+key1)
                        }
                    }
                }
            }
            if(this.terminal.store['extract']>0){
                this.terminal.send('extract',this.terminal.store['extract'],'W29N6')
            }
            else{
                sendBar(this,barlist)
            }
        }
        if(this.name=='W28N6'){
            if(!this.memory.miststate) this.memory.miststate=0
            if(this.terminal.store['concentrate']>=6){
                if(this.memory.miststate==0){
                    if(this.terminal.send('concentrate',10,'W29N5')==0){
                        this.memory.miststate=1
                    }
                    
                }
                else if(this.memory.miststate==1){
                    if(this.terminal.send('concentrate',6,'W29N6')==0){
                        this.memory.miststate=0
                    }
                }
            }
            else if(this.terminal.store['composite']>10000 && Game.rooms['W29N6'].storage.store['composite']+Game.rooms['W29N6'].terminal.store['composite']<30000){
                this.terminal.send('composite',10000,'W29N6')
            }
            else if(this.terminal.store['energy']>45000 && this.storage.store['energy']>400000){
                this.terminal.send('energy',40000,'W29N5')
            }
        }
        if(this.name=='W31S9'){
            if(this.terminal.store['metal']>1000){
                this.terminal.send('metal',this.terminal.store['metal'],'W29N4')
            }
            else if(this.terminal.store['utrium_bar']>1000){
                this.terminal.send('utrium_bar',this.terminal.store['utrium_bar'],'W29N5')
            }
        }
        if(this.name=='W29S5'){
            if(this.terminal.store['metal']>1000){
                this.terminal.send('metal',this.terminal.store['metal'],'W29N4')
            }
            else if(this.terminal.store['keanium_bar']>1000){
                this.terminal.send('keanium_bar',this.terminal.store['utrium_bar'],'W29N5')
            }
        }
    },
    // 工厂生产
    produce: function(){
        var factory = this.factory
        var storage = this.storage
        var terminal = this.terminal
        if(this.name=='W29N4'){
            var comlist=['hydraulics','organoid','circuit','emanation','wire','cell','alloy','condensate','energy']
        }
        if(this.name=='W29N5'){
            var comlist=['fixtures','tissue','transistor','extract','wire','cell','alloy','condensate','crystal']
        }
        if(this.name=='W29N6'){
            var comlist=['frame','muscle','spirit','microchip','wire','cell','alloy','condensate','liquid']
        }
        if(this.name=='W28N6'){
            var comlist=['tube','phlegm','switch','concentrate','wire','cell','alloy','condensate','reductant','oxidant','keanium_bar','lemergium_bar','utrium_bar','composite']
        }
        if(this.name == 'W29N4'){
            if(factory && factory.cooldown==0 && factory.store.getFreeCapacity()>5000){
                if(factory.store['purifier']>=100&&factory.store["energy"]>200&&factory.store['X']<1000&&storage.store['X']<5000&&terminal.store['X']<5000){
                    factory.produce('X')
                }
                else if(factory.store['zynthium_bar']>=100&&factory.store['energy']>=200&&factory.store['Z']<=1000&&storage.store['Z']<=5000&&storage.store['Z']<=5000){
                    factory.produce('Z')
                }
                else if(factory.store['oxidant']>=100&&factory.store['energy']>=200&&factory.store['O']<=1000&&storage.store['O']<=5000&&terminal.store['O']<=5000){
                    factory.produce('O')
                }
                else if(factory.store['reductant']>=100&&factory.store['energy']>=200&&factory.store['H']<=1000&&storage.store['H']<=5000&&terminal.store['H']<=5000){
                    factory.produce('H')
                }
                else if(factory.store['metal']>=100&&factory.store['zynthium_bar']>=20&&factory.store['energy']>=40){
                    factory.produce('alloy')
                }
                else if(factory.store['utrium_bar']>=20 && factory.store['silicon']>=100){
                    factory.produce('wire')
                }
                else if((factory.store["battery"]>=50 && storage.store.getFreeCapacity()>100000&&factory.store.getFreeCapacity()>5000)||
                    factory.store['energy'<5000]){
                    factory.produce(RESOURCE_ENERGY)
                }
                else{
                    for(key of comlist){
                        if(factory.pro(key) !== 0){
                            continue
                        }
                        else{
                            break
                        }
                    }
                }
            }
        }
        else if(this.name == 'W29N6'){
            if(factory&&factory.cooldown==0 && factory.store.getFreeCapacity()>5000){
                if(factory.store['lemergium_bar']>=100&&factory.store['energy']>=200&&factory.store['L']<=1000&&storage.store['L']<=5000&&terminal.store['L']<=5000){
                    factory.produce('L')
                }
                else if(factory.store['L']>=500&&storage.store['L']>50000){
                    factory.produce('lemergium_bar')
                }
                else if(factory.store['purifier']>=100&&factory.store["energy"]>200&&factory.store['X']<1000&&storage.store['X']<5000&&terminal.store['X']<5000){
                    factory.produce('X')
                }
                else if(factory.store['reductant']>=100&&factory.store['energy']>=200&&factory.store['H']<=1000&&storage.store['H']<=5000){
                    factory.produce('H')
                }
                else if(factory.store['zynthium_bar']>=100&&factory.store['energy']>=200&&storage.store['Z']<=5000&&terminal.store['Z']<5000){
                    factory.produce('Z')
                }
                else if(factory.store['oxidant']>=100&&factory.store['energy']>=200&&factory.store['O']<=1000&&storage.store['O']<=5000&&terminal.store['O']<=5000){
                    factory.produce('O')
                }
                else if(factory.store['utrium_bar']>=100&&factory.store['energy']>=200&&storage.store['U']<=5000&&terminal.store['U']<5000){
                    factory.produce('U')
                }
                else if(factory.store['U']>=500 &&factory.store['energy']>=200&&storage.store['U']+terminal.store['U']>10000){
                    factory.produce('utrium_bar')
                }
                else if(factory.store['keanium_bar']>=100&&factory.store['energy']>=200&&factory.store['K']<=1000&&storage.store['K']<=5000){
                    factory.produce('K')
                }
                else if(storage.store['K']>50000 && factory.store['K']>=500 && factory.store['energy']>200){
                    factory.produce('keanium_bar')
                }
                else{
                    for(key of comlist){
                        if(factory.pro(key) !== 0){
                            continue
                        }
                        else{
                            break
                        }
                    }
                }
            }
        }
        else if(this.name == 'W29N5'){
            if(factory.cooldown==0 && factory.store.getFreeCapacity()>5000){
                if(factory.store['utrium_bar']>=100&&factory.store['energy']>=200&&storage.store['U']<=5000&&terminal.store['U']<5000){
                    factory.produce('U')
                }
                else if(factory.store['lemergium_bar']>=100&&factory.store['energy']>=200&&factory.store['L']<=1000&&storage.store['L']<=5000&&terminal.store['L']<=5000){
                    factory.produce('L')
                }
                else if(factory.store['U']>=500 &&factory.store['energy']>=200&&storage.store['U']+terminal.store['U']>10000){
                    factory.produce('utrium_bar')
                }
                else if(factory.store['K']>=500 &&factory.store['energy']>=200&&storage.store['K']+terminal.store['K']>10000){
                    factory.produce('keanium_bar')
                }
                else if(factory.store['purifier']>=100&&factory.store["energy"]>200&&factory.store['X']<1000&&storage.store['X']<5000){
                    factory.produce('X')
                }
                else if(factory.store['reductant']>=100&&factory.store['energy']>=200&&factory.store['H']<=1000&&storage.store['H']<=5000){
                    factory.produce('H')
                }
                else if(factory.store['oxidant']>=100&&factory.store['energy']>=200&&factory.store['O']<=1000&&storage.store['O']+terminal.store['O']<=5000){
                    factory.produce('O')
                }
                else if(factory.store['O']>=500&&factory.store['energy']>=200&&storage.store['O']+terminal.store['O']>50000){
                    factory.produce('oxidant')
                }
                else if(factory.store['keanium_bar']>=100&&factory.store['energy']>=200&&factory.store['K']<=1000&&storage.store['K']<=5000){
                    factory.produce('K')
                }
                else if(factory.store['G']>=500&&factory.store['energy']>=200&&storage.store['ghodium_melt']<50000&&factory.store['ghodium_melt']<=1000){
                    factory.produce('ghodium_melt')
                }
                /*
                else if((factory.store["battery"]>=50 && storage.store.getFreeCapacity()>200000&&factory.store.getFreeCapacity()>5000)||
                    factory.store['energy'<5000]){
                    factory.produce(RESOURCE_ENERGY)
                }
                */
                else{
                    for(key of comlist){
                        if(factory.pro(key) !== 0){
                            continue
                        }
                        else{
                            break
                        }
                    }
                }
            }
        }
        else if(this.name == 'W28N6'){
            if(0){
                
            }
            else{
                for(key of comlist){
                    if(factory.pro(key) !== 0){
                        continue
                    }
                    else{
                        break
                    }
                }
            }
        }
        else if(this.name == 'W31S9'){
            if(factory.store['U']>=500 && factory.store['energy']>200){
                factory.produce('utrium_bar')
            }
        }
        else if(this.name == 'W29S5'){
            if(factory.store['K']>=500 && factory.store['energy']>200){
                factory.produce('keanium_bar')
            }
        }
    },
    // 过道房找资源
    findSource: function(){
        if(guodao.indexOf(this.name) != -1){
            var depo = this.find(FIND_DEPOSITS)
            if(depo&&depo.length>0){
                for(i=0;i<depo.length;i++){
                    var f = this.lookForAt(LOOK_FLAGS,depo[i].pos)
                    if(f.length==0){
                        if(!Game.flags['depo4']) var flag = 'depo4'
                        if(!Game.flags['depo3']) var flag = 'depo3'
                        if(!Game.flags['depo2']) var flag = 'depo2'
                        if(!Game.flags['depo1']) var flag = 'depo1'
                        if(!Game.flags['depo0']) var flag = 'depo0'
                        if(flag&&depo[i].lastCooldown<90){
                            this.createFlag(depo[i].pos,flag)
                            Memory.flags[flag] = {
                                source: depo[i].id,
                                lastCooldown: depo[i].lastCooldown,
                                vacancy: global.findVacancy(depo[i])
                            }
                        }
                    }
                    else{
                        if(1){
                            f[0].memory = {
                                source: depo[i].id,
                                lastCooldown: depo[i].lastCooldown,
                            }
                        }
                    }
                }
            }
            if(this.name!='W30N8'){
                var pb = this.find(FIND_STRUCTURES,{
                    filter: s => s.structureType == STRUCTURE_POWER_BANK
                })
            }
            if(pb&&pb.length>0){
                for(i=0;i<pb.length;i++){
                    var f = this.lookForAt(LOOK_FLAGS,pb[i].pos)
                    if(f.length==0){
                        if(!Game.flags['pb1']) var flag = 'pb1'
                        if(!Game.flags['pb0']) var flag = 'pb0'
                        if(flag&&pb[i].power>3000&&pb[i].ticksToDecay>4000){
                            if(this.lookForAt(LOOK_FLAGS,pb[i].pos).length == 0){
                                this.createFlag(pb[i].pos,flag)
                            }
                            Memory.flags[flag] = {
                                source: pb[i].id,
                                amount0:2,
                                amount1:Math.floor(pb[i].power / 1600)+1,
                                count1:0,
                                state:0,
                            }
                        }
                    }
                    else{
                        if(!f[0].memory){
                            f[0].memory = {
                                source: pb[i].id,
                                amount0:2,
                                amount1:Math.floor(pb[i].power / 1600)+1,
                                count1:0,
                                state:0,
                                vacancy:vacancy
                            }
                        }
                    }
                }
            }
        }
        else return
    },
    // 核弹警报
    findNuke: function(){
        if(this.name in mainRoom){
            var nuke = this.find(FIND_NUKES)
            if(nuke.length>0){
                console.log(this.name+'原子弹来啦')
            }
        }
    },
    // 烧power
    processpower: function(){
        if(this.memory.powerspawn){
            var ps = Game.getObjectById(this.memory.powerspawn)
            if(ps) ps.processPower()
        }
        else return
    },
    // ob
    observe: function(){
        if(this.memory.observer){
            var ob = Game.getObjectById(this.memory.observer)
            var i = Game.time%guodao.length
            ob.observeRoom(guodao[i])
        }
        else return
    }
}