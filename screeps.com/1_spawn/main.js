var s1  = require('s1_creep_proc');

// 16-08-2017 21:37 - 549899

module.exports.loop = function()
{
  if(Game.spawns.s1)
    s1.processing();
  return;
}
