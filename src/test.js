let c=Game.creeps['killer']
if(c.store.getFreeCapacity('energy')>0){
    if(c.withdraw(Game.getObjectById('610b776ce37c03add79990af'),'energy')===ERR_NOT_IN_RANGE){
        c.moveTo(Game.getObjectById('610b776ce37c03add79990af'))
    }
}
else{
    if(c.transfer(Game.getObjectById('6143bf72db926768371447b0'),'energy')===ERR_NOT_IN_RANGE){
        c.moveTo(Game.getObjectById('6143bf72db926768371447b0'))
    }
}
