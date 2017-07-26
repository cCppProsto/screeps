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

//-----------------------------  HARVESTER  ------------------------------------
const HARVESTER_STATE =
{
    CREATE            : 0
   ,RECALCULATE       : 1
   ,TO_HARVEST        : 2
   ,HARVEST           : 3
   ,TRANSFER_OBJ_CALC : 4
   ,TRANCFERING       : 5
   ,TRANSFER          : 6
   ,RECALC_DOING      : 7
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
                                               ,state      : HARVESTER_STATE.CREATE
                                               ,targetID   : null
                                               ,resourceID : null
                                               ,spawnID    : SPAWN1_ID
                                              });
        }
    },
    //------------------------------------------------------------------------------
    doing : function(obj)
    {
        if(obj.spawning)
            return;

        var mem = obj.memory;

        switch(mem.state)
        {
            case HARVESTER_STATE.CREATE:
            {
                if(mem.resourceID == null)
                {
                    mem.resourceID = s1_tool.get_source_id();

                    if(obj.pos.inRangeTo(Game.getObjectById(mem.resourceID), 1))
                        mem.state  = HARVESTER_STATE.HARVEST;
                    else
                        mem.state  = HARVESTER_STATE.TO_HARVEST;
                    break;
                }
                break;
            }
            case HARVESTER_STATE.RECALCULATE:
            {
                var total = _.sum(obj.carry);
                if(total == 0)
                {
                    mem.state    = HARVESTER_STATE.TO_HARVEST;
                    break;
                }

                mem.state = HARVESTER_STATE.TRANSFER_OBJ_CALC
                break;
            }
            case HARVESTER_STATE.TO_HARVEST:
            {
                var source_obj = Game.getObjectById(mem.resourceID);

                if(obj.pos.inRangeTo(source_obj, 1))
                    mem.state = HARVESTER_STATE.HARVEST;
                else
                    obj.moveTo(source_obj);
                break;
            }
            case HARVESTER_STATE.HARVEST:
            {
                var total = _.sum(obj.carry);

                if(total < obj.carryCapacity)
                {
                    var res = obj.harvest(Game.getObjectById(mem.resourceID));

                    if(res != OK)
                        console.log("harvest result = " + res);
                    break;
                }
                mem.state = HARVESTER_STATE.TRANSFER_OBJ_CALC;
                break;
            }
            case HARVESTER_STATE.TRANSFER_OBJ_CALC:
            {
                if(Game.spawns.s1.energy < Game.spawns.s1.energyCapacity)
                {
                    mem.targetID = Game.spawns.s1.id;
                    mem.state    = HARVESTER_STATE.TRANCFERING;
                    break;
                }

                var res;
                res = s1_tool.get_towers();
                if(res.length > 0)
                {
                    for(var i in res)
                    {
                        if(res[i].energy < res[i].energyCapacity)
                        {
                            mem.targetID = res[0].id;
                            mem.state    = HARVESTER_STATE.TRANCFERING;
                            break;
                        }
                    }
                    break;
                }

                res = s1_tool.get_stores_for_trancfer();
                if(res.length > 0)
                {
                    mem.targetID = res[0].id;
                    mem.state    = HARVESTER_STATE.TRANCFERING;
                    break;
                }

                mem.targetID = null;
                break;
            }
            case HARVESTER_STATE.TRANCFERING:
            {
                var target = Game.getObjectById(mem.targetID);

                if(!target)
                {
                    mem.state = HARVESTER_STATE.TRANSFER_OBJ_CALC;
                    break;
                }

                if(obj.pos.inRangeTo(target, 1))
                    mem.state = HARVESTER_STATE.TRANSFER;
                else
                    obj.moveTo(target);
                break;
            }
            case HARVESTER_STATE.TRANSFER:
            {
                var target = Game.getObjectById(mem.targetID);
                var res = obj.transfer(target, RESOURCE_ENERGY);
                if(res == OK)
                {
                    mem.state = HARVESTER_STATE.RECALCULATE;
                    break;
                }

                if(res == ERR_FULL)
                {
                    mem.state = HARVESTER_STATE.TRANSFER_OBJ_CALC;
                    break;
                }
                mem.state = HARVESTER_STATE.RECALCULATE;
                console.log(res)
                break;
            }
        }
    }
};
