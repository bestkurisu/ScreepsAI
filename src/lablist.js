// 需要设置默认lab编号和boost用container

module.exports = function(roomName){
    var lablist = []
    var Storage = Game.rooms[roomName].storage
    var Terminal = Game.rooms[roomName].terminal
    
    addlist = function(resource,from,to){
        var task = {
            resource:resource,
            from:from.id,
            to:to.id,
        }
        return task
    }
    // 手动操作先设置room.memory.shoucao为true，不用时请注释
    if(Game.rooms[roomName].memory.shoucao){
        //var task = addlist(RESOURCE_ENERGY,Storage,lab[0])
        //lablist.push(task)
        Game.rooms[roomName].memory.shoucao = false
    }
    else{
        if(1){
            // 加能量
            for(i=0;i<lab.length;i++){
                if(lab[i].store[RESOURCE_ENERGY]<600){
                    var task = addlist(RESOURCE_ENERGY,Storage,lab[i])
                    lablist.push(task)
                }
            }
            // 如果要boost
            if(roomName == 'W29N4'){
                if(0){
                    if(lab[5].mineralType && lab[5].mineralType != 'GH'){
                        var task = addlist(lab[5].mineralType,lab[5],Terminal)
                        lablist.push(task)
                    }
                    if(lab[5].store['GH']<1000){
                        if(Terminal.store['GH']>100){
                            var task = addlist('GH',Terminal,lab[5])
                            lablist.push(task)
                        }
                        else if(Storage.store['GH']>100){
                            var task = addlist('GH',Storage,lab[5])
                            lablist.push(task)
                        }
                    }
                }
                if(container[0].store.getFreeCapacity()<1000){
                    for(var resourceType in container[0].store){
                        var task = addlist(resourceType,container[0],Storage)
                        lablist.push(task)
                    }
                }
            }
            // 如果要跑反应
            if(Game.rooms[roomName].memory.labtask){
                var sfrom = Game.rooms[roomName].memory.labtask[0]
                var sto = Game.rooms[roomName].memory.labtask[1]
                var mid = Game.rooms[roomName].memory.labtask[2]
                var reaction = Game.rooms[roomName].memory.labtask[3]
                if(sto){
                    for(key in sto){
                        var num = key*1
                        if(lab[num].mineralType && lab[num].mineralType != sto[key]){
                            var task = addlist(lab[num].mineralType,lab[num],Terminal)
                            lablist.push(task)
                        }
                        if(lab[num].store[sto[key]]<1000){
                            if(Terminal.store[sto[key]]>100){
                                var task = addlist(sto[key],Terminal,lab[num])
                                lablist.push(task)
                            }
                            else if(Storage.store[sto[key]]>100){
                                var task = addlist(sto[key],Storage,lab[num])
                                lablist.push(task)
                            }
                        }
                    }
                }
                if(sfrom){
                    for(key in sfrom){
                        var num = key*1
                        if(lab[num]){
                            if(lab[num].mineralType && lab[num].mineralType != sfrom[key]){
                                var task = addlist(lab[num].mineralType,lab[num],Terminal)
                                lablist.push(task)
                            }
                            if(lab[num].store[sfrom[key]]>2000){
                                var task = addlist(sfrom[key],lab[num],Terminal)
                                lablist.push(task)
                            }
                            lab[num].runReaction(lab[reaction[key][0]],lab[reaction[key][1]])
                        }
                        if(Game.time%1000==0){
                            if(lab[num].mineralType){
                                var task = addlist(lab[num].mineralType,lab[num],Terminal)
                                lablist.push(task)
                            }
                        }
                    }
                }
                
                if(mid){
                    for(key in mid){
                        var num = key*1
                        if(lab[num].mineralType && lab[num].mineralType != mid[key]){
                            var task = addlist(lab[num].mineralType,lab[num],Terminal)
                            lablist.push(task)
                        }
                        lab[num].runReaction(lab[reaction[key][0]],lab[reaction[key][1]])
                    }
                }
            }
        }
    }
    return lablist
};