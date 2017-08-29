var s1_tool           = require('s1_tool');
var harvester_role    = require('s1_role_harvester');
var rc_upgrader_role  = require('s1_role_rcl_upgrader');
var builder_role      = require('s1_role_builder');

// for debug messages
var iDM = false;
var eDM = true; 

const iDM_HEAD = "S1_CREEP_PROC[INFO] ";
const eDM_HEAD = "S1_CREEP_PROC[ERROR] ";

//------------------------------------------------------------------------------

const SPAWN_S1_ID = 1;
var COUNT_TICKS_FOR_ATTACK_CHECK = 10;

var harvester_max      = 6;
var rc_upgrader_max    = 4;
var builder_max        = 3;

module.exports =
{
  //--------------------------------------------------------------------------
  creeps_doing : function()
  {
    for(var i in Game.creeps)
    {
      if(Game.creeps[i].spawning == true)
        continue;

      if(Game.creeps[i].memory.spawn_id != SPAWN_S1_ID)
        continue;

      switch(Game.creeps[i].memory.role)
      {
        case Game.spawns.s1.memory.HarvesterRoleID:
        {
          //console.log("Harvester doing - " + Game.creeps[i].memory.role );
          harvester_role.doing(Game.creeps[i]);
          break;
        }
        case Game.spawns.s1.memory.BuilderRoleID:
        {
          builder_role.doing(Game.creeps[i]);
          break;
        }
        case Game.spawns.s1.memory.RclUpgraderRoleID:
        {
          rc_upgrader_role.doing(Game.creeps[i]);
          break;
        }
      }
    }
  },
  //--------------------------------------------------------------------------
  check_attack : function()
  {
    if(Game.spawns.s1.memory.attach_check >= COUNT_TICKS_FOR_ATTACK_CHECK)
    {
      Game.spawns.s1.memory.attach_check = 0;
      
      s1_tool.enemy_calculate();
      if(Game.spawns.s1.memory.enemies.length > 0)
        Game.spawns.s1.memory.isAttacked = true;
      else
        Game.spawns.s1.memory.isAttacked = false;
    }
    else
      Game.spawns.s1.memory.attach_check++
  },
  //--------------------------------------------------------------------------
  towers_doing : function()
  {
    if(Game.spawns.s1.memory.isAttacked == true)
    {
      for(var i in Game.spawns.s1.memory.struct_towers)
      {
        var tower = Game.getObjectById(Game.spawns.s1.memory.struct_towers[i]);
        var enemy = Game.getObjectById(Game.spawns.s1.memory.enemies[0]);
        
        if(tower.attack(enemy) != OK)
          this.check_attack();
      }
    }
    else
    {
      for(var i in Game.spawns.s1.memory.struct_towers)
      {
        var tower = Game.getObjectById(Game.spawns.s1.memory.struct_towers[i]);
        switch(i)
        {
          case '0':
          {
            var id = s1_tool.get_repair_road_id();
            if(id.length > 0)
              tower.repair(Game.getObjectById(id));
            break;
          }
          case '1':
          {
            break;
          }
        }
      }
    }
  },
  //--------------------------------------------------------------------------
  processing : function()
  {
    s1_tool.processing();
    
    this.check_attack();
    this.towers_doing();
    this.creeps_doing();
       
    //console.log(Game.spawns.s1.memory.harvester_count + " : " + harvester_max);
        
    if(Game.spawns.s1.memory.harvester_count < harvester_max)
      harvester_role.create();

    if(Game.spawns.s1.memory.rcl_upgrader_count < rc_upgrader_max)
      rc_upgrader_role.create();
      
    if(Game.spawns.s1.memory.builder_count < builder_max)
    {
      if(s1_tool.is_has_job_for_builder() == true)
        builder_role.create();
    }
  }
};
