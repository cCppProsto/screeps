var s1      = require('s1_creep_proc');
var s1_tool = require('s1_tool');

var enemy_targets = [];


module.exports.loop = function()
{
    s1.processing();

    //s1_tool.calc_energy();
    //console.log(s1_tool.get_energy_capacity());

    //Game.spawns.s1.memory.isAttack = 1;

/*

    if(!Game.spawns.s1.memory.isAttack)
    {
        if(!Game.spawns.s1.memory.attackCheck)
            Game.spawns.s1.memory.attackCheck = 0;

        if(Game.spawns.s1.memory.attackCheck == 0)
        {
            Game.spawns.s1.memory.tower = [];

            //Game.spawns.s1.memory.tower = null;
            if(!Game.spawns.s1.memory.tower)
            {
                Game.spawns.s1.memory.tower = [];

                var res = Game.spawns.s1.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_TOWER }});

                for(var i in res)
                    Game.spawns.s1.memory.tower.push(res[i].id);

                console.log(Game.spawns.s1.memory.tower.length);
            }

            enemy_targets = Game.spawns.s1.room.find(FIND_HOSTILE_CREEPS);
            if(enemy_targets.length > 0)
                Game.spawns.s1.memory.isAttack = true;
        }
        ++Game.spawns.s1.memory.attackCheck;
            if(Game.spawns.s1.memory.attackCheck >= 7)
                Game.spawns.s1.memory.attackCheck = 0;
    }

    if(Game.spawns.s1.memory.isAttack)
    {
        console.log(12);
        enemy_targets = Game.spawns.s1.room.find(FIND_HOSTILE_CREEPS);
        if(enemy_targets.length == 0)
        {
            Game.spawns.s1.memory.isAttack = false;
            return;
        }

        for(var i in Game.spawns.s1.memory.tower)
        {
            var tower = Game.getObjectById(Game.spawns.s1.memory.tower[i]) ;
            //console.log(Game.spawns.s1.memory.tower[i])
            tower.attack(enemy_targets[0]);
        }
    }
    */
    return;

    //var elapsed = Game.cpu.getUsed() - startCpu;
    //console.log('used '+elapsed+' CPU time' + ', GCL = ' + Game.gcl.level);
}
