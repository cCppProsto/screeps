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
};

const STATE =
{
  FIND_RESOURCE      : 0
 ,TO_HARVEST         : 1
 ,HARVEST            : 2
 ,TRANSFER_CALCULATE : 3
 ,TRANCFERING        : 4
};

const harvester_300_body = [MOVE, WORK, WORK,  CARRY];
const harvester_500_body = [MOVE, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY];
const harvester_700_body = [MOVE, MOVE, MOVE, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   harvester_body     = [];

//------------------------------------------------------------------------------
module.exports =
{
  body_calc : function()
  {
      s1_tool.calc_energy();

      harvester_body     = [];
      if(s1_tool.get_energy() >= 700)
      {
        harvester_body   = harvester_700_body;
        return;
      }
      if(s1_tool.get_energy() >= 500)
      {
        harvester_body   = harvester_500_body;
        return;
      }
      if(s1_tool.get_energy() >= 300)
      {
        harvester_body   = harvester_300_body;
        return;
      }
  },
  //------------------------------------------------------------------------------
  create : function()
  {
    if(Game.spawns.s1.spawning)
      return;

    this.body_calc();

    if(harvester_body.length > 0)
    {
      Game.spawns.s1.createCreep(harvester_body, null,
                                        { role       : CREEP_ROLE.HARVESTER
                                         ,state      : STATE.FIND_RESOURCE
                                         ,targetID   : null
                                         ,resourceID : null
                                         ,spawnID    : SPAWN1_ID
                                        });
    }
  },
  //------------------------------------------------------------------------------
  harvester_move_to : function(harvester, target)
  {
    if(harvester.fatigue == 0)
      harvester.moveTo(target, {reusePath: 30});
  },
  //------------------------------------------------------------------------------
  doing : function(harvester)
  {
    if(harvester.spawning)
        return;

    var m = harvester.memory;
    //console.log(m.state + " " + harvester.name);

    switch(m.state)
    {
      case STATE.FIND_RESOURCE:
      {
        m.resourceID = s1_tool.get_source_id();

        if(harvester.pos.inRangeTo(Game.getObjectById(m.resourceID), 1))
            m.state  = STATE.HARVEST;
        else
            m.state  = STATE.TO_HARVEST;
        break;
      }
      case STATE.TO_HARVEST:
      {
        var source_obj = Game.getObjectById(m.resourceID);

        if(harvester.pos.inRangeTo(source_obj, 1))
            m.state = STATE.HARVEST;
        else
          this.harvester_move_to(harvester, source_obj);
        break;
      }
      case STATE.HARVEST:
      {
        var total = _.sum(harvester.carry);

        if(total < harvester.carryCapacity)
        {
          var res = harvester.harvest(Game.getObjectById(m.resourceID));

          if(res == ERR_NOT_ENOUGH_RESOURCES)
          {
            //console.log("Harvester(" + harvester.name + "):[HARVEST] error - " + res);
            break;
          }
          if(res != OK)
          {
            m.state = STATE.FIND_RESOURCE;
            //console.log("Harvester(" + harvester.name + "):[HARVEST] error - " + res);
            break;
          }
        }
        else
          m.state = STATE.TRANSFER_CALCULATE;
        break;
      }
      case STATE.TRANSFER_CALCULATE:
      {
        var tower_id;
        tower_id = s1_tool.get_tower_id_with_not_full_energy();
        if(tower_id.length > 0)
        {
          m.targetID = tower_id;
          m.state    = STATE.TRANCFERING;
          break;
        }

        if(Game.spawns.s1.energy < Game.spawns.s1.energyCapacity)
        {
          m.targetID = Game.spawns.s1.id;
          m.state    = STATE.TRANCFERING;
          break;
        }

        var store_id = "";
        store_id = s1_tool.get_store_id_for_trancfer_for_harvester();
        if(store_id.length > 0)
        {
          m.targetID = store_id;
          m.state    = STATE.TRANCFERING;
          break;
        }

        console.log("Harvester(" + harvester.name + "):[TRANSFER_CALCULATE] error");
        m.targetID = null;
        break;
      }
      case STATE.TRANCFERING:
      {
        var target = Game.getObjectById(m.targetID);

        if(!target)
        {
          m.state = STATE.TO_HARVEST;
          break;
        }

        if(harvester.pos.inRangeTo(target, 1))
        {
          var res = harvester.transfer(target, RESOURCE_ENERGY);

          if(res == OK)
          {
            var total = _.sum(harvester.carry);
            if(total > 50)
            {
              m.state = STATE.TRANSFER_CALCULATE;
              break;
            }

            m.state = STATE.TO_HARVEST;
            break;
          }

          if(res == ERR_FULL)
          {
            m.state = STATE.TRANSFER_CALCULATE;
            break;
          }

          if(res == ERR_NOT_ENOUGH_RESOURCES)
          {
            m.state = STATE.TO_HARVEST;
            break;
          }

          console.log("Harvester(" + harvester.name + "):[TRANCFERING] error - " + res);
          break;
        }
        else
         this.harvester_move_to(harvester, target);
        break;
      }
    }
  }
};
