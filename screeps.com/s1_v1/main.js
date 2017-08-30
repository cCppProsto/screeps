var s1  = require('s1_creep_proc');

module.exports.loop = function()
{ 
  //console.log(Game.cpu.getUsed());
  
  if(Game.spawns.s1)
    s1.processing();

    
  //Game.spawns.s1.memory.MaxUsedCPU = 0;
  //Game.spawns.s1.memory.AverageUsedCPU = 0;
  //Game.spawns.s1.memory.CommonUsedCPU = 0;
  //Game.spawns.s1.memory.TickCountUsedCPU = 0;
 
  var used = Game.cpu.getUsed();
  Game.spawns.s1.memory.CommonUsedCPU += used;
  Game.spawns.s1.memory.TickCountUsedCPU++;
  Game.spawns.s1.memory.AverageUsedCPU = Game.spawns.s1.memory.CommonUsedCPU / Game.spawns.s1.memory.TickCountUsedCPU;
  if( used > Game.spawns.s1.memory.MaxUsedCPU)
    Game.spawns.s1.memory.MaxUsedCPU = used;
  
  //console.log("max CPU used - " + Game.spawns.s1.memory.MaxUsedCPU + ", Avg = " + Game.spawns.s1.memory.AverageUsedCPU);
  return;
}
