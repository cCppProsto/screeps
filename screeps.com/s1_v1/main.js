var s1  = require('s1_creep_proc');

module.exports.loop = function()
{ 
  //var en_0 = Game.getObjectById(Game.spawns.s1.memory.energyID_0);
  //var en_1 = Game.getObjectById(Game.spawns.s1.memory.energyID_1);
  //console.log(en_0.energy + " : " + en_1.energy);
  
  if(Game.spawns.s1)
    s1.processing();
  return;
}
