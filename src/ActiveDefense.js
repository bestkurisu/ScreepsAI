/*
主动防御模块，检测到敌人开启防御模式后会根据敌人种类进行防御。
需要有ram配合。

*/


const checkInterval = 10; //搜索敌人间隔,10Tick检测一次

var defense = {
    main: function (roomName) {
        const room = Game.rooms[roomName];
        if(room){
            try {
                const check = this.check(room);//如果房间无敌对creep 则开始检测 0表示检测到了进入防守模式 1表示节省cpu时间中 2表示已经在防守模式了
                this.tower(room);
                if (check === 2) {//防守模式
                    room.visual.text('DEFENSE', 25, 25);
                    if (!room.memory.defense.savedMatrix || Game.time % 50 === 0) {
                        this.make_defense_cost(room);
                    }
                    this.spawn_Defender(room, 1, 1);//0表示满员 1表示未满
                } 
                else {
                    room.visual.text('safe', room.controller.pos);
                    this.builder_run(room);
                    return;
                }
                this.atk_run(room);
            } 
            catch (err) {
                console.log(err); //有错误抛出时重置memory
                room.memory.defense = {
                    'hostile_Creeps': [],
                    'Defender_creeps': { 'atk': [], 'builder': [] },
                    'savedMatrix': false
                }
            }
        }
        else{
            console.log(roomName+'无视野')
        }
    },
    check: function (room) {
        if (room.memory.defense.hostile_Creeps.length === 0) {
            if (Game.time % checkInterval > 0) {
                return 1;
            }
            room.memory.defense.hostile_Creeps = [];
            room.find(FIND_HOSTILE_CREEPS).forEach(function (creep, index) {
                if (creep.getActiveBodyparts('heal') ||
                    creep.getActiveBodyparts('attack') ||
                    creep.getActiveBodyparts('ranged_attack') ||
                    creep.getActiveBodyparts('work') ||
                    creep.owner.username !== 'Invader') {
                    room.memory.defense.hostile_Creeps.push(creep.id);//如果检测到有敌人则会添加进列表
                }
            });
            if (room.memory.defense.hostile_Creeps.length > 0) {
                return 0;
            }
            return 1;
        }
        for (const index in room.memory.defense.hostile_Creeps) {
            const id = room.memory.defense.hostile_Creeps[index];
            const H_creeps = Game.getObjectById(id);
            if (!H_creeps) {
                room.memory.defense.hostile_Creeps.splice(index, 1);
            }
        }
        return 2;
    },
    spawn_Defender: function (room, dNumber, bNumber) {
        const defend = room.memory.defense;
        if (defend.Defender_creeps.atk.length >= dNumber && defend.Defender_creeps.builder.length >= bNumber) {//人数不够才会执行
            return 0;
        }
        for (const spawn of room.spawns) {
            if (spawn.spawning) {
                continue;//生产中则跳过
            }
            const name = this.name();
            if (room.memory.defense.Defender_creeps.atk.length < dNumber) {
                if (spawn.spawnCreep(this.mb({ 'attack': 32, 'move': 16 }), name, { memory: { 'role': 'R_D', 'roomname': room.name, 'boost': false } }) === 0) {
                    room.memory.defense.Defender_creeps.atk.push(name);
                    break;
                }
            }
            if (room.memory.defense.Defender_creeps.builder.length < bNumber) {
                if (spawn.spawnCreep(this.mb({ 'work': 16, 'carry': 16, 'move': 16 }), name, { memory: { 'role': 'R_B', 'roomname': room.name, 'boost': false } }) === 0) {
                    room.memory.defense.Defender_creeps.builder.push(name);
                    break;
                }
            }
        }
        return 1;
    },
    atk_run: function (room) {
        const cost = PathFinder.CostMatrix.deserialize(room.memory.defense.savedMatrix);
        const creepNameList = room.memory.defense.Defender_creeps.atk;
        for (const index in creepNameList) {
            const name = creepNameList[index];
            const creep = Game.creeps[name];
            if (!creep) {
                room.memory.defense.Defender_creeps.atk.splice(index, 1); //死了便删掉
                continue;
            }
            creep.room.visual.text(creep.memory.role, creep.pos);
            if (creep.memory.boost) {
                var lab = creep.room.find(FIND_STRUCTURES,{
                    filter: s => s.structureType === 'lab' &&
                            s.store['XUH2O'] > 30
                })
                if(lab.length>0){
                    if(creep.isNearTo(lab[0])){
                        lab[0].boostCreep(creep)
                        creep.memory.boost = false
                    }
                    else{
                        creep.moveTo(lab[0],{range:1})
                    }
                }
                else{
                    creep.memory.boost = false
                }
            }
            if (creep.memory.target) {
                const H_creeps = Game.getObjectById(creep.memory.target);
                if (!H_creeps) {
                    delete creep.memory.target;
                    continue;
                }
                if (creep.pos.isNearTo(H_creeps)) {
                    for (const tower of creep.room.towers) {
                        tower.attack(H_creeps);
                    }
                    if (creep.getActiveBodyparts('attack')) {
                        creep.attack(H_creeps);
                    }
                    if (creep.getActiveBodyparts('ranged_attack')) {
                        creep.rangedMassAttack();
                    }
                } else {
                    if (creep.pos.inRangeTo(H_creeps, 3)) {
                        creep.rangedAttack(H_creeps);
                    }
                    creep.moveTo(H_creeps, {
                        range: 1,
                        costCallback: function (roomName) {
                            const room = Game.rooms[roomName];
                            if (!room) return;
                            room.find(FIND_CREEPS).forEach((creep) => cost.set(creep.pos.x, creep.pos.y, 255));
                            return cost;
                        }, visualizePathStyle: { stroke: '#aaaacf', opacity: 0.3 }
                    });
                }
                continue;
            }

            if (this.find_target(creep) === 0) {
                creep.say('ok');
            } else {
                creep.say('noAttack');
            }
            continue; //如果有目标的话就执行
        }
    },
    builder_run: function (room) {
        const cost = PathFinder.CostMatrix.deserialize(room.memory.savedMatrix);
        const creepNameList = room.memory.defense.Defender_creeps.builder;
        for (const index in creepNameList) {
            const name = creepNameList[index];
            const creep = Game.creeps[name];
            if (!creep) {
                room.memory.defense.Defender_creeps.builder.splice(index, 1);
                continue;
            }
            creep.room.visual.text(creep.memory.role, creep.pos);
            if (!creep.memory.getEnergy && creep.store.getUsedCapacity('energy') === 0) {
                creep.memory.getEnergy = true;//能量用完的时候
                creep.memory.buildtarget = false;
                continue;
            }
            if (creep.memory.boost) {
                //boost
            }
            if (creep.memory.getEnergy) {//捡资源
                if (creep.pos.isNearTo(room.terminal)) {
                    creep.withdraw(room.terminal, 'energy');
                    creep.memory.getEnergy = false;
                } else {
                    creep.moveTo(room.terminal, { range: 1 });
                }
                continue;
            }
            if (creep.memory.buildtarget) {
                const target = Game.getObjectById(creep.memory.buildtarget);
                if (!target) {
                    delete creep.memory.buildtarget;
                    continue;
                }
                creep.moveTo(target, { range: 3 });
                if (creep.pos.inRangeTo(target, 3)) {
                    creep.repair(target);
                }
                continue;
            }
            const targets = room.find(FIND_STRUCTURES, {
                filter: object => (object.structureType === 'constructedWall' || object.structureType === 'rampart') && object.hits < object.hitsMax
            });
            targets.sort((a, b) => a.hits - b.hits);
            if (targets.length > 0) {
                creep.memory.buildtarget = targets[0].id;
            }
        }
    },
    make_defense_cost: function (room) {
        if (room.spawns.length === 0) {
            return 1;
        }
        const target = room.spawns[0];
        let roomName = target.pos.roomName;
        var matrix = new PathFinder.CostMatrix;
        a(roomName);
        b({ 'x': target.pos.x, 'y': target.pos.y });
        for (let i = 0; i < 100; i++) {
            let mark = 0;
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    if (matrix.get(x, y) === 10) {
                        mark = b({ 'x': x, 'y': y }) + mark;
                    }
                }
            }
            if (mark === 0) {
                break;
            }
        }
        const terrain = new Room.Terrain(roomName);
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tile = terrain.get(x, y);
                if (tile == TERRAIN_MASK_WALL) {
                    matrix.set(x, y, 255);
                }
            }
        }
        room.find(FIND_STRUCTURES).forEach(function (item, index) {
            if (item.structureType === 'rampart') {
                matrix.set(item.pos.x, item.pos.y, 1);
                return;
            }
            if (item.structureType != 'rampart' && item.structureType != 'road' && item.structureType != 'container') {
                matrix.set(item.pos.x, item.pos.y, 255);
            }
        });
        function a(roomName) {
            const terrain = new Room.Terrain(roomName);
            const room = Game.rooms[roomName];
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    const tile = terrain.get(x, y);
                    if (tile == TERRAIN_MASK_WALL) {
                        matrix.set(x, y, 250);//把墙设定为 250 为边界
                    } else {
                        matrix.set(x, y, 255);//其他设定255
                    }
                }
            }
            let target = room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType === 'rampart' && s.isPublic === false) ||
                    s.structureType === 'constructedWall'
            });
            for (let t of target) {
                matrix.set(t.pos.x, t.pos.y, 250); //墙和ram设为250为边界
            }
            return matrix;
        }
        function b(pos) {
            let mark = 0;
            let x = pos.x;
            let y = pos.y;
            let checkxy = [{ 'x': x + 1, 'y': y }, { 'x': x, 'y': y + 1 }, { 'x': x - 1, 'y': y }, { 'x': x, 'y': y - 1 }];
            matrix.set(x, y, 1);
            for (let xy of checkxy) {
                let number = matrix.get(xy.x, xy.y);
                if (number == 1) {
                    continue;
                } else if (matrix.get(xy.x, xy.y) == 250) {
                    mark++;
                    matrix.set(xy.x, xy.y, 1);
                } else if (matrix.get(xy.x, xy.y) == 255) {
                    mark++;
                    matrix.set(xy.x, xy.y, 10);
                }
            }
            return mark;
        };
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                let cost = matrix.get(x, y);
                //   room.visual.text(cost, x, y, { color: 'red', font: 0.3 });
            }
        }
        room.memory.defense.savedMatrix = matrix.serialize();
        return 0;
    },
    find_target: function (creep) {
        if (creep.memory.target) {
            return 1;
        }
        const Hcreeps = creep.room.find(FIND_HOSTILE_CREEPS);
        if (Hcreeps.length > 0) {
            creep.memory.target = Hcreeps[0].id;
            return 0;
        }
        return 1;
    },
    mb: function (makebody) {
        let body = [];
        for (let key in makebody) {
            let value = makebody[key];
            if (key === 'tough') {
                for (let i = 0; i < value; i++) {
                    body.push('tough')
                }
            } else if (key === 'work') {
                for (let i = 0; i < value; i++) {
                    body.push('work')
                }
            } else if (key === 'ranged_attack') {
                for (let i = 0; i < value; i++) {
                    body.push('ranged_attack')
                }
            } else if (key === 'attack') {
                for (let i = 0; i < value; i++) {
                    body.push('attack')
                }
            } else if (key === 'carry') {
                for (let i = 0; i < value; i++) {
                    body.push('carry')
                }
            } else if (key === 'heal') {
                for (let i = 0; i < value; i++) {
                    body.push('heal')
                }
            } else if (key === 'move') {
                for (let i = 0; i < value; i++) {
                    body.push('move')
                }
            }
        }
        return body;
    },
    name: function () {
        let name = [];
        for (let i = 0; i < 10; i++) {
            let number = Math.floor(Math.random() * 100);
            switch (number) {
                case 0:
                    name.push('U');
                    break;
                case 1:
                    name.push('Z');
                    break;
                case 2:
                    name.push('X');
                    break;
                case 3:
                    name.push('K');
                    break;
                case 4:
                    name.push('O');
                    break;
                case 5:
                    name.push('H');
                    break;
                case 6:
                    name.push('L');
                    break;
                case 7:
                    name.push('e');
                default:
                    name.push('five');
            }
        }
        if (!name.some(function (item) {
            return item !== 'five';
        })) {
            name = 'normal' + Game.time;
        } else {
            let number = 0;
            name.forEach(function (item, index) {
                if (item === 'five') {
                    name[index] = '⭐';
                } else {
                    number++;
                }
            })
            if (number === 10) {
                name = '⭐king';
            } else {
                name = name.join('');
            }
        }
        return name;
    },
    tower: function (room) {
        if (room.towers.length === 0) {
            return;
        }
        const creeps = room.find(FIND_HOSTILE_CREEPS);
        if (creeps.length === 0) {
            var heal = false;
            room.find(FIND_MY_CREEPS).forEach(function (creep, index) {
                if (heal) {
                    return;
                }
                if (creep.hits < creep.hitsMax) {
                    for (const tower of room.towers) {
                        tower.heal(creep);
                        heal = true
                    }
                }
            });
            return;//无 敌人 结束
            const s = room.find(FIND_STRUCTURES, {
                filter: function (s) {
                    return (s.structureType != 'rampart' && s.structureType != 'constructedWall' && s.hits < s.hitsMax) ||
                        (s.structureType === 'rampart' && s.hits < 100000) ||
                        (s.structureType === 'constructedWall' && s.hits < 100000);
                }
            });
            for (const tower of room.towers) {
                tower.repair(s.sort((a, b) => a.hits - b.hits)[0]);
            }
            return;//无 敌人 结束
        }

        creeps_hits = [];
        creeps.forEach(function (creep, index) {
            if (creep.hits < creep.hitsMax) {
                creeps_hits.push(creep);
            }
        })
        if (creeps_hits.length > 0) {
            const target = creeps_hits.sort((a, b) => a.hits - b.hits)[0];
            for (const tower of room.towers) {
                tower.attack(target);
            }
            return;//有残血敌人结束
        }
        if (Game.time % 10 === 0) {
            for (const tower of room.towers) {
                tower.attack(creeps[Math.round(Math.random() * creeps.length)]);
            }
        } else if (Game.time % 10 === 5) {
            const target = creeps[Math.round(Math.random() * creeps.length)];
            for (const tower of room.towers) {
                tower.attack(target);
            }
        }
    }
}
module.exports = defense;