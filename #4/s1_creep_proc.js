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
    HARVESTER   : 0
   ,BUILDER     : 1
   ,CL_UPGRADER : 2
   ,REPAIRER    : 3
};

const HARVESTER_STATE = 
{
    INIT                : 0
   ,MOVE_TO_HARVEST     : 1
   ,HARVEST             : 2
   ,TRANSFER_TO_TARGET  : 3
   ,WAITING             : 4
};

const CL_UPGRADER_STATE = 
{
    INIT                : 0
   ,MOVE_TO_HARVEST     : 1
   ,HARVEST             : 2
   ,TRANSFER_TO_CL      : 3
   ,UPGRADE_CL          : 4
};

const BUILDER_STATE = 
{
    INIT                        : 0
   ,MOVE_TO_HARVEST             : 1
   ,HARVEST                     : 2
   ,MOVE_TO_STORAGE             : 3
   ,TAKE_ENERGY                 : 4
   ,TRANSFER_TO_CONSTRUCTION    : 5
   ,BUILDING                    : 6
   ,WAITING                     : 7
   ,MOVE_TO_REPAIR              : 8
   ,REPAIR                      : 9
};

const REPAIRER_STATE = 
{
    INIT                        : 0
   ,MOVE_TO_STORAGE             : 1
   ,TAKE_ENERGY                 : 2
   ,TRANSFER_TO_REPAIR          : 3
   ,REPAIR                      : 4
   ,WAITING                     : 5
};


//------------------------------------------------------------------------------

