/*          
CREEP BODY
    MOVE            50
    WORK            100
    CARRY           50
    ATTACK          80
    RANGED_ATTACK   150
    HEAL            250
    CLAIM           600
    TOUGH           10
*/

//------------------------------------------------------------------------------

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

var harvester_count    = 0;
var harvester_max      = 0;  // !! DEPENDS ON COUNT OF SOURCES IN SPAWN ROOM: 1 source = 3 max, 2 source = 6 max, etc.
var harvester_on_src   = 3;
//------------------------------------------------------------------------------

//-----------------------------  RCL_UPGRADER  ---------------------------------
const RCL_UPGRADER_STATE = 
{
    CREATE            : 0
   ,RECALCULATE       : 1
   ,TO_HARVEST        : 2
   ,HARVEST           : 3
   ,TO_ENERGY         : 4
   ,GET_ENERGY        : 5
   ,TO_UPGRADE        : 6
   ,UPGRADE           : 7
};

const rcl_upgrader_300_body = [MOVE, WORK, CARRY, CARRY, CARRY];
const rcl_upgrader_500_body = [MOVE, MOVE, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
const rcl_upgrader_700_body = [MOVE, MOVE, MOVE,  MOVE, MOVE,  WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   rcl_upgrader_body     = [];

var rcl_upgrader_count    = 0;
var rcl_upgrader_max      = 0;  // !! DEPENDS ON COUNT OF SOURCES IN SPAWN ROOM: 1 source = 3 max, 2 source = 6 max, etc.
var rcl_upgrader_on_src   = 3;
//------------------------------------------------------------------------------

//-----------------------------   BUILDER  -------------------------------------
const BUILDER_STATE = 
{
    CREATE             : 0
   ,TO_HARVEST         : 1
   ,HARVEST            : 2
   ,TO_ENERGY          : 3
   ,TAKE_ENERGY        : 4
   ,TO_BUILD           : 5
   ,BUILD              : 6
   ,TO_REPAIR          : 7
   ,REPAIR             : 8
   ,DOING_CALCULATE    : 9
   ,FIND_OBJ_FOR_BUILD : 10
   ,FIND_OBJ_FOR_REPAIR: 11
};

const builder_300_body = [MOVE, WORK, CARRY, CARRY, CARRY];
const builder_500_body = [MOVE, MOVE, WORK,  WORK, CARRY, CARRY, CARRY, CARRY];
const builder_700_body = [MOVE, MOVE, MOVE,  MOVE, MOVE,  WORK,  WORK, CARRY, CARRY, CARRY, CARRY, CARRY];
var   builder_body     = [];

var builder_count    = 0;
var builder_max      = 4;  
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
var s1                 = null;
var s1_sources         = [];
var s1_energy_capacity = 0;
var s1_energy          = 0;
//------------------------------------------------------------------------------

var s1tool = 
{
    //--------------------------------------------------------------------------
    get_repair_objects: function()
    {
        var res;
        res = s1.room.find(FIND_STRUCTURES, { filter :  
                            function(obj) 
                            { 
                                if(obj.structureType == STRUCTURE_CONTAINER)
                                    return obj.hits < (obj.hitsMax / 2);
                                return false;
                            }});

        if(res.length == 0)
        {
            res = s1.room.find(FIND_STRUCTURES, { filter :  
                                function(obj) 
                                { 
                                    if(obj.structureType == STRUCTURE_WALL)
                                        return obj.hits < (obj.hitsMax / 2);
                                    return false;
                                }});
        }
        return res;
    },
    //--------------------------------------------------------------------------
    get_build_objects : function()
    {
        return res = s1.room.find(FIND_CONSTRUCTION_SITES);
    },
    //--------------------------------------------------------------------------
    get_build_objects : function()
    {
        return s1.room.find(FIND_CONSTRUCTION_SITES);
    },
    //--------------------------------------------------------------------------
    get_stores_with_count_energy : function(energyCount)
    {
        var res;
        res = s1.room.find(FIND_STRUCTURES, { filter: 
                             function(obj)
                             { 
                                 if(obj.structureType == STRUCTURE_CONTAINER ||
                                    obj.structureType == STRUCTURE_STORAGE)
                                     return obj.store[RESOURCE_ENERGY] > energyCount;
                                 return false;
                             }});
        return res;
    },
    //--------------------------------------------------------------------------
    get_stores_for_trancfer : function()
    {
        var res;
        res = s1.room.find(FIND_STRUCTURES, { filter: 
                            function(obj)
                            { 
                                if(obj.structureType == STRUCTURE_EXTENSION)
                                    return obj.energy < obj.energyCapacity;
                                return false;
                            }});
                            
        if(res == false)
        {
            res = s1.room.find(FIND_STRUCTURES, { filter: 
                                 function(obj)
                                 { 
                                     if(obj.structureType == STRUCTURE_CONTAINER ||
                                        obj.structureType == STRUCTURE_STORAGE)
                                         return obj.store[RESOURCE_ENERGY] < obj.storeCapacity;
                                     return false;
                                 }});
        }
        return res;
    },
    //--------------------------------------------------------------------------
    get_not_empty_stores : function()
    {
        var res;
        res = s1.room.find(FIND_STRUCTURES, { filter :  
                            function(obj) 
                            { 
                                if(obj.structureType == STRUCTURE_STORAGE || 
                                   obj.structureType == STRUCTURE_CONTAINER)
                                    return obj.store[RESOURCE_ENERGY] > 0;
                                return false;
                            }});
        return res;
    },
    //--------------------------------------------------------------------------
    get_towers : function()
    {
        var res;
        res = s1.room.find(FIND_STRUCTURES, { filter: 
                            function(obj)
                            { 
                                if(obj.structureType == STRUCTURE_TOWER)
                                    return obj.energy < obj.energyCapacity;
                                return false;
                            }});
        return res;
    },
    //--------------------------------------------------------------------------
    is_owner_of_creep : function(cr_name)
    {
        return (Game.creeps[cr_name].memory.spawnID == SPAWN1_ID);
    },
    //--------------------------------------------------------------------------
    get_first_construction_id : function()
    {
        var res = s1.room.find(FIND_CONSTRUCTION_SITES);
        
        if(res.length > 0)
            return res[0].id;
        return null;
    },
    //--------------------------------------------------------------------------
    calc_energy : function()
    {
        s1_energy            = 0;
        s1_energy_capacity   = 0;
        s1_energy            += s1.energy;
        s1_energy_capacity   += s1.energyCapacity;
        
        var extensions = s1.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    
        if(extensions.length > 0)
        {
            for(var i in extensions)
            {
                s1_energy            += extensions[i].energy;
                s1_energy_capacity   += extensions[i].energyCapacity;
            }
        }
    },
    //--------------------------------------------------------------------------
    get_source_id : function()
    {
        if(s1.memory.sourceID >= s1.memory.sourceCount)
            s1.memory.sourceID = 0;
        return s1_sources[s1.memory.sourceID++];
    },
    //--------------------------------------------------------------------------
    find_energy_sources : function()
    {
        var fsrc   = s1.room.find(FIND_SOURCES);
        s1_sources = [];

        for(var i in fsrc)
            s1_sources.push(fsrc[i].id);

        s1.memory.sourceID    = 0;
        s1.memory.sourceCount = fsrc.length;

        harvester_max     = s1.memory.sourceCount * harvester_on_src;
        rcl_upgrader_max  = s1.memory.sourceCount * rcl_upgrader_on_src;
    },
    //--------------------------------------------------------------------------
    processing : function()
    {
        if(s1_sources.length == 0)
            this.find_energy_sources();
    }
}

//------------------------------------------------------------------------------

var harvester_role = 
{
    body_calc : function()
    {
        s1tool.calc_energy();
        
        harvester_body     = [];
        if(s1_energy >= 700)
        {
            harvester_body   = harvester_700_body;
            return;
        }
        if(s1_energy >= 500)
        {
            harvester_body   = harvester_500_body;
            return;
        }
        if(s1_energy >= 300)
        {
            harvester_body   = harvester_300_body;
            return;
        }
    },
    //------------------------------------------------------------------------------
    create : function()
    {
        if(s1.spawning)
            return;

        this.body_calc();

        if(harvester_body.length > 0)
        {
            s1.createCreep(harvester_body, null,{ role       : CREEP_ROLE.HARVESTER
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

        //console.log(mem.state)

        switch(mem.state)
        {
            case HARVESTER_STATE.CREATE:
            {
                if(mem.resourceID == null)
                {
                    mem.resourceID = s1tool.get_source_id();
                    
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
                if(s1.energy < s1.energyCapacity)
                {
                    mem.targetID = s1.id;
                    mem.state    = HARVESTER_STATE.TRANCFERING;
                    break;
                }
  
                var res = s1tool.get_stores_for_trancfer();
                if(res.length > 0)
                {
                    mem.targetID = res[0].id;
                    mem.state    = HARVESTER_STATE.TRANCFERING;
                    break;
                }

                res = s1tool.get_towers();
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
                mem.targetID = null;
                
                //console.log("cannot calculate transfer object...")
                
                break;
            }
            case HARVESTER_STATE.TRANCFERING:
            {
                var target = Game.getObjectById(mem.targetID);
                
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
                console.log(res)
                break;
            }
        }
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var rcl_upgrader_role = 
{
    body_calc : function()
    {
        s1tool.calc_energy();
        
        rcl_upgrader_body = [];
        if(s1_energy >= 700)
        {
            rcl_upgrader_body   = rcl_upgrader_700_body;
            return;
        }
        if(s1_energy >= 500)
        {
            rcl_upgrader_body   = rcl_upgrader_500_body;
            return;
        }
        if(s1_energy >= 300)
        {
            rcl_upgrader_body   = rcl_upgrader_300_body;
            return;
        }
    },
    //------------------------------------------------------------------------------
    create : function()
    {
        if(s1.spawning)
            return;

        this.body_calc();

        if(rcl_upgrader_body.length > 0)
        {
            s1.createCreep(rcl_upgrader_body, null,{ role    : CREEP_ROLE.RCL_UPGRADER
                                                 ,state      : RCL_UPGRADER_STATE.CREATE
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
            case RCL_UPGRADER_STATE.CREATE:
            {
                var res;
                res = s1tool.get_stores_with_count_energy(obj.carryCapacity);
                if(res.length > 0)
                {
                    mem.targetID = res[0].id;
                    mem.state    = RCL_UPGRADER_STATE.TO_ENERGY;
                    break;
                }
                
                if(mem.resourceID == null)
                {
                    mem.resourceID = s1tool.get_source_id();
                    if(obj.pos.inRangeTo(Game.getObjectById(mem.resourceID), 1))
                        mem.state  = RCL_UPGRADER_STATE.HARVEST;
                    else
                        mem.state  = RCL_UPGRADER_STATE.TO_HARVEST;
                }
                break;
            }
            case RCL_UPGRADER_STATE.RECALCULATE:
            {
                var res;
                res = s1tool.get_stores_with_count_energy(obj.carryCapacity);
                if(res.length > 0)
                {
                    mem.targetID = res[0].id;
                    mem.state    = RCL_UPGRADER_STATE.TO_ENERGY;
                    break;
                }
                
                if(mem.resourceID == null)
                {
                    mem.resourceID = s1tool.get_source_id();
                    if(obj.pos.inRangeTo(Game.getObjectById(mem.resourceID), 1))
                        mem.state  = RCL_UPGRADER_STATE.HARVEST;
                    else
                        mem.state  = RCL_UPGRADER_STATE.TO_HARVEST;
                }
                break;
            }
            case RCL_UPGRADER_STATE.TO_HARVEST:
            {
                var source_obj = Game.getObjectById(mem.resourceID);
                
                if(obj.pos.inRangeTo(source_obj, 1))
                    mem.state = RCL_UPGRADER_STATE.HARVEST;
                else
                    obj.moveTo(source_obj);
                break;
            }
            case RCL_UPGRADER_STATE.HARVEST:
            {
                var total = _.sum(obj.carry);
                if(total < obj.carryCapacity)
                {
                    var res = obj.harvest(Game.getObjectById(mem.resourceID));
                    if(res != OK)
                        console.log("upgrader harvest result = " + res);
                    break;
                }
                mem.state = RCL_UPGRADER_STATE.TO_UPGRADE;
                break;
            }
            case RCL_UPGRADER_STATE.TO_ENERGY:
            {
                var energy_obj = Game.getObjectById(mem.targetID);
                
                if(obj.pos.inRangeTo(energy_obj, 1))
                    mem.state = RCL_UPGRADER_STATE.GET_ENERGY;
                else
                    obj.moveTo(energy_obj);
                break;
            }
            case RCL_UPGRADER_STATE.GET_ENERGY:
            {
                var energy_obj = Game.getObjectById(mem.targetID);                
                var res        = energy_obj.transfer(obj, RESOURCE_ENERGY);
                
                mem.state  = RCL_UPGRADER_STATE.TO_UPGRADE;

                if(res != OK)
                    console.log("RCL_UPGRADER.GET_ENERGY = " + res);
                break;
            }
            case RCL_UPGRADER_STATE.TO_UPGRADE:
            {
                if(obj.pos.inRangeTo(s1.room.controller, 3))
                {
                    mem.state = RCL_UPGRADER_STATE.UPGRADE;
                    break;
                }
                else
                    obj.moveTo(s1.room.controller);
                break;
            }
            case RCL_UPGRADER_STATE.UPGRADE:
            {
                var res = obj.upgradeController(s1.room.controller);
                if(res == ERR_NOT_ENOUGH_RESOURCES)
                {
                    mem.state  = RCL_UPGRADER_STATE.RECALCULATE;
                    break;
                }
                
                if(res != OK)
                    console.log("RCL_UPGRADER.UPGRADE ...")
                break;
            }
        }
    }
}
//------------------------------------------------------------------------------

var builder_role = 
{
    body_calc : function()
    {
        s1tool.calc_energy();
        
        builder_body = [];
        if(s1_energy >= 700)
        {
            builder_body   = builder_700_body;
            return;
        }
        if(s1_energy >= 500)
        {
            builder_body   = builder_500_body;
            return;
        }
        if(s1_energy >= 300)
        {
            builder_body   = builder_300_body;
            return;
        }
    },
    //------------------------------------------------------------------------------
    create : function()
    {
        if(s1.spawning)
            return;

        this.body_calc();

        if(builder_body.length > 0)
        {
            s1.createCreep(builder_body, null,{ role         : CREEP_ROLE.BUILDER
                                                 ,state      : BUILDER_STATE.CREATE
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
            case BUILDER_STATE.CREATE:
            {
                var res;
                res = s1tool.get_stores_with_count_energy(obj.carryCapacity);
                if(res.length > 0)
                {
                    mem.targetID = res[0].id;
                    mem.state    = BUILDER_STATE.TO_ENERGY;
                    break;
                }
                
                if(mem.resourceID == null)
                {
                    mem.resourceID = s1tool.get_source_id();
                    if(obj.pos.inRangeTo(Game.getObjectById(mem.resourceID), 1))
                        mem.state  = BUILDER_STATE.HARVEST;
                    else
                        mem.state  = BUILDER_STATE.TO_HARVEST;
                }
                break;
            }
            case BUILDER_STATE.TO_HARVEST:
            {
                var source_obj = Game.getObjectById(mem.resourceID);
                
                if(obj.pos.inRangeTo(source_obj, 1))
                    mem.state = BUILDER_STATE.HARVEST;
                else
                    obj.moveTo(source_obj);
                break;
            }
            case BUILDER_STATE.HARVEST:
            {
                var total = _.sum(obj.carry);
                if(total < obj.carryCapacity)
                {
                    var res = obj.harvest(Game.getObjectById(mem.resourceID));
                    if(res != OK)
                        console.log("builder harvest result = " + res);
                    break;
                }
                mem.state = BUILDER_STATE.TO_UPGRADE;
                break;
            }
            case BUILDER_STATE.TO_ENERGY:
            {
                var energy_obj = Game.getObjectById(mem.targetID);
                
                if(obj.pos.inRangeTo(energy_obj, 1))
                    mem.state = BUILDER_STATE.TAKE_ENERGY;
                else
                    obj.moveTo(energy_obj);
                break;
            }
            case BUILDER_STATE.TAKE_ENERGY:
            {
                var energy_obj = Game.getObjectById(mem.targetID);                
                var res        = energy_obj.transfer(obj, RESOURCE_ENERGY);
                
                mem.state  = BUILDER_STATE.FIND_OBJ_FOR_BUILD;

                if(res != OK)
                    console.log("BUILDER_STATE.TAKE_ENERGY = " + res);
                break;
            }
            case BUILDER_STATE.TO_BUILD:
            {
                var build_obj = Game.getObjectById(mem.targetID);
                if(build_obj)
                {
                    if(obj.pos.inRangeTo(build_obj, 3))
                        mem.state = BUILDER_STATE.BUILD;
                    else
                        obj.moveTo(build_obj);
                }
                break;
            }
            case BUILDER_STATE.BUILD:
            {
                var res = obj.build(Game.getObjectById(mem.targetID));
                if(res != OK)
                {
                    mem.state = BUILDER_STATE.FIND_OBJ_FOR_BUILD;
                    break;
                }
                break;
            }
            case BUILDER_STATE.TO_REPAIR:
            {
                var repair_obj = Game.getObjectById(mem.targetID);
                if(repair_obj)
                {
                    if(obj.pos.inRangeTo(repair_obj, 3))
                        mem.state = BUILDER_STATE.REPAIR;
                    else
                        obj.moveTo(repair_obj);
                }
                break;
            }
            case BUILDER_STATE.REPAIR:
            {
                var res = obj.repair(Game.getObjectById(mem.targetID));
                if(res != OK)
                {
                    mem.state = BUILDER_STATE.DOING_CALCULATE;
                    break;
                }
                break;
            }
            case BUILDER_STATE.DOING_CALCULATE:
            {
                var total = _.sum(obj.carry);
                
                if(total < obj.carryCapacity)
                {
                    var res;
                    res = s1tool.get_stores_with_count_energy(obj.carryCapacity);
                    if(res.length > 0)
                    {
                        mem.targetID = res[0].id;
                        mem.state    = BUILDER_STATE.TO_ENERGY;
                        break;
                    }
                    
                    if(mem.resourceID == null)
                    {
                        mem.resourceID = s1tool.get_source_id();
                        if(obj.pos.inRangeTo(Game.getObjectById(mem.resourceID), 1))
                            mem.state  = BUILDER_STATE.HARVEST;
                        else
                            mem.state  = BUILDER_STATE.TO_HARVEST;
                    }
                    break;
                }
                console.log(" BUILDER_STATE.DOING_CALCULATE calculating...");
                break;
            }
            case BUILDER_STATE.FIND_OBJ_FOR_BUILD:
            {
                var res = s1tool.get_build_objects();
                if(res.length > 0)
                {
                    mem.targetID = res[0].id;
                    mem.state    = BUILDER_STATE.TO_BUILD;
                    break;
                }
                mem.state = BUILDER_STATE.FIND_OBJ_FOR_REPAIR;
                break;
            }
            case BUILDER_STATE.FIND_OBJ_FOR_REPAIR:
            {
                var res = s1tool.get_repair_objects();
                if(res.length > 0)
                {
                    mem.targetID = res[0].id;
                    mem.state    = BUILDER_STATE.TO_REPAIR;
                    break;
                }
                mem.state = BUILDER_STATE.DOING_CALCULATE;
                break;
            }
        }
    }
}

//------------------------------------------------------------------------------

module.exports = 
{
    //--------------------------------------------------------------------------
    creeps_doing : function()
    {
        harvester_count    = 0;
        rcl_upgrader_count = 0;
        builder_count      = 0;
        
        for(var i in Game.creeps)
        {
            if(s1tool.is_owner_of_creep(i))
            {
                var cr = Game.creeps[i];
                switch(cr.memory.role)
                {
                    case CREEP_ROLE.HARVESTER:
                    {
                        harvester_role.doing(cr);
                        ++harvester_count;
                        break;
                    }
                    case CREEP_ROLE.RCL_UPGRADER:
                    {
                        rcl_upgrader_role.doing(cr);
                        ++rcl_upgrader_count;
                        break;
                    }
                    case CREEP_ROLE.BUILDER:
                    {
                        builder_role.doing(cr);
                        ++builder_count;
                        break;
                    }
                }
            }
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
            res = s1tool.get_build_objects();
            if(res.length > 0)
            {
                builder_role.create();
                return;
            }
            
            res = s1tool.get_repair_objects();
            if(res.length > 0)
            {
                builder_role.create();
                return;
            }
            return;
        }
    },
    //--------------------------------------------------------------------------
    processing : function()
    {
        s1 = Game.spawns.s1;
        
        if(!s1)
            return;
        
        s1tool.processing();
        
        this.creeps_doing();
    }
};



























