// 需要从memory读取link和factory
module.exports = function(roomName){
    var centerlist = []
    const storage = Game.rooms[roomName].storage
    const terminal = Game.rooms[roomName].terminal
    const factory = Game.rooms[roomName].factory
    const ps = Game.rooms[roomName].powerspawn
    addlist = function(resource,from,to,amount,count=0){
        var task = {
            resource:resource,
            amount:amount,
            from:from.id,
            to:to.id,
            count:count,
        }
        return task
    }
    if(terminal){
        if(terminal.store['energy']<45000&&storage.store['energy']>10000){
            var task = addlist('energy',storage,terminal,50000-terminal.store['energy'])
            centerlist.push(task)
        }
        else{
            if(terminal.store['energy']>55000 && storage.store.getFreeCapacity()>50000){
                var task = addlist('energy',terminal,storage,terminal.store['energy']-50000)
                centerlist.push(task)
            }
        }
    }
    if(factory){
        if(factory.store['energy']<5000&&storage.store['energy']>10000){
            var task = addlist('energy',storage,factory,8000-factory.store['energy'])
            centerlist.push(task)
        }
        else{
            if(factory.store['energy']>10000){
                var task = addlist('energy',factory,storage,factory.store['energy']-8000)
                centerlist.push(task)
            }
        }
    }
    if(ps){
        if(ps.store['energy']<3000&&storage.store['energy']>150000){
            var task = addlist('energy',storage,ps,5000)
            centerlist.push(task)
        }
        if(ps.store['power']<50&&storage.store['power']>0){
            var task = addlist('power',storage,ps,100)
            centerlist.push(task)
        }
    }
    if(faclist && factory){
        for(key in factory.store){
            if(key in faclist){
                if(factory.store[key]<faclist[key]){
                    if(storage.store[key]>0){
                        var task = addlist(key,storage,factory,faclist[key]-factory.store[key])
                        centerlist.push(task)
                    }
                    else if(terminal && terminal.store[key]>0){
                        var task = addlist(key,terminal,factory,faclist[key]-factory.store[key])
                        centerlist.push(task)
                    }
                }
                else if(factory.store[key]>faclist[key]){
                    var task = addlist(key,factory,storage,factory.store[key]-faclist[key])
                    centerlist.push(task)
                }
            }
            else if(key !== 'energy'){
                var task = addlist(key,factory,storage,factory.store[key])
                centerlist.push(task)
            }
        }
        for(key in faclist){
            if(!(key in factory.store)){
                if(storage.store[key]>0){
                    var task = addlist(key,storage,factory,faclist[key])
                    centerlist.push(task)
                }
                else if(terminal.store[key]>0){
                    var task = addlist(key,terminal,factory,faclist[key])
                    centerlist.push(task)
                }
            }
        }
    }
    if(terlist && terminal){
        for(key in terminal.store){
            if(key in terlist){
                if(terminal.store[key]<terlist[key]){
                    if(storage.store[key]>0){
                        var task = addlist(key,storage,terminal,terlist[key]-terminal.store[key])
                        centerlist.push(task)
                    }
                }
                else if(terminal.store[key]>terlist[key]){
                    var task = addlist(key,terminal,storage,terminal.store[key]-terlist[key])
                    centerlist.push(task)
                }
            }
            else if(key !== 'energy'){
                var task = addlist(key,terminal,storage,terminal.store[key])
                centerlist.push(task)
            }
        }
        for(key in terlist){
            if(!(key in terminal.store)){
                if(storage.store[key]>0){
                    var task = addlist(key,storage,terminal,terlist[key])
                    centerlist.push(task)
                }
            }
        }
    }
    
    return centerlist
};