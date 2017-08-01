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

/*
  FIND_RESOURCE:  finding resources in any storage
  TO_ENERGY:      moving to resource storage
  TAKE_ENERGY:    take resource
  FIND_REPAIR:    finding structure for repair
  TO_REPAIR:      moving to repairing of a structure
  REPAIR:         repair the structure
  FIND_BUILD:     finding structure for build
  TO_BUILD:       moving to building of a structure
  BUILD:          build the structure
  RECALCULATE:    calculating of actions
*/
const STATE =
{
    FIND_RESOURCE  : 0
   ,TO_ENERGY      : 1
   ,TAKE_ENERGY    : 2
   ,FIND_REPAIR    : 3
   ,TO_REPAIR      : 4
   ,REPAIR         : 5
   ,FIND_BUILD     : 6
   ,TO_BUILD       : 7
   ,BUILD          : 8
   ,RECALCULATE    : 9
   ,FIND_FARM      : 10
   ,TO_HARVEST     : 11
   ,HARVEST        : 12
};

const builder_300_body = [MOVE, WORK, CARRY, CARRY, CARRY];
const builder_500_body = [MOVE, MOVE, WORK,  WORK, CARRY, CARRY, CARRY, CARRY];
const builder_700_body = [MOVE, MOVE, MOVE,  MOVE, MOVE,  WORK,  WORK, CARRY, CARRY, CARRY, CARRY, CARRY];
var   builder_body     = [];

//------------------------------------------------------------------------------
module.exports =
{
    body_calc : function()
    {
        s1_tool.calc_energy();

        builder_body = [];
        if(s1_tool.get_energy() >= 700)
        {
            builder_body   = builder_700_body;
            return;
        }
        if(s1_tool.get_energy() >= 500)
        {
            builder_body   = builder_500_body;
            return;
        }
        if(s1_tool.get_energy() >= 300)
        {
            builder_body   = builder_300_body;
            return;
        }
    },
    //------------------------------------------------------------------------------
    create : function()
    {
        if(Game.spawns.s1.spawning)
            return;

        this.body_calc();

        if(builder_body.length > 0)
        {
            Game.spawns.s1.createCreep(builder_body,
                                       null,
                                      { role       : CREEP_ROLE.BUILDER
                                       ,state      : STATE.FIND_RESOURCE
                                       ,targetID   : null
                                       ,resourceID : null
                                       ,spawnID    : SPAWN1_ID
                                      });
        }
    },
    //------------------------------------------------------------------------------
    doing : function(builder)
    {
      if(builder.spawning)
          return;

      var m = builder.memory;
      //console.log(m.state + " " + builder.name);

      switch(m.state)
      {
        case STATE.FIND_RESOURCE:
        {
          var storeID;

          storeID = s1_tool.get_store_with_max_energy();

          if(storeID.length > 0)
          {
              m.targetID = storeID;
              m.state    = STATE.TO_ENERGY;
              break;
          }
          else
              m.state = STATE.FIND_FARM;
          break;
        }
        case STATE.TO_ENERGY:
        {
          var energy_obj = Game.getObjectById(m.targetID);

          if(builder.pos.inRangeTo(energy_obj, 1))
              m.state = STATE.TAKE_ENERGY;
          else
              builder.moveTo(energy_obj);
          break;
        }
        case STATE.TAKE_ENERGY:
        {
          var energy_obj = Game.getObjectById(m.targetID);
          var res        = builder.withdraw(energy_obj, RESOURCE_ENERGY);

          if(res == ERR_NOT_ENOUGH_RESOURCES)
          {
              m.state  = STATE.FIND_RESOURCE;
              break;
          }

          if(res == ERR_FULL)
          {
            m.state  = STATE.FIND_BUILD;
            break;
          }

          if(res != OK)
          {
            console.log("Builder(" + builder.name + "):[TAKE_ENERGY] error - " + res);
            m.state  = STATE.FIND_BUILD;
          }
          break;
        }
        case STATE.FIND_REPAIR:
        {
          var repair_obj_id = s1_tool.get_repair_object_id_for_builder();
          if(repair_obj_id.length > 0)
          {
              m.targetID = repair_obj_id;
              m.state    = STATE.TO_REPAIR;
              break;
          }
          else
            m.state = STATE.RECALCULATE;
          break;
        }
        case STATE.TO_REPAIR:
        {
          var repair_obj = Game.getObjectById(m.targetID);
          if(repair_obj)
          {
              if(builder.pos.inRangeTo(repair_obj, 3))
                  m.state = STATE.REPAIR;
              else
                  builder.moveTo(repair_obj);
          }
          else
          {
              console.log("S1-BUILDER-STATE.TO_REPAIR - Error!")
              m.state = STATE.RECALCULATE;
          }
          break;
        }
        case STATE.REPAIR:
        {
          var res = builder.repair(Game.getObjectById(m.targetID));

          if(res == ERR_NOT_ENOUGH_RESOURCES)
          {
            m.state = STATE.FIND_RESOURCE;
            break;
          }

          if(res != OK)
          {
            console.log("Builder(" + builder.name + "):[REPAIR] error - " + res);
            m.state = STATE.RECALCULATE;
          }
          break;
        }
        case STATE.FIND_BUILD:
        {
          var res = s1_tool.get_build_object_id();
          if(res.length > 0)
          {
              m.targetID = res;
              m.state    = STATE.TO_BUILD;
              break;
          }
          m.state = STATE.FIND_REPAIR;
          break;
        }
        case STATE.TO_BUILD:
        {
          var build_obj = Game.getObjectById(m.targetID);
          if(build_obj)
          {
              if(builder.pos.inRangeTo(build_obj, 3))
                  m.state = STATE.BUILD;
              else
                  builder.moveTo(build_obj);
          }
          else
          {
            m.state = STATE.FIND_BUILD;
          }
          break;
        }
        case STATE.BUILD:
        {
          var res = builder.build(Game.getObjectById(m.targetID));

          if(res == ERR_NOT_ENOUGH_RESOURCES)
          {
            m.state = STATE.FIND_RESOURCE;
            break;
          }
          if(res == ERR_INVALID_TARGET) // build is done
          {
            m.state = STATE.FIND_BUILD;
            console.log("Build is done!");
            s1_tool.recalculate_objects();
            break;
          }

          if(res != OK)
          {
              m.state = STATE.RECALCULATE;
              console.log("Builder(" + builder.name + "):[BUILD] error - " + res);
          }
          break;
        }
        case STATE.RECALCULATE:
        {
          m.state = STATE.FIND_RESOURCE;
          break;
        }
        case STATE.FIND_FARM:
        {
          m.resourceID = s1_tool.get_source_id();

          if(builder.pos.inRangeTo(Game.getObjectById(m.resourceID), 1))
              m.state  = STATE.HARVEST;
          else
              m.state  = STATE.TO_HARVEST;
          break;
        }
        case STATE.TO_HARVEST:
        {
          var source_obj = Game.getObjectById(m.resourceID);

          if(builder.pos.inRangeTo(source_obj, 1))
              m.state = STATE.HARVEST;
          else
              builder.moveTo(source_obj);
          break;
        }
        case STATE.HARVEST:
        {
          var total = _.sum(builder.carry);

          if(total < builder.carryCapacity)
          {
              var res = builder.harvest(Game.getObjectById(m.resourceID));
              if(res != OK)
              {
                console.log("Builder(" + builder.name + "):[HARVEST] error - " + res);
                m.state = STATE.RECALCULATE;
              }
          }
          else
            m.state = STATE.RECALCULATE;
          break;
        }
      }
    }
};
