// 需要从memory读取link和factory
module.exports = function(roomName){
    var centerlist = []
    const Storage = Game.rooms[roomName].storage
    const Terminal = Game.rooms[roomName].terminal
    const Factory = Game.rooms[roomName].factory
    const ps = Game.getObjectById(Game.rooms[roomName].memory.powerspawn)
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
    if(roomName == 'W29N4'){
        var terlist = {
            K: 50000,
            U: 10000,
            ZK: 10000,
            UL: 10000,
            H: 20000,
            O: 20000,
            tissue: 10000,
            organism: 10,
            frame:3,
            L: 10000,
            crystal: 10000,
            XGHO2: 50000,
            power: 10000,
            ops: 5000,
            condensate: 10000,
            wire:10000,
            essence:10,
            composite:10000,
            circuit:10000,
            alloy:10000,
            hydraulics:100,
            fixtures:100,
            machine:10,
            XZHO2:50000,
        }
        var faclist = {
            battery: 5000,
            utrium_bar: 1000,
            zynthium_bar: 1000,
            purifier: 1000,
            reductant:1000,
            lemergium_bar:1000,
            reductant: 1000,
            oxidant: 1000,
            keanium_bar: 1000,
            switch:100,
            transistor:100,
            microchip:100,
            silicon:1000,
            metal:1000,
            liquid:300,
            tube:100,
        }
    }
    if(roomName == 'W29N6'){
        var terlist = {
            G: 30000,
            O: 20000,
            silicon: 10000,
            battery: 10000,
            XKHO2: 100000,
            phlegm: 10000,
            microchip: 50,
            switch: 10000,
            ops:5000,
            spirit:100,
            liquid:5000,
            microchip:1000,
            frame:1000,
        }
        var faclist = {
            utrium_bar: 1000,
            keanium_bar: 1000,
            battery: 1000,
            zynthium_bar: 1000,
            reductant: 1000,
            purifier: 1000,
            cell: 1000,
            lemergium_bar: 1000,
            oxidant: 1000,
            keanium_bar: 1000,
            wire:500,
            L:1000,
            K:1000,
            concentrate:100,
            extract:100,
            transistor:100,
            composite:100,
            fixtures:100,
            tube:100,
        }
    }
    if(roomName == 'W29N5'){
        var terlist = {
            O: 50000,
            ops: 5000,
            reductant: 10000,
            oxidant: 10000,
            keanium_bar: 10000,
            utrium_bar: 10000,
            purifier: 10000,
            zynthium_bar: 10000,
            lemergium_bar: 10000,
            ghodium_melt: 10000,
            XZHO2:60000,
            XKHO2:10000,
            XGHO2:100000,
            extract:1000,
            crystal:5000,
            transistor:1000,
            silicon:1000,
            metal:1000,
            fixtures:1000,
            battery:50000,
        }
        var faclist = {
            lemergium_bar: 1000,
            zynthium_bar: 1000,
            battery: 5000,
            oxidant: 1000,
            reductant: 1000,
            G: 5000,
            keanium_bar: 1000,
            utrium_bar: 1000,
            purifier: 1000,
            O: 1000,
            U: 1000,
            K: 1000,
            condensate:1000,
            concentrate:100,
            wire:100,
            switch:100,
            alloy:100,
            composite:100,
        }
    }
    if(roomName == 'W28N6'){
        var terlist = {
            ops:5000,
            concentrate:1000,
            composite:5000,
            switch:1000,
            tube:1000,
        }
        var faclist = {
            U:1000,
            O:1000,
            H:1000,
            K:1000,
            L:1000,
            Z:1000,
            X:1000,
            lemergium_bar: 1000,
            biomass:2000,
            zynthium_bar: 1000,
            metal: 2000,
            oxidant: 1000,
            reductant: 1000,
            keanium_bar: 1000,
            silicon: 1000,
            utrium_bar: 1000,
            purifier: 1000,
            condensate:1000,
            wire:100,
            alloy:100,
        }
    }
    if(Terminal){
        if(Terminal.store['energy']<45000&&Storage.store['energy']>10000){
            var task = addlist('energy',Storage,Terminal,50000-Terminal.store['energy'])
            centerlist.push(task)
        }
        else{
            if(Terminal.store['energy']>55000 && Storage.store.getFreeCapacity()>50000){
                var task = addlist('energy',Terminal,Storage,Terminal.store['energy']-50000)
                centerlist.push(task)
            }
        }
    }
    if(Factory){
        if(Factory.store['energy']<5000&&Storage.store['energy']>10000){
            var task = addlist('energy',Storage,Factory,8000-Factory.store['energy'])
            centerlist.push(task)
        }
        else{
            if(Factory.store['energy']>10000){
                var task = addlist('energy',Factory,Storage,Factory.store['energy']-8000)
                centerlist.push(task)
            }
        }
    }
    if(ps){
        if(ps.store['energy']<3000&&Storage.store['energy']>150000){
            var task = addlist('energy',Storage,ps,5000)
            centerlist.push(task)
        }
        if(ps.store['power']<50&&Storage.store['power']>0){
            var task = addlist('power',Storage,ps,100)
            centerlist.push(task)
        }
    }
    if(faclist && Factory){
        for(key in Factory.store){
            if(key in faclist){
                if(Factory.store[key]<faclist[key]){
                    if(Storage.store[key]>0){
                        var task = addlist(key,Storage,Factory,faclist[key]-Factory.store[key])
                        centerlist.push(task)
                    }
                    else if(Terminal.store[key]>0){
                        var task = addlist(key,Terminal,Factory,faclist[key]-Factory.store[key])
                        centerlist.push(task)
                    }
                }
                else if(Factory.store[key]>faclist[key]){
                    var task = addlist(key,Factory,Storage,Factory.store[key]-faclist[key])
                    centerlist.push(task)
                }
            }
            else if(key !== 'energy'){
                var task = addlist(key,Factory,Storage,Factory.store[key])
                centerlist.push(task)
            }
        }
        for(key in faclist){
            if(!(key in Factory.store)){
                if(Storage.store[key]>0){
                    var task = addlist(key,Storage,Factory,faclist[key])
                    centerlist.push(task)
                }
                else if(Terminal.store[key]>0){
                    var task = addlist(key,Terminal,Factory,faclist[key])
                    centerlist.push(task)
                }
            }
        }
    }
    if(terlist){
        for(key in Terminal.store){
            if(key in terlist){
                if(Terminal.store[key]<terlist[key]){
                    if(Storage.store[key]>0){
                        var task = addlist(key,Storage,Terminal,terlist[key]-Terminal.store[key])
                        centerlist.push(task)
                    }
                    else if(Factory!=undefined&&Factory.store[key]>0){
                        var task = addlist(key,Factory,Terminal,terlist[key]-Terminal.store[key])
                        centerlist.push(task)
                    }
                }
                else if(Terminal.store[key]>terlist[key]){
                    var task = addlist(key,Terminal,Storage,Terminal.store[key]-terlist[key])
                    centerlist.push(task)
                }
            }
            else if(key !== 'energy'){
                var task = addlist(key,Terminal,Storage,Terminal.store[key])
                centerlist.push(task)
            }
        }
        for(key in terlist){
            if(!(key in Terminal.store)){
                if(Factory!=undefined&&Factory.store[key]>0){
                    var task = addlist(key,Factory,Terminal,terlist[key])
                    centerlist.push(task)
                }
                else if(Storage.store[key]>0){
                    var task = addlist(key,Storage,Terminal,terlist[key])
                    centerlist.push(task)
                }
            }
        }
    }
    
    return centerlist
};