// 需要设置默认lab编号和boost用container

module.exports = function(roomName){
    var lablist = []
    var Storage = Game.rooms[roomName].storage
    var Terminal = Game.rooms[roomName].terminal
    if(roomName == 'W29N4'){
        var lab = [Game.getObjectById('5e89e735444aab20c0c59e8f'),
                    Game.getObjectById('5e91a9054c37b27c44d63871'),
                    Game.getObjectById('5e89cae22877540b77f139b3'),
                    Game.getObjectById('5e8a0c4992ec7da63c35cf27'),
                    Game.getObjectById('5e917b23f417f505da965f4b'),
                    Game.getObjectById('5e919301c8154ba26c4f9478'),
                    Game.getObjectById('5ea635d4e3e49c2cbd8b3e13'),
                    Game.getObjectById('5ea646a10ae7b62288af80eb'),
                    Game.getObjectById('5ea6794190352efad02e0795'),
                    Game.getObjectById('5ea6a82ec5a0dafaf597c7b8')]
        var container = [Game.getObjectById('5e8a81de0ebc32d96d486342')]
    }
    else if(roomName == 'W29N6'){
        var lab = [Game.getObjectById('5e9e2466b691dc36673adca0'),
                    Game.getObjectById('5e93e699cfe93fd5a9837098'),
                    Game.getObjectById('5e93582c282f2697a10e2775'),
                    Game.getObjectById('5e93a9ee8db0f00c6ee61b71'),
                    Game.getObjectById('5e9df34f956a9f3f0cdbf44b'),
                    Game.getObjectById('5e9dc37d22ea719556bc7cf2'),
                    Game.getObjectById('5eb671d11d6bca7c1715da7a'),
                    Game.getObjectById('5eb68e81018f623e04385e8c'),
                    Game.getObjectById('5eb6a19a92e7b87a36a343ad'),
                    Game.getObjectById('5eb6b4be8897ce8b05da5655')]
    }
    else if(roomName == 'W29N5'){
        var lab = [Game.getObjectById('5e9fb32f271a2fa49d6f27c7'),
                    Game.getObjectById('5eacd0dd1dcfd33d1ec57a39'),
                    Game.getObjectById('5e9edb000053c72b29af5d19'),
                    Game.getObjectById('5e9f41f9ce6f481d775da89e'),
                    Game.getObjectById('5eacaa324a475284a28f1c57'),
                    Game.getObjectById('5eac827f42ffeb1cbd055420'),
                    Game.getObjectById('5ec31a7eff562dd0dcbc0011'),
                    Game.getObjectById('5ec334897829da02e52c7a9a'),
                    Game.getObjectById('5ec352a9111063141d946fb5'),
                    Game.getObjectById('5ec36f813f49fc5c24094e37')]
    }
    else if(roomName == 'W28N6'){
        var lab = [Game.getObjectById('5ec36fac05ada05bc96865f9'),
                    Game.getObjectById('5eb6760f40ee73c687915e4c'),
                    Game.getObjectById('5ee92d16d86e581318a4184f'),
                    Game.getObjectById('5ee91a93aef40c556cfab9a5'),
                    Game.getObjectById('5ee90468cccf4936eaedbb2e'),
                    Game.getObjectById('5ee8f1989269083fa9ec8be6'),
                    Game.getObjectById('5ec2fe6bbc03a0130d0dd1ac'),
                    Game.getObjectById('5ec267aa6d9370de30db18c8'),
                    Game.getObjectById('5eb657ba4818e84ba6695930'),
                    Game.getObjectById('5eb666f696cd0c30f51c3277')]
    }
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