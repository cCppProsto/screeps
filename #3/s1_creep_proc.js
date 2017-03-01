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
    HARVESTER : 0
   ,BUILDER   : 1
};

const HARVESTER_STATE = 
{
    INIT                : 0
   ,MOVE_TO_HARVEST     : 1
   ,HARVEST             : 2
   ,TRANSFER_TO_TARGET  : 3
   ,WAITING             : 4
   ,MOVE_FOR_REPAIR     : 5
   ,REPAIR_WAITING      : 6
};

//------------------------------------------------------------------------------

const harvester_300_body = [MOVE, WORK, WORK,  CARRY];
const harvester_500_body = [MOVE, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY];
const harvester_700_body = [MOVE, MOVE, MOVE, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   harvester_body     = [];

//------------------------------------------------------------------------------

var s1 = null;

var harvester_count  = 0;
var harvester_max    = 6;   // !! DEPENDS ON COUNT OF SOURCES IN SPAWN ROOM: 1 source = 3 max, 2 source = 6 max, etc.
var harvester_on_src = 3;

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
    harvester_doing : function(creep_obj)
    {
        var mem = creep_obj.memory;
        switch(mem.state)
        {
            case HARVESTER_STATE.INIT:
            {
                if(mem.resourceID == null)
                {
                    mem.resourceID = s1.memory.sources[parseInt(harvester_count/harvester_on_src)];
                    mem.prev_state = mem.state;
                    
                    console.log("index = " + parseInt(harvester_count/harvester_on_src) + ", source ID = " + mem.resourceID);
                    
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
                    console.log("Transfer error - " + res);
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
                //console.log(creep_obj.name + " is waiting...");
                break;        
            }
            case HARVESTER_STATE.MOVE_FOR_REPAIR:
            {
                if(creep_obj.pos.inRangeTo(Game.spawns.s1, 1))
                    mem.state = HARVESTER_STATE.REPAIR_WAITING;
                else
                    creep_obj.moveTo(Game.spawns.s1);
                break;    
            }
            case HARVESTER_STATE.REPAIR_WAITING:
            {
                if(Game.spawns.s1.energy < Game.spawns.s1.energyCapacity)
                    creep_obj.transfer(s1, RESOURCE_ENERGY);
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
                        /*
                        if(cr.memory.state == HARVESTER_STATE.REPAIR_WAITING)
                        {
                            if(s1.renewCreep(cr) = ERR_FULL)
                                cr.memory.state = cr.memory.prev_state;
                        }
                        else
                        if((cr.memory.state != HARVESTER_STATE.MOVE_FOR_REPAIR) && (cr.ticksToLive <= 100))
                        {
                            console.log("prev = " + cr.memory.prev_state)
                            cr.memory.prev_state = cr.memory.state;
                            cr.memory.state      = HARVESTER_STATE.MOVE_FOR_REPAIR;
                        }
                        */
                        
                        this.harvester_doing(cr);
                        break;
                    }
                    case CREEP_ROLE.BUILDER:
                    {
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
    check_and_create : function()
    {
        harvester_count = 0;
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
                    case CREEP_ROLE.BUILDER:
                    {
                        break;
                    }
                }
            }
        }
        if(harvester_count < harvester_max)
        {
            this.create_harvester();
        }        
    },
    //--------------------------------------------------------------------------
    calc_body_creeps : function()
    {
        harvester_body = [];
        if(s1_common_energy >= 700)
        {
            harvester_body = harvester_700_body;
            return;
        }

        if(s1_common_energy >= 500)
        {
            harvester_body = harvester_500_body;
            return;
        }

        if(s1_common_energy >= 300)
        {
            harvester_body = harvester_300_body;
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
        var arr = [];
        var fsrc = s1.room.find(FIND_SOURCES);
        
        for(var i in fsrc)
            arr.push(fsrc[i].id);

        s1.memory.sources = arr;
        //harvester_max = fsrc.length * harvester_on_src;
    },
    //--------------------------------------------------------------------------
    processing : function()
    {
        s1 = Game.spawns.s1;
        
        if(!s1)
            return;

        if(!Game.spawns.s1.memory.sources)
            this.find_energy_sources();


        // separate by state ?? CREATE | DOING | etc.
        
        this.check_and_create();
        this.creeps_doing();
    }
};


























