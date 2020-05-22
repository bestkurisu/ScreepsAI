module.exports = function(roomName0,roomName1){
    var translist = []
    addlist = function(from,to,resource,complete,type){
        var task = {
            from:from,
            to:to,
            resource:resource,
            complete:complete,
            type:type
        }
        return task
    }
    var Storage0 = Game.rooms[roomName0].storage
    if(roomName1 == 'W29N4'){
        if(roomName0 == 'W29N4'){
            var resourcecontainer = [Game.getObjectById('5e8199acaffb7347adb866b8'),
                                 Game.getObjectById('5e81b96edc5ddebb95f3072a'),
                                 Game.getObjectById('5e8998c986e8361ceb23ae84'),
                                 Game.getObjectById('5e9e59b3d8ed18fca4d04d17')]
            var nuker = Game.getObjectById('5ea61bca676028c56d38f956')
            if(resourcecontainer[0].store[RESOURCE_ENERGY] > 1200){
                var task = addlist(resourcecontainer[0].id,Storage0.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
            }
            if(resourcecontainer[1].store[RESOURCE_ENERGY] > 1200){
                var task = addlist(resourcecontainer[1].id,Storage0.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
            }
            if(resourcecontainer[2].store[RESOURCE_KEANIUM] > 1200){
                var task = addlist(resourcecontainer[2].id,Storage0.id,RESOURCE_KEANIUM,2,1)
                translist.push(task)
            }
            if(resourcecontainer[3].store.getUsedCapacity() > 1200){
                for(var resourceType in resourcecontainer[3].store){
                    var task = addlist(resourceType,resourcecontainer[3].id,Storage0.id,2,1)
                    translist.push(task)
                }
            }
            if(nuker.store['G']<5000){
                var terminal=Game.rooms[roomName0].terminal
                var task = addlist(terminal.id,nuker.id,'G',4,1)
                translist.push(task)
            }
            if(nuker.store['energy']<300000){
                var task = addlist(Storage0.id,nuker.id,'energy',4,1)
                translist.push(task)
            }
        }
    }
    else if(roomName1 == 'W29N5'){
        var Storage1 = Game.rooms['W29N5'].storage
        if(roomName0 == 'W29N5'){
            var container = [Game.getObjectById('5e83575380d10fe4cc246929'),
                            Game.getObjectById('5e8346da837b762e427135c6'),
                            Game.getObjectById('5e9e7bc9a6def7be31757171')]
            if(container[0].store[RESOURCE_ENERGY] > 1000){
                var task = addlist(container[0].id, Storage1.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
            }
            if(container[1].store[RESOURCE_ENERGY] > 1000){
                var task = addlist(container[1].id, Storage1.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
            }
            if(container[2].store['O'] > 1000){
                var task = addlist(container[2].id, Storage1.id,'O',2,1)
                translist.push(task)
            }
            var nuker = Game.getObjectById('5ec302595d9bf2e1da803d27')
            if(nuker.store['G']<5000){
                var terminal=Game.rooms[roomName1].terminal
                var task = addlist(terminal.id,nuker.id,'G',4,1)
                translist.push(task)
            }
            if(nuker.store['energy']<300000){
                var task = addlist(Storage0.id,nuker.id,'energy',4,1)
                translist.push(task)
            }
        }
    }
    else if(roomName1 == 'W29N6'){
        if(roomName0 == 'W29N6'){
            var container = [Game.getObjectById('5e8511c4d01eb27576ec2bb7'),
                         Game.getObjectById('5e832dfeb3598b2112eb11b3'),
                         Game.getObjectById('5e92c33325a59186a3675e73')]
            var nuker = Game.getObjectById('5eb6c01d014c80bbd3eebb78')
            if(container[0].store[RESOURCE_ENERGY] > 900){
                var task = addlist(container[0].id, Storage0.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
            }
            if(container[1].store[RESOURCE_ENERGY] > 900){
                var task = addlist(container[1].id, Storage0.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
            }
            if(container[2].store[RESOURCE_LEMERGIUM] > 900){
                var task = addlist(container[2].id, Storage0.id,RESOURCE_LEMERGIUM,2,1)
                translist.push(task)
            }
            var Terminal = Game.rooms[roomName0].terminal
            if(nuker.store['G']<5000){
                var task = addlist(Terminal.id,nuker.id,'G',4,1)
                translist.push(task)
            }
            if(nuker.store['energy']<300000){
                var task = addlist(Storage0.id,nuker.id,'energy',4,1)
                translist.push(task)
            }
        }
    }
    else if(roomName1 == 'W28N6'){
        var container = [Game.getObjectById(Game.flags['Flag12'].memory.container),
                        Game.getObjectById(Game.flags['Flag13'].memory.container),
                        Game.getObjectById('5ec4a859c9853c346c78f438')]
        var Storage = Game.rooms[roomName1].storage
        if(container[0]&&container[0].store[RESOURCE_ENERGY] > 900){
                var task = addlist(container[0].id, Storage.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
        }
        if(container[1]&&container[1].store[RESOURCE_ENERGY] > 900){
            var task = addlist(container[1].id, Storage.id,RESOURCE_ENERGY,2,1)
            translist.push(task)
        }
        if(container[2]&&container[2].store['U']>800){
            var task = addlist(container[2].id, Storage.id,'U',2,1)
            translist.push(task)
        }
    }
    else if(roomName1 == 'W31S9'){
        var terminal = Game.rooms[roomName1].terminal
        var container = [Game.getObjectById('5eacaaf10316ee708d685740'),
                        Game.getObjectById('5eacbfee34cf582506609770'),
                        Game.getObjectById('5eb552a8d88f52210c70e7af'),
                        Game.getObjectById('5ec408bbaf68190de2935f7e')]
        if(container[0]&&container[0].store[RESOURCE_ENERGY] > 900){
                var task = addlist(container[0].id, terminal.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
        }
        if(container[1]&&container[1].store[RESOURCE_ENERGY] > 900){
            var task = addlist(container[1].id, Storage0.id,RESOURCE_ENERGY,2,1)
            translist.push(task)
        }
        if(container[2].store['energy']<800&&Storage0.store['energy']>10000){
            var task = addlist(Storage0.id,container[2].id,RESOURCE_ENERGY,1,1)
            translist.push(task)
        }
        if(container[3].store['U']>900){
            var task = addlist(container[3].id, terminal.id,'U',2,1)
            translist.push(task)
        }
        if(Storage0.store['metal']>0){
            var task = addlist(Storage0.id,terminal.id,'metal',1,1)
            translist.push(task)
        }
    }
    else if(roomName1 == 'W29S5'){
        var storage=Game.rooms[roomName1].storage
        var container = [Game.getObjectById('5ebc559662ddff832f2f6da9'),
                        Game.getObjectById('5ebc42b26ae95c3a809c5257'),
                        Game.getObjectById('5ec148260cd6850b23f7e46b')]
        if(container[0]&&container[0].store[RESOURCE_ENERGY] > 900){
            var task = addlist(container[0].id, storage.id,RESOURCE_ENERGY,2,1)
            translist.push(task)
        }
        if(container[1]&&container[1].store[RESOURCE_ENERGY] > 900){
            var task = addlist(container[1].id, storage.id,RESOURCE_ENERGY,2,1)
            translist.push(task)
        }
        if(container[2].store['energy']<1200){
            var task = addlist(storage.id,container[2].id,RESOURCE_ENERGY,1,1)
            translist.push(task)
        }
    }
    return translist
}