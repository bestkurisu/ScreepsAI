module.exports = (flagName) => {
    return {
		prepare: creep => {
			if(!creep.pos.isEqualTo(Game.flags[flagName].pos)) creep.moveTo(Game.flags[flagName])
		},
		isReady: creep => {
			if(creep.getActiveBodyparts(WORK)<5){
				return true
			}
			else{
				if(creep.pos.isEqualTo(Game.flags[flagName].pos)) return true
			}
		},
		source: creep => {
			if(!Game.flags[flagName].memory.sourceID){
				var resource = creep.pos.findInRange(FIND_SOURCES,1)[0]
				if(!resource) resource = creep.pos.findInRange(FIND_MINERALS,1)[0]
				if(resource) Game.flags[flagName].memory.sourceID = resource.id
				else console.log(flagName+'是不是哪里出了什么问题？')
			}
			else{
				var resource = Game.getObjectById(Game.flags[flagName].memory.sourceID)
			}
			if(creep.harvest(resource)==ERR_NOT_IN_RANGE){
				creep.moveTo(resource)
			}
		},
		target: creep => {
			if(!creep.memory.dontPullMe) creep.memory.dontPullMe = true
			if(creep.getActiveBodyparts(WORK)<5){
				var container = Game.getObjectById(Game.flags[flagName].memory.container)
				if(container&&container.store.getFreeCapacity()>50) creep.goTransfer(container)
			}
			else{
				// 如果旗子没写矿id则找矿
				if(!Game.flags[flagName].memory.sourceID){
					let resource = creep.pos.findInRange(FIND_SOURCES,1)
					if(!resource) resource = creep.pos.findInRange(FIND_MINERALS,1)
					Game.flags[flagName].memory.sourceID = resource.id
				}
				else{
					var resource = Game.getObjectById(Game.flags[flagName].memory.sourceID)
				}
				// 判断是否要用link
				if(Game.flags[flagName].memory.useLink == undefined){
					var Link = creep.pos.findInRange(FIND_STRUCTURES,1,{
						filter: s => s.structureType == STRUCTURE_LINK
					})
					if(Link.length>0){
						Game.flags[flagName].memory.useLink = Link[0].id
					}
					else{
						Game.flags[flagName].memory.useLink = false
					}
				}
				// 如果不用link且没有container尝试建一个，并且每500tick检查一次
				if(Game.flags[flagName].memory.container == undefined && !Game.flags[flagName].memory.useLink){
					var structure = creep.room.lookForAt(LOOK_STRUCTURES,Game.flags[flagName].pos)
					// 如果找到了把id写入memory
					if(structure.length>0){
						for(s=0;s<structure.length;s++){
							if(structure[s].structureType == STRUCTURE_CONTAINER) Game.flags[flagName].memory.container = structure[s].id
						}
					}
					// 没找到就建
					else{
						Game.flags[flagName].memory.container = undefined
						let site = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES,Game.flags[flagName].pos)
						if(site.length == 0){
							Game.rooms[creep.pos.roomName].createConstructionSite(Game.flags[flagName].pos,STRUCTURE_CONTAINER)
						}
						else{
							creep.build(site[0])
						}
					}
				}
				// 如果不用link
				if(!Game.flags[flagName].memory.useLink){
					// 如果container已经修好
					let container = Game.getObjectById(Game.flags[flagName].memory.container)
					if(container){
						// 每隔200tick判断是否要修
						if(Game.time%200 == 0){
							if(container){
								if(container.hits < 200000) creep.memory.repairing = true
								else creep.memory.repairing = false
							}
							else{
								Game.flags[flagName].memory.container = undefined
							}
						}
						// 要修就修不修拉倒
						if(!creep.memory.repairing){
							if(resource.energy>0 && container.store.getFreeCapacity() > 50){
								creep.harvest(resource)
							}
						}
						else{
							creep.repair(container)
						}
					} 
					else{
						Game.flags[flagName].memory.container = undefined
					}
				}
				// 如果用link
				else{
					if(creep.store.getFreeCapacity() == 0){
						let Link = Game.getObjectById(Game.flags[flagName].memory.useLink)
						creep.transfer(Link,RESOURCE_ENERGY)
					}
					else{
						if(resource.energy>0){
							creep.harvest(resource)
						}
					}
				}
			}
		},
		switch: creep => creep.updateState(),
	}
}