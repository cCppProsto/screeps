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
  FIND_MINERALS      : 0
 ,TO_HARVEST         : 1
 ,HARVEST            : 2
 ,TRANSFER_CALCULATE : 3
 ,TRANCFERING        : 4
};

const harvester_550_body  = [MOVE, WORK, WORK,  WORK, WORK, CARRY, CARRY];
const harvester_750_body  = [MOVE, WORK, WORK, WORK,  WORK, WORK, WORK, CARRY, CARRY ];
const harvester_1050_body = [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
var   harvester_body      = [];

//------------------------------------------------------------------------------
module.exports =
{
  body_calc : function()
  {
      s1_tool.calc_energy();

      harvester_body     = [];
      if(s1_tool.get_energy() >= 1050)
      {
        harvester_body   = harvester_1050_body;
        return;
      }
      if(s1_tool.get_energy() >= 750)
      {
        harvester_body   = harvester_750_body;
        return;
      }
      if(s1_tool.get_energy() >= 550)
      {
        harvester_body   = harvester_550_body;
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
                                        { role       : CREEP_ROLE.MINERAL_HARVESTER
                                         ,state      : STATE.FIND_MINERALS
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
      case STATE.FIND_MINERALS:
      {
        m.resourceID = Game.spawns.s1.memory.mineralMineID;//s1_tool.get_source_id();

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
            m.state = STATE.FIND_MINERALS;
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
        var storage_id;
        storage_id = s1_tool.get_storage_id();
        if(storage_id.length > 0)
        {
          m.targetID = storage_id;
          m.state    = STATE.TRANCFERING;
          break;
        }

        console.log("Mineral Harvester(" + harvester.name + "):[TRANSFER_CALCULATE] error");
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
          var res;
          for(const resourceType in harvester.carry)
            res = harvester.transfer(target, resourceType);

          if(res == OK)
          {
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

          console.log("Mineral Harvester(" + harvester.name + "):[TRANCFERING] error - " + res);
          break;
        }
        else
         this.harvester_move_to(harvester, target);
        break;
      }
    }
  }
};