const harvester_300_body = [MOVE, WORK, WORK,  CARRY];
const harvester_500_body = [MOVE, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY];
const harvester_700_body = [MOVE, MOVE, MOVE, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   harvester_body     = [];

const cl_upgrader_300_body = [MOVE, WORK, CARRY, CARRY,  CARRY];
const cl_upgrader_500_body = [MOVE, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY];
const cl_upgrader_700_body = [MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   cl_upgrader_body     = [];

const builder_300_body = [MOVE, WORK, CARRY, CARRY,  CARRY];
const builder_500_body = [MOVE, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY];
const builder_700_body = [MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   builder_body     = [];

const repairer_500_body = [MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
const repairer_700_body = [MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   repairer_body     = [];


//------------------------------------------------------------------------------

var s1         = null;
var s1_sources = [];

var harvester_count    = 0;
var harvester_max      = 6;     // !! DEPENDS ON COUNT OF SOURCES IN SPAWN ROOM: 1 source = 3 max, 2 source = 6 max, etc.
var harvester_on_src   = 3;

var cl_upgrader_count  = 0;
var cl_upgrader_max    = 4;     // !! DEPENDS ON COUNT OF SOURCES IN SPAWN ROOM: 1 source = 2 max, 2 source = 2 max, etc.
var cl_upgrader_on_src = 2;

var builder_count      = 0;
var builder_max        = 4;     // !! DEPENDS ON COUNT OF SOURCES IN SPAWN ROOM: 1 source = 2 max, 2 source = 2 max, etc.
var builder_on_src     = 2;

var repairer_count     = 0;
var repairer_max       = 4;

var s1_common_energy_capacity = 0;
var s1_common_energy          = 0;

//------------------------------------------------------------------------------

var stool = 
{
    //--------------------------------------------------------------------------
    get_obj_for_store : function()
    {
        var res;
        res = s1.room.find(FIND_STRUCTURES,
                           {filter: 
                             function(obj)
                             { 
                                 if(obj.structureType == STRUCTURE_EXTENSION )
                                     return obj.energy < obj.energyCapacity;
                                 return false;
                             }});
        if(res == false)
        {
            res = s1.room.find(FIND_STRUCTURES,
                               {filter: 
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
    get_stores : function()
    {
        var res;
        res = s1.room.find(FIND_STRUCTURES, 
                           { filter :  function(obj) 
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
        res = s1.room.find(FIND_STRUCTURES,
                            { filter: 
                                function(obj)
                                { 
                                    if(obj.structureType == STRUCTURE_TOWER)
                                        return obj.energy < obj.energyCapacity;
                                    return false;
                                }
                            });
        return res;
    },
    spawn_is_owner_of_creep : function(cr_name)
    {
        return (Game.creeps[cr_name].memory.spawnID == SPAWN1_ID);
    },
    get_id_first_construction : function()
    {
        var res = s1.room.find(FIND_CONSTRUCTION_SITES);
        
        if(res.length > 0)
            return res[0].id;
        return null;
    }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

module.exports = 
{
    //--------------------------------------------------------------------------
    repairer_doing : function(creep_obj)
    {
        if(creep_obj.spawning)
            return;

        var mem = creep_obj.memory;
        switch(mem.state)
        {
            case REPAIRER_STATE.INIT:
            {
                break;
            }
            case REPAIRER_STATE.MOVE_TO_STORAGE:
            {
                break;
            }
            case REPAIRER_STATE.TAKE_ENERGY:
            {
                break;
            }
            case REPAIRER_STATE.TRANSFER_TO_REPAIR:
            {
                break;
            }
            case REPAIRER_STATE.REPAIR:
            {
                break;
            }
            case REPAIRER_STATE.WAITING:
            {
                break;
            }
        }
    },    
    //--------------------------------------------------------------------------
    builder_doing : function(creep_obj)
    {
        if(creep_obj.spawning)
            return;

        var mem = creep_obj.memory;
        switch(mem.state)
        {
            case BUILDER_STATE.INIT:
            {
                var storages;
                
                storages = stool.get_stores();
                                                                        
                if(storages.length > 0)
                {
                    mem.state       = BUILDER_STATE.MOVE_TO_STORAGE;
                    mem.resourceID  = storages[0].id;
                    break;
                }
                
                mem.state       = BUILDER_STATE.MOVE_TO_HARVEST;
                mem.resourceID  = this.get_energy_source_id();
                break;
            }
            case BUILDER_STATE.MOVE_TO_HARVEST:
            {
                var source_obj = Game.getObjectById(mem.resourceID);
                
                if(creep_obj.pos.inRangeTo(source_obj, 1))
                {
                    mem.prev_state = mem.state;
                    mem.state      = BUILDER_STATE.HARVEST;
                }
                else
                    creep_obj.moveTo(source_obj);
                break;
            }
            case BUILDER_STATE.HARVEST:
            {
                var total = _.sum(creep_obj.carry);
                
                if(total >= creep_obj.carryCapacity)
                {
                    mem.prev_state = mem.state;
                    mem.state    = BUILDER_STATE.TRANSFER_TO_CONSTRUCTION;
                    break;
                }
                
                creep_obj.harvest(Game.getObjectById(mem.resourceID));
                break;
            }
            case BUILDER_STATE.MOVE_TO_STORAGE:
            {
                var storage_obj = Game.getObjectById(mem.resourceID);
                
                
                if(creep_obj.pos.inRangeTo(storage_obj, 1))
                {
                    mem.prev_state = mem.state;
                    mem.state      = BUILDER_STATE.TAKE_ENERGY;
                }
                else
                {
                    creep_obj.moveTo(storage_obj);
                }
                break;
            }
            case BUILDER_STATE.TAKE_ENERGY:
            {
                var storage_obj = Game.getObjectById(mem.resourceID);
                var total = _.sum(storage_obj.store);

                if(total == 0)
                {
                    mem.prev_state = mem.state;
                    mem.state      = BUILDER_STATE.INIT;
                    break;
                }

                var res;
                res = storage_obj.transfer(creep_obj, RESOURCE_ENERGY);
                mem.prev_state = mem.state;
                mem.state      = BUILDER_STATE.TRANSFER_TO_CONSTRUCTION;
                break;
            }
            case BUILDER_STATE.TRANSFER_TO_CONSTRUCTION:
            {
                var contruct_obj = Game.getObjectById(mem.targetID);
                
                
                if(contruct_obj)
                {
                    if(creep_obj.pos.inRangeTo(contruct_obj, 3))
                    {
                        mem.prev_state = mem.state;
                        mem.state      = BUILDER_STATE.BUILDING;
                    }
                    else
                        creep_obj.moveTo(contruct_obj);
                }
                else
                {
                    mem.prev_state = mem.state;
                    mem.state      = BUILDER_STATE.INIT;
                    mem.targetID   = stool.get_id_first_construction();
                    if(mem.targetID != null)
                    {
                        mem.state      = BUILDER_STATE.BUILDING;
                        break;
                    }
                    else
                    {
                        mem.state      = BUILDER_STATE.INIT;
                    }
                }
                break;
            }
            case BUILDER_STATE.BUILDING:
            {
                if(creep_obj.build(Game.getObjectById(mem.targetID)) != OK)
                {
                    mem.prev_state = mem.state;
                    mem.targetID   = stool.get_id_first_construction();
                    if(mem.targetID != null)
                        mem.state = BUILDER_STATE.INIT;
                    else
                        mem.state = BUILDER_STATE.WAITING;
                    break;
                }
                break;
            }
            case BUILDER_STATE.WAITING:
            {
                if(s1.memory.repairObjID)
                {
                    mem.state = BUILDER_STATE.MOVE_TO_REPAIR;
                    break;
                }
                
                
                if(Game.time & 0x01)
                {
                    mem.prev_state = mem.state;
                    mem.targetID   = stool.get_id_first_construction();
                    if(mem.targetID != null)
                        mem.state = BUILDER_STATE.INIT;
                }
                break;
            }
            case BUILDER_STATE.MOVE_TO_REPAIR:
            {
                if(s1.memory.repairObjID)
                {
                    if(creep_obj.pos.inRangeTo(Game.getObjectById(s1.memory.repairObjID), 3))
                    {
                        mem.prev_state = mem.state;
                        mem.state      = BUILDER_STATE.REPAIR;
                    }
                    else
                        creep_obj.moveTo(Game.getObjectById(s1.memory.repairObjID));
                }
                break;
            }
            case BUILDER_STATE.REPAIR:
            {
                if(s1.memory.repairObjID)
                {
                    if(creep_obj.repair(Game.getObjectById(s1.memory.repairObjID)) != OK)
                    {
                        mem.state = BUILDER_STATE.INIT;
                        break;
                    }
                }
                break;
            }
        }        
    },
    //--------------------------------------------------------------------------
    cl_upgrader_doing : function(creep_obj)
    {
        if(creep_obj.spawning)
            return;

        var mem = creep_obj.memory;
        switch(mem.state)
        {
            case CL_UPGRADER_STATE.INIT:
            {
                if(mem.resourceID == null)
                {
                    mem.resourceID = this.get_energy_source_id();
                    mem.prev_state = mem.state;
                    
                    var target = Game.getObjectById(mem.resourceID);
                    
                    if(creep_obj.pos.inRangeTo(target, 1))
                        mem.state  = CL_UPGRADER_STATE.HARVEST;
                    else
                        mem.state  = CL_UPGRADER_STATE.MOVE_TO_HARVEST;
                }                
                break;        
            }
            case CL_UPGRADER_STATE.MOVE_TO_HARVEST:
            {
                var source_obj = Game.getObjectById(mem.resourceID);
                
                if(creep_obj.pos.inRangeTo(source_obj, 1))
                {
                    mem.prev_state = mem.state;
                    mem.state      = CL_UPGRADER_STATE.HARVEST;
                }
                else
                    creep_obj.moveTo(source_obj);
                break;
            }
            case CL_UPGRADER_STATE.HARVEST:
            {
                var total = _.sum(creep_obj.carry);
                
                if(total >= creep_obj.carryCapacity)
                {
                    mem.prev_state = mem.state;
                    mem.state    = CL_UPGRADER_STATE.TRANSFER_TO_CL;
                    break;
                }
                
                creep_obj.harvest(Game.getObjectById(mem.resourceID));
                break;
            }
            case CL_UPGRADER_STATE.TRANSFER_TO_CL:
            {
                if(creep_obj.pos.inRangeTo(Game.spawns.s1.room.controller, 3))
                {
                    mem.prev_state = mem.state;
                    mem.state    = CL_UPGRADER_STATE.UPGRADE_CL;
                }
                else
                    creep_obj.moveTo(Game.spawns.s1.room.controller);
                break;
            }
            case CL_UPGRADER_STATE.UPGRADE_CL:
            {
                if(creep_obj.upgradeController(Game.spawns.s1.room.controller) == ERR_NOT_ENOUGH_RESOURCES)
                {
                    mem.prev_state = mem.state;
                    mem.state  = CL_UPGRADER_STATE.MOVE_TO_HARVEST;
                    break;
                }
                break;
            }
        }
    },
    //--------------------------------------------------------------------------
    harvester_doing : function(creep_obj)
    {
        if(creep_obj.spawning)
            return;
            
        var mem = creep_obj.memory;
        switch(mem.state)
        {
            case HARVESTER_STATE.INIT:
            {
                if(mem.resourceID == null)
                {
                    mem.resourceID = this.get_energy_source_id();
                    mem.prev_state = mem.state;
                    
                    var target = Game.getObjectById(mem.resourceID);
                    
                    if(creep_obj.pos.inRangeTo(target, 1))
                        mem.state  = HARVESTER_STATE.HARVEST;
                    else
                        mem.state  = HARVESTER_STATE.MOVE_TO_HARVEST;
                }                
                break;        
            }
            case HARVESTER_STATE.MOVE_TO_HARVEST:
            {
                var source_obj = Game.getObjectById(mem.resourceID);
                
                if(creep_obj.pos.inRangeTo(source_obj, 1))
                {
                    mem.prev_state = mem.state;
                    mem.state      = HARVESTER_STATE.HARVEST;
                }
                else
                    creep_obj.moveTo(source_obj);
                break;
            }
            case HARVESTER_STATE.HARVEST:
            {
                var total = _.sum(creep_obj.carry);
                
                if(total >= creep_obj.carryCapacity)
                {
                    mem.prev_state = mem.state;
                    
                    if(s1.energy < s1.energyCapacity)
                    {
                        mem.targetID = Game.spawns.s1.id;
                        mem.state    = HARVESTER_STATE.TRANSFER_TO_TARGET;
                        break;
                    }
      
                    var res = stool.get_obj_for_store();
                    if(res.length > 0)
                    {
                        mem.targetID = res[0].id;
                        mem.state    = HARVESTER_STATE.TRANSFER_TO_TARGET;
                        break;
                    }
                    
                    mem.state = HARVESTER_STATE.WAITING;
                    break;
                }
                
                var source_obj = Game.getObjectById(mem.resourceID);
                creep_obj.harvest(source_obj);
                break;        
            }
            case HARVESTER_STATE.TRANSFER_TO_TARGET:
            {
                var target = Game.getObjectById(mem.targetID);
                if(creep_obj.pos.inRangeTo(target, 1))
                {
                    var res = creep_obj.transfer(target, RESOURCE_ENERGY);
                    if(res == OK)
                    {
                        mem.prev_state = mem.state;
                        mem.state      = HARVESTER_STATE.MOVE_TO_HARVEST;
                        break;
                    }
                    else
                    {
                        mem.prev_state = mem.state;
                        mem.state = HARVESTER_STATE.WAITING;
                    }
                }
                else
                    creep_obj.moveTo(target);
                break;        
            }
            case HARVESTER_STATE.WAITING:
            {
                mem.prev_state = mem.state;
                
                if( Game.time & 0x01)
                {
                    if(s1.energy < s1.energyCapacity)
                    {
                        mem.targetID = Game.spawns.s1.id;
                        mem.state    = HARVESTER_STATE.TRANSFER_TO_TARGET;
                        break;
                    }
                    else
                    {
                        var res = stool.get_obj_for_store();
                        if(res.length > 0)
                        {
                            mem.targetID = res[0].id;
                            mem.state    = HARVESTER_STATE.TRANSFER_TO_TARGET;
                            break;
                        }
                        else // check tower
                        {
                            var res;
                            res = stool.get_towers();
                            if(res.length > 0)
                            {
                                mem.targetID = res[0].id;
                                mem.state    = HARVESTER_STATE.TRANSFER_TO_TARGET;
                                break;
                            }
                            
                        }
                        if(!creep_obj.pos.inRangeTo(Game.spawns.s1, 2))
                            creep_obj.moveTo(Game.spawns.s1);
                    }
                }
                break;        
            }
        }
    },
    //--------------------------------------------------------------------------
    create_repairer : function()
    {
        
    },
    //--------------------------------------------------------------------------
    create_harvester : function()
    {
        if(s1.spawning)
            return;
            
        this.calc_common_energy();
        this.calc_body_creeps();
        
        if(harvester_body.length > 0)
        {
            s1.createCreep(harvester_body, null,{ role       : CREEP_ROLE.HARVESTER
                                                 ,state      : HARVESTER_STATE.INIT
                                                 ,prev_state : HARVESTER_STATE.INIT
                                                 ,targetID   : null
                                                 ,resourceID : null  
                                                 ,spawnID    : SPAWN1_ID
                                                });
        }
    },
    //--------------------------------------------------------------------------
    create_cl_upgrader : function()
    {
        if(s1.spawning)
            return;
            
        this.calc_common_energy();
        this.calc_body_creeps();
        
        if(cl_upgrader_body.length > 0)
        {
            s1.createCreep(cl_upgrader_body, null,{ role       : CREEP_ROLE.CL_UPGRADER
                                                 ,state      : CL_UPGRADER_STATE.INIT
                                                 ,prev_state : CL_UPGRADER_STATE.INIT
                                                 ,targetID   : null
                                                 ,resourceID : null  
                                                 ,spawnID    : SPAWN1_ID
                                                });
        }
    },
    //--------------------------------------------------------------------------
    create_builder : function(obj_id)
    {
        if(s1.spawning)
            return;
            
        this.calc_common_energy();
        this.calc_body_creeps();
        
        if(cl_upgrader_body.length > 0)
        {
            s1.createCreep(builder_body, null,{ role         : CREEP_ROLE.BUILDER
                                                 ,state      : BUILDER_STATE.INIT
                                                 ,prev_state : BUILDER_STATE.INIT
                                                 ,targetID   : obj_id
                                                 ,resourceID : null  
                                                 ,spawnID    : SPAWN1_ID
                                                });
        }
    },
    //--------------------------------------------------------------------------
    check_and_create_builder : function()
    {
        var res = s1.room.find(FIND_CONSTRUCTION_SITES);
        
        if((res.length > 0) || s1.memory.repairObjID)
            this.create_builder(res[0].id);
    },
    //--------------------------------------------------------------------------
    creeps_doing : function()
    {
        harvester_count   = 0;
        cl_upgrader_count = 0;
        builder_count     = 0;
        repairer_count    = 0;
        
        for(var i in Game.creeps)
        {
            if(stool.spawn_is_owner_of_creep(i))
            {
                var cr = Game.creeps[i];
                switch(cr.memory.role)
                {
                    case CREEP_ROLE.HARVESTER:
                    {
                        this.harvester_doing(cr);
                        ++harvester_count;
                        break;
                    }
                    case CREEP_ROLE.CL_UPGRADER:
                    {
                        this.cl_upgrader_doing(cr);
                        ++cl_upgrader_count;
                        break;
                    }
                    case CREEP_ROLE.BUILDER:
                    {
                        this.builder_doing(cr);
                        ++builder_count;
                        break;
                    }
                    case CREEP_ROLE.REPAIRER:
                    {
                        ++repairer_count;
                        break;
                    }
                }
            }
        }

        if(harvester_count < harvester_max)
        {
            this.create_harvester();
            return;
        }
        
        if(cl_upgrader_count < cl_upgrader_max)
        {
            this.create_cl_upgrader();
            return;
        }
        
        if(builder_count < builder_max)
        {
           this.check_and_create_builder();
           return;
        }
        
        if(repairer_count < repairer_max)
        {
            this.create_repairer();
            return;
        }
    },
    //--------------------------------------------------------------------------
    calc_body_creeps : function()
    {
        harvester_body     = [];
        cl_upgrader_body   = [];
        
        if(s1_common_energy >= 700)
        {
            harvester_body   = harvester_700_body;
            cl_upgrader_body = cl_upgrader_700_body;
            builder_body     = builder_700_body;
            return;
        }
        if(s1_common_energy >= 500)
        {
            harvester_body   = harvester_500_body;
            cl_upgrader_body = cl_upgrader_500_body;
            builder_body     = builder_500_body;
            return;
        }
        if(s1_common_energy >= 300)
        {
            harvester_body   = harvester_300_body;
            cl_upgrader_body = cl_upgrader_300_body;
            builder_body     = builder_300_body;
            return;
        }
    },
    //--------------------------------------------------------------------------
    calc_common_energy : function()
    {
        s1_common_energy            = 0;
        s1_common_energy_capacity   = 0;
        s1_common_energy            += s1.energy;
        s1_common_energy_capacity   += s1.energyCapacity;
        
        var extensions = s1.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    
        if(extensions.length > 0)
        {
            for(var i in extensions)
            {
                s1_common_energy            += extensions[i].energy;
                s1_common_energy_capacity   += extensions[i].energyCapacity;
            }
        }
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

        harvester_max   = s1.memory.sourceCount * harvester_on_src;
        cl_upgrader_max = s1.memory.sourceCount * cl_upgrader_on_src;
        builder_max     = s1.memory.sourceCount * builder_on_src;
    },
    //--------------------------------------------------------------------------
    get_energy_source_id : function()
    {
        if(s1.memory.sourceID >= s1.memory.sourceCount)
            s1.memory.sourceID = 0;
        return s1_sources[s1.memory.sourceID++];
    },
    //--------------------------------------------------------------------------
    find_obj_for_repair : function()
    {
        if(!s1.memory.repairObjID)
        {
            var targets = s1.room.find(FIND_STRUCTURES, 
                            { filter: function(obj)
                                  { 
                                     if(obj.structureType == STRUCTURE_WALL)
                                         return obj.hits < obj.hitsMax
                                     return false;
                                 }});
            if(targets.length > 0)
                s1.memory.repairObjID = targets[0].id;
            else
                s1.memory.repairObjID = null;
        }
        else
        {
            if(Game.getObjectById(s1.memory.repairObjID).hits == Game.getObjectById(s1.memory.repairObjID).hitsMax)
                s1.memory.repairObjID = null;
        }
    },
    //--------------------------------------------------------------------------
    tower_repair : function()
    {
        //var targets = s1.room.find(FIND_STRUCTURES, 

        if(s1.memory.repairObjID)
        {
            var towers = s1.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            for(var i in towers)
            {
                if(towers[i].energy > 10)
                    towers[i].repair(Game.getObjectById(s1.memory.repairObjID));
                //console.log(i)
            }
        }
    },
    //--------------------------------------------------------------------------
    processing : function()
    {
        s1 = Game.spawns.s1;
        
        if(!s1)
            return;

        if(s1_sources.length == 0)
            this.find_energy_sources();
            
        this.find_obj_for_repair();
        this.tower_repair();
        //console.log(s1.memory.repairObjID)
        // separate by state ?? CREATE | DOING | etc.
        
        this.creeps_doing();
    }
};



























