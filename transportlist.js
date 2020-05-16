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
    var terminal = Game.rooms[roomName0].terminal
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
                var task = addlist(Storage0.id,nuker.id,'G',4,1)
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
    else if(roomName1 == 'W28N5'){
        if(Game.rooms['W28N5'] != undefined){
            var container = Game.getObjectById(Game.flags['Flag8'].memory.container)
            if(container && container.store[RESOURCE_ENERGY] > 900){
                var task = addlist(container.id, Storage0.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
            }
        }
    }
    else if(roomName1 == 'W29N7'){
        if(Game.rooms['W29N7'] != undefined){
            var container = Game.getObjectById(Game.flags['Flag9'].memory.container)
            if(container && container.store[RESOURCE_ENERGY] > 900){
                var task = addlist(container.id, Storage0.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
            }
        }
    }
    else if(roomName1 == 'W28N6'){
        var container = [Game.getObjectById(Game.flags['Flag12'].memory.container),
                        Game.getObjectById(Game.flags['Flag13'].memory.container)]
        var Storage = Game.getObjectById('5ea701a338e95e1f0429712b')
        if(container[0]&&container[0].store[RESOURCE_ENERGY] > 900){
                var task = addlist(container[0].id, Storage.id,RESOURCE_ENERGY,2,1)
                translist.push(task)
        }
        if(container[1]&&container[1].store[RESOURCE_ENERGY] > 900){
            var task = addlist(container[1].id, Storage.id,RESOURCE_ENERGY,2,1)
            translist.push(task)
        }
    }
    else if(roomName1 == 'W31S9'){
        var container = [Game.getObjectById('5eacaaf10316ee708d685740'),
                        Game.getObjectById('5eacbfee34cf582506609770'),
                        Game.getObjectById('5eb552a8d88f52210c70e7af')]
        if(container[0]&&container[0].store[RESOURCE_ENERGY] > 900){
                var task = addlist(container[0].id, Storage0.id,RESOURCE_ENERGY,2,1)
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
    }
    return translist
}