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


var s1_common_energy_capacity = 0;
var s1_common_energy          = 0;

//------------------------------------------------------------------------------


module.exports = 
{
    //--------------------------------------------------------------------------
    spawn_is_owner_of_creep : function(cr_name)
    {
        return (Game.creeps[cr_name].memory.spawnID == SPAWN1_ID);
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
                var storage = null;
                
                storage = creep_obj.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter :  function(obj) 
                                                                                    { 
                                                                                        if(obj.structureType == STRUCTURE_STORAGE || 
                                                                                           obj.structureType == STRUCTURE_CONTAINER)
                                                                                            return obj.store[RESOURCE_ENERGY] > 0;
                                                                                        return false;
                                                                                    }
                                                                        });
                                                                        
                if(storage != null)
                {
                    mem.state       = BUILDER_STATE.MOVE_TO_STORAGE;
                    mem.resourceID  = storage.id;
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
                    creep_obj.moveTo(storage_obj);
                break;
            }
            case BUILDER_STATE.TAKE_ENERGY:
            {
                var storage_obj = Game.getObjectById(mem.targetID);
                if(storage_obj.store[RESOURCE_ENERGY] == 0)
                {
                    mem.prev_state = mem.state;
                    mem.state      = BUILDER_STATE.INIT;
                    break;
                }
                
                storage_obj.transfer(creep_obj);
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
                    mem.targetID   = this.get_id_first_construction();
                }
                break;
            }
            case BUILDER_STATE.BUILDING:
            {
                if(creep_obj.build(Game.getObjectById(mem.targetID)) != OK)
                {
                    mem.prev_state = mem.state;
                    mem.state      = BUILDER_STATE.INIT;
                    mem.targetID   = this.get_id_first_construction();
                    break;
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
                    
                    console.log("Upgrader index = " + parseInt(cl_upgrader_count/cl_upgrader_on_src) + ", source ID = " + mem.resourceID);
                    
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
                    
                    console.log("Harvester index = " + parseInt(harvester_count/harvester_on_src) + ", source ID = " + mem.resourceID);
                    
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
      
                    // check extensions 
                    var res = s1.room.find(FIND_MY_STRUCTURES,
                                                { filter: 
                                                    function(obj)
                                                    { 
                                                        if(obj.structureType == STRUCTURE_EXTENSION )
                                                            return obj.energy < obj.energyCapacity;

                                                        if(obj.structureType == STRUCTURE_CONTAINER ||
                                                           obj.structureType == STRUCTURE_STORAGE)
                                                            return obj.store[RESOURCE_ENERGY] < obj.storeCapacity;
                                                            
                                                        return false;
                                                    }
                                                });
                    if(res.length > 0)
                    {
                        mem.targetID = res[0].id;
                        mem.state    = HARVESTER_STATE.TRANSFER_TO_TARGET;
                        break;
                    }
                    
                    //console.log("to waiting...")
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
                
                if(s1.energy < s1.energyCapacity)
                {
                    mem.targetID = Game.spawns.s1.id;
                    mem.state    = HARVESTER_STATE.TRANSFER_TO_TARGET;
                    break;
                }
                else
                {
                    // check extensions 
                    var res = s1.room.find(FIND_MY_STRUCTURES,
                                                { filter: 
                                                    function(obj)
                                                    { 
                                                        if(obj.structureType == STRUCTURE_EXTENSION )
                                                            return obj.energy < obj.energyCapacity;

                                                        if(obj.structureType == STRUCTURE_CONTAINER ||
                                                           obj.structureType == STRUCTURE_STORAGE)
                                                            return obj.store[RESOURCE_ENERGY] < obj.storeCapacity;
                                                            
                                                        return false;
                                                    }
                                                });
                    if(res.length > 0)
                    {
                        mem.targetID = res[0].id;
                        mem.state    = HARVESTER_STATE.TRANSFER_TO_TARGET;
                        break;
                    }
                    else if(!creep_obj.pos.inRangeTo(Game.spawns.s1, 2))
                        creep_obj.moveTo(Game.spawns.s1);
                }
                //console.log(creep_obj.name + " is waiting...");
                break;        
            }
        }
    },
    //--------------------------------------------------------------------------
    creeps_doing : function()
    {
        for(var i in Game.creeps)
        {
            if(this.spawn_is_owner_of_creep(i))
            {
                var cr   = Game.creeps[i];

                switch(Game.creeps[i].memory.role)
                {
                    case CREEP_ROLE.HARVESTER:
                    {
                        this.harvester_doing(cr);
                        break;
                    }
                    case CREEP_ROLE.CL_UPGRADER:
                    {
                        this.cl_upgrader_doing(cr);
                        break;
                    }
                    case CREEP_ROLE.BUILDER:
                    {
                        this.builder_doing(cr);
                        break;
                    }
                }
            }
        }
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
    get_id_first_construction : function()
    {
        var res = s1.room.find(FIND_CONSTRUCTION_SITES);
        
        if(res.length > 0)
            return res[0].id;
        return null;
    },
    //--------------------------------------------------------------------------
    check_and_create_builder : function()
    {
        var res = s1.room.find(FIND_CONSTRUCTION_SITES);
        
        if(res.length > 0)
            this.create_builder(res[0].id);
    },
    //--------------------------------------------------------------------------
    check_and_create : function()
    {
        harvester_count   = 0;
        cl_upgrader_count = 0;
        builder_count     = 0;
        
        for(var i in Game.creeps)
        {
            if(this.spawn_is_owner_of_creep(i))
            {
                var cr = Game.creeps[i];
                switch(cr.memory.role)
                {
                    case CREEP_ROLE.HARVESTER:
                    {
                        ++harvester_count;
                        break;
                    }
                    case CREEP_ROLE.CL_UPGRADER:
                    {
                        ++cl_upgrader_count;
                        break;
                    }
                    case CREEP_ROLE.BUILDER:
                    {
                        ++builder_count;
                        break;
                    }
                }
            }
        }

        if(harvester_count < harvester_max)
        {
            this.create_harvester();
        }
        else if(cl_upgrader_count < cl_upgrader_max)
        {
            this.create_cl_upgrader();
        }
        else if(builder_count < builder_max)
        {
           this.check_and_create_builder();
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
        console.log("s1_sources length = " + s1_sources.length);

        for(var i in fsrc)
            s1_sources.push(fsrc[i].id);

        s1.memory.sourceID    = 0;
        s1.memory.sourceCount = fsrc.length;
        console.log("Find is Ok: " + s1.memory.sourceID + ", " + s1.memory.sourceCount);
        
        
        harvester_max   = s1.memory.sourceCount * harvester_on_src;
        cl_upgrader_max = s1.memory.sourceCount * cl_upgrader_on_src;
        builder_max     = s1.memory.sourceCount * builder_on_src;
    },
    //--------------------------------------------------------------------------
    get_energy_source_id : function()
    {
        if(s1.memory.sourceID >= s1.memory.sourceCount)
            s1.memory.sourceID = 0;
        
        console.log("Get ID = " + s1.memory.sourceID);
        
        return s1_sources[s1.memory.sourceID++];
    },
    //--------------------------------------------------------------------------
    processing : function()
    {
        s1 = Game.spawns.s1;
        
        if(!s1)
            return;

        if(s1_sources.length == 0)
            this.find_energy_sources();

        //return;

        // separate by state ?? CREATE | DOING | etc.
        
        this.check_and_create();
        this.creeps_doing();
    }
};



























