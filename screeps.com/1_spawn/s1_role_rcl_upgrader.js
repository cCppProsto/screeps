var s1_tool    = require('s1_tool');

/* CREEP BODY
MOVE            50
WORK            100
CARRY           50
ATTACK          80
RANGED_ATTACK   150
HEAL            250
CLAIM           600
TOUGH           10
*/
const SPAWN1_ID = 1;
const CREEP_ROLE =
{
    HARVESTER     : 0
   ,RCL_UPGRADER  : 1
   ,BUILDER       : 2
   ,MINERAL_HARVESTER : 3
};

const STATE =
{
  FIND_RESOURCE : 0
 ,TO_HARVEST    : 1
 ,HARVEST       : 2
 ,TO_UPGRADE    : 3
 ,UPGRADE       : 4
 ,TO_WAIT       : 5
 ,WAIT          : 6
};

const rcl_upgrader_300_body = [MOVE, WORK, CARRY, CARRY, CARRY];
const rcl_upgrader_500_body = [MOVE, MOVE, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
const rcl_upgrader_700_body = [MOVE, MOVE, MOVE,  MOVE, MOVE,  WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   rcl_upgrader_body     = [];

// for debug messages
var iDL = false; //("INFO: Upgrader[" + upgrader.name + "]  ");
var eDL = true; //("ERROR: Upgrader[" + upgrader.name + "]  state res = " + res);

//------------------------------------------------------------------------------
module.exports =
{
  body_calc : function()
  {
    s1_tool.calc_energy();

    rcl_upgrader_body = [];
    if(s1_tool.get_energy() >= 700)
    {
      rcl_upgrader_body   = rcl_upgrader_700_body;
      return;
    }
    if(s1_tool.get_energy() >= 500)
    {
      rcl_upgrader_body   = rcl_upgrader_500_body;
      return;
    }
    if(s1_tool.get_energy() >= 300)
    {
      rcl_upgrader_body   = rcl_upgrader_300_body;
      return;
    }
  },
  //------------------------------------------------------------------------------
  create : function()
  {
    if(Game.spawns.s1.spawning)
      return;

    this.body_calc();

    if(rcl_upgrader_body.length > 0)
    {
      Game.spawns.s1.createCreep(rcl_upgrader_body, null,
                                      { role       : CREEP_ROLE.RCL_UPGRADER
                                       ,state      : STATE.FIND_RESOURCE
                                       ,targetID   : null
                                       ,resourceID : null
                                       ,spawnID    : SPAWN1_ID
                                      });
    }
  },
  //----------------------------------------------------------------------------
  upgrader_move_to : function(upgrader, target)
  {
    if(upgrader.fatigue == 0)
      upgrader.moveTo(target, {reusePath: 30});
  },
  //------------------------------------------------------------------------------
  upgrader_move_to_by_xy : function(upgrader, x, y)
  {
    if(upgrader.fatigue == 0)
      upgrader.moveTo(x, y, {reusePath: 30});
  },
  //----------------------------------------------------------------------------
  doing : function(upgrader)
  {
    if(upgrader.spawning)
      return;

    var m = upgrader.memory;
    switch(m.state)
    {
      case STATE.FIND_RESOURCE:
      {
        m.resourceID = s1_tool.get_source_id();

        if(iDL == true) console.log("INFO: Upgrader[" + upgrader.name + "] found resource id(" + m.resourceID + ")");

        if(upgrader.pos.inRangeTo(Game.getObjectById(m.resourceID), 1))
          m.state = STATE.HARVEST;
        else
          m.state = STATE.TO_HARVEST;
        break;
      }
      case STATE.TO_HARVEST:
      {
        var source_obj = Game.getObjectById(m.resourceID);

        if(s1_tool.get_res_busy_by_id(m.resourceID) >= s1_tool.get_max_count_on_res_by_id(m.resourceID))
        {
          if(iDL == true) console.log("INFO: Upgrader[" + upgrader.name + "] Resource " + m.resourceID + " is busy! " +" move to wait");
          m.state = STATE.TO_WAIT;
          break;
        }

        if(upgrader.pos.inRangeTo(source_obj, 1))
          m.state = STATE.HARVEST;
        else
          this.upgrader_move_to(upgrader, source_obj);
        break;
      }
      case STATE.HARVEST:
      {
        var total = _.sum(upgrader.carry);
        if(total < upgrader.carryCapacity)
        {
          var res = upgrader.harvest(Game.getObjectById(m.resourceID));
          if(res != OK)
            m.state = STATE.FIND_RESOURCE;

          break;
        }
        m.state = STATE.TO_UPGRADE;
        break;
      }
      case STATE.TO_UPGRADE:
      {
        if(upgrader.pos.inRangeTo(Game.spawns.s1.room.controller, 3))
        {
          m.state = STATE.UPGRADE;
          break;
        }
        else
          this.upgrader_move_to(upgrader, Game.spawns.s1.room.controller);
        break;
      }
      case STATE.UPGRADE:
      {
        var res = upgrader.upgradeController(Game.spawns.s1.room.controller);
        if(res != OK)
        {
          m.state  = STATE.FIND_RESOURCE;
          break;
        }
        break;
      }
      case STATE.TO_WAIT:
      {
        var pos = s1_tool.get_wait_point_pos_by_id(m.resourceID);
        if(upgrader.pos.inRangeTo(pos[0], pos[1], 2))
            m.state = STATE.WAIT;
        else
          this.upgrader_move_to_by_xy(upgrader, pos[0], pos[1]);
        break;
      }
      case STATE.WAIT:
      {
        if(s1_tool.get_res_busy_by_id(m.resourceID) < s1_tool.get_max_count_on_res_by_id(m.resourceID))
        {
          if(iDL == true) console.log("INFO: Upgrader[" + upgrader.name +"] from WAIT to HARVEST");
          m.state = STATE.TO_HARVEST;
          break;
        }
        //if(iDL == true) console.log("INFO: Builder[" + builder.name +"] waiting... ");
        break;
      }
    }
  }
};
