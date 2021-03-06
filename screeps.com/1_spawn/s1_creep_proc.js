var builder_role           = require('s1_role_builder');
var harvester_role         = require('s1_role_harvester');
var mineral_harvester_role = require('s1_role_mineral_harvester');
var rcl_upgrader_role      = require('s1_role_rcl_upgrader');
var s1_tool                = require('s1_tool');
//------------------------------------------------------------------------------
var harvester_count    = 0;
var harvester_max      = 6;

var mineral_harvester_count = 0;
var mineral_harvester_max   = 1;

var rcl_upgrader_count = 0;
var rcl_upgrader_max   = 6;

var builder_count      = 0;
var builder_max        = 4;

var enemies = null;

const STATE =
{
  PEACE     : 0
 ,DEFFENCE  : 1
};

// GLOBAL VARIABLES
Game.spawns.s1.memory.attach_check  = 0;
Game.spawns.s1.memory.isAttacked    = false;
Game.spawns.s1.memory.state         = STATE.PEACE;

const CREEP_ROLE =
{
  HARVESTER         : 0
 ,RCL_UPGRADER      : 1
 ,BUILDER           : 2
 ,MINERAL_HARVESTER : 3
};

// for debug messages
var iDL = false; //("INFO: S1 creeps[" + builder.name + "]  ");
var eDL = true; //("ERROR: S1 creeps[" + builder.name + "]  state res = " + res);


module.exports =
{
  //--------------------------------------------------------------------------
  creeps_doing : function()
  {
    harvester_count    = 0;
    rcl_upgrader_count = 0;
    builder_count      = 0;
    mineral_harvester_count = 0;

    for(var i in Game.creeps)
    {
      if(s1_tool.is_owner_of_creep(i))
      {
        var cr = Game.creeps[i];
        switch(cr.memory.role)
        {
          case CREEP_ROLE.HARVESTER:
          {
            harvester_role.doing(cr);
            s1_tool.harvester_statistic_update(cr);
            ++harvester_count;
            break;
          }
          case CREEP_ROLE.RCL_UPGRADER:
          {
            rcl_upgrader_role.doing(cr);
            s1_tool.rcl_upgrader_statistic_update(cr);
            ++rcl_upgrader_count;
            break;
          }
          case CREEP_ROLE.BUILDER:
          {
            builder_role.doing(cr);
            s1_tool.builder_statistic_update(cr);
            ++builder_count;
            break;
          }
          case CREEP_ROLE.MINERAL_HARVESTER:
          {
            mineral_harvester_role.doing(cr);
            ++mineral_harvester_count;
            break;
          }
        }
      }
    }

    //if(iDL == true) s1_tool.statistic_print();
    if(iDL == true) s1_tool.statistic_common_print();

    s1_tool.statistic_update();

    if(mineral_harvester_count < mineral_harvester_max)
    {
      var extractorID = s1_tool.get_extractor_id();
      if(extractorID.length > 0)
      {
        if(Game.spawns.s1.memory.mineralMineID.length > 0)
        {
          var mineral_obj = Game.getObjectById(Game.spawns.s1.memory.mineralMineID);
          if(mineral_obj.mineralAmount > 0)
          {
            mineral_harvester_role.create();
            return;
          }
        }
      }
      //harvester_role.create();
    }
    if(harvester_count < harvester_max)
    {
      harvester_role.create();
      return;
    }
    if(rcl_upgrader_count < rcl_upgrader_max)
    {
      rcl_upgrader_role.create();
      return;
    }
    if(builder_count < builder_max)
    {
      var res;

      res = s1_tool.get_build_object_id();
      if(res.length > 0)
      {
        builder_role.create();
        return;
      }

      res = s1_tool.get_repair_object_id_for_builder();
      if(res.length > 0)
      {
        //console.log(res);
        builder_role.create();
        return;
      }
      return;
    }
  },
  //--------------------------------------------------------------------------
  creeps_moving_to_safe_place : function()
  {
    var towers = s1_tool.get_towers();
    var tower = null;
    if(towers.length > 0)
      tower = Game.getObjectById(towers[0]) ;

    for(var i in Game.creeps)
    {
      if(s1_tool.is_owner_of_creep(i))
      {
        var cr = Game.creeps[i];
        if(tower != null)
          cr.moveTo(tower);
        else
          cr.moveTo(Game.spawns.s1);
      }
    }
  },
  //--------------------------------------------------------------------------
  tower_peace_processing: function()
  {
    var towers = s1_tool.get_towers();
    for(var i in towers)
    {
      var tower = Game.getObjectById(towers[i]);
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
          var id = s1_tool.get_repair_container_id();
          if(id.length > 0)
            tower.repair(Game.getObjectById(id));
          //console.log("Tower[" + i + "] - " + tower.id);
          break;
        }
      }
    }
  },
  //--------------------------------------------------------------------------
  tower_deffence_processing: function()
  {
    var towers = s1_tool.get_towers();
    enemies = s1_tool.get_enemies();
    for(var i in towers)
    {
      var tower = Game.getObjectById(towers[i]) ;
      if(enemies == null)
      {
        Game.spawns.s1.memory.isAttacked = false;
        return;
      }

      if(tower.attack(enemies[0]) != OK)
        Game.spawns.s1.memory.isAttacked = false;
    }
  },
  //--------------------------------------------------------------------------
  check_attack: function()
  {
    if(Game.spawns.s1.memory.isAttacked == false)
    {
      enemies = s1_tool.get_enemies();
      if(enemies != null) // ATTACKED!!
      {
        console.log("Attacked!");
        Game.spawns.s1.memory.isAttacked = true;
      }
    }
  },
  //--------------------------------------------------------------------------
  processing : function()
  {
    s1_tool.recalculate_objects();

    switch(Game.spawns.s1.memory.state)
    {
      case STATE.PEACE:
      {
        this.creeps_doing();
        this.check_attack();
        this.tower_peace_processing();

        if(Game.spawns.s1.memory.isAttacked == true)
          Game.spawns.s1.memory.state = STATE.DEFFENCE;

        break;
      }
      case STATE.DEFFENCE:
      {
        this.creeps_moving_to_safe_place();
        this.tower_deffence_processing();
        if(Game.spawns.s1.memory.isAttacked == false)
          Game.spawns.s1.memory.state = STATE.PEACE;
        break;
      }
    }
  }
};
