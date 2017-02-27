
/*          CREEP BODY

MOVE            50
WORK            100
CARRY           50
ATTACK          80
RANGED_ATTACK   150
HEAL            250
CLAIM           600
TOUGH           10
*/


const harvester_1_body   = [MOVE, WORK, WORK,  CARRY];
const cl_upgrader_1_body = [MOVE, WORK, CARRY, CARRY, CARRY];
const ex_builder_1_body  = [MOVE, WORK, CARRY, CARRY, CARRY];


const harvester_max    = 3;
const cl_upgrader_max  = 3;
const ex_builder_max   = 3;

var harvester_count    = 0;
var cl_upgrader_count  = 0;
var ex_builder_count   = 0;

var s1_obj = null;

module.exports = 
{
//------------------------------------------------------------------------------
create_harvester : function()
{
    var res;
    res = s1_obj.createCreep(harvester_1_body, null,  {role : 'harvester', isTransfer : false});
    if(_.isString(res))
        console.log("Creating a harvester '" + res + "' was startes");
    else
        console.log("Harvester spawn error: " + res);
    
},
//------------------------------------------------------------------------------
create_controller_upgrader : function()
{
    var res;
    res = s1_obj.createCreep(cl_upgrader_1_body, null,  {role : 'cl_upgrader', isTransfer : false});
    if(_.isString(res))
        console.log("Creating a controller upgrader '" + res + "' was started");
    else
        console.log("Controller upgrader spawn error: " + res);
    
},
//------------------------------------------------------------------------------
create_builder_extension : function()
{
    var res;
    res = s1_obj.createCreep(ex_builder_1_body, null,  {role : 'ex_builder', isTransfer : false, isBuilding : false});
    if(_.isString(res))
        console.log("Creating a extensions builder '" + res + "' was started");
    else
        console.log("extensions builde spawn error: " + res);
},
//------------------------------------------------------------------------------
harvester_doing : function(cr)
{
    var total   = _.sum(cr.carry);    

    if(total == 0 )
        cr.memory.isTransfer = false;
    
    if((total < cr.carryCapacity) && (!cr.memory.isTransfer))
    {
        var res_pos = cr.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if(res_pos)
        {
            if(cr.harvest(res_pos) == ERR_NOT_IN_RANGE)
                cr.moveTo(res_pos);
            return;
        }
    }

    if(total >= cr.carryCapacity)
        cr.memory.isTransfer = true;

    if(cr.memory.isTransfer)
    {
        //console.log(total + ":" + s1_obj.energy + ":" + s1_obj.energyCapacity + ":" + s1_obj.spawning)
        if(s1_obj.energy < s1_obj.energyCapacity)
        {
            res = cr.transfer(s1_obj, RESOURCE_ENERGY);
            if(res == ERR_NOT_IN_RANGE)
                cr.moveTo(s1_obj);
        }
        else
        {
            var res = cr.pos.findClosestByRange(FIND_MY_STRUCTURES, 
                                                { filter: 
                                                    function(obj)
                                                    { 
                                                        if(obj.structureType == STRUCTURE_EXTENSION )
                                                        {
                                                            return obj.energy < obj.energyCapacity;
                                                        }
                                                        return false;
                                                    }
                                                });
            if(res)
            {
                if(cr.transfer(res, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    cr.moveTo(res);
            }
            else
            if(cr.room.controller && !s1_obj.spawning)
            {
                var res = cr.upgradeController(cr.room.controller);
                if(res == ERR_NOT_IN_RANGE)
                    cr.moveTo(cr.room.controller);
            }
        }
    }    
},
//------------------------------------------------------------------------------
cl_upgrader_doing : function(cr)
{
    var total   = _.sum(cr.carry);
    if(total == 0 )
        cr.memory.isTransfer = false;
    
    if((total < cr.carryCapacity) && (!cr.memory.isTransfer))
    {
        var res_pos = cr.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if(res_pos)
        {
            if(cr.harvest(res_pos) == ERR_NOT_IN_RANGE)
                cr.moveTo(res_pos);
            return;
        }
    }
    if(total >= cr.carryCapacity)
        cr.memory.isTransfer = true;


    if(cr.memory.isTransfer)
    {
        if(cr.room.controller)
        {
            var res = cr.upgradeController(cr.room.controller);
            if(res == ERR_NOT_IN_RANGE)
                cr.moveTo(cr.room.controller);
        }
        if(cr.carry.energy == 0 )
            cr.memory.isTransfer = false;
    }    
},
//------------------------------------------------------------------------------
ex_builder_doing : function(cr)
{
    var total = _.sum(cr.carry);
    
    if(total == 0 )
    {
        cr.memory.isTransfer = false;
        cr.memory.isBuilding = false;
    }

    if((total < cr.carryCapacity) && (!cr.memory.isTransfer) && (!cr.memory.isBuilding))
    {
        var res_pos = cr.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if(res_pos)
        {
            if(cr.harvest(res_pos) == ERR_NOT_IN_RANGE)
                cr.moveTo(res_pos);
            return;
        }
    }
    if(total >= cr.carryCapacity)
        cr.memory.isTransfer = true;

    if(!cr.memory.isTransfer && !cr.memory.isBuilding)
    {
        console.log(total + " " + cr.memory.isTransfer + " " + cr.memory.isBuilding)
        return;
    }

    if(!cr.memory.exTarget)
    {
        var res = cr.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: { structureType: 'extension' } });
        
        if(res)
        {
            cr.memory.isBuilding = true;
            cr.memory.exTarget = res.id;
        }
        else
        {
            cr.memory.isBuilding = false;
            cr.memory.isTransfer = true;
        }
    }

    if(cr.memory.exTarget)
    {
        var target = Game.getObjectById(cr.memory.exTarget);//Game.constructionSites[cr.memory.exTarget];
        if(target)
        {
            if(target.progress < target.progressTotal)
            {
                if(cr.build(target) == ERR_NOT_IN_RANGE)
                    cr.moveTo(target);
            }
        }
        else
        {
            cr.memory.exTarget = null;
        }
    }
    else
    {
        cr.memory.role = 'harvester';
    }    
},
//------------------------------------------------------------------------------
check_and_spawnd_creep : function()
{
     if( !s1_obj.spawning && s1_obj.energy >= 300)
    {
        harvester_count    = 0;
        cl_upgrader_count  = 0;
        ex_builder_count   = 0;

        for(var i in Game.creeps)
        {
            var cr      = Game.creeps[i];
            if(cr.memory.role == 'harvester')
            {
                ++harvester_count;
                continue;
            }
            
            if(cr.memory.role == 'cl_upgrader')
            {
                ++cl_upgrader_count;
                continue;
            }
            
            if(cr.memory.role == 'ex_builder')
            {
                ++ex_builder_count;
                continue;
            }        
        }
        
        if(harvester_count < harvester_max)
        {
            console.log("h:" + harvester_count + ":"+harvester_max)
            this.create_harvester();
        }
        else
        if(cl_upgrader_count < cl_upgrader_max)
        {
            console.log("c:" + cl_upgrader_count + ":"+cl_upgrader_max)
            this.create_controller_upgrader();
        }
        else
        if(ex_builder_count < ex_builder_max)
        {
            console.log("b:" + ex_builder_count + ":"+ex_builder_max)
            this.create_builder_extension();
        }
    }     
},
//------------------------------------------------------------------------------
creep_doing : function()
{
    for(var i in Game.creeps)
    {
        var cr      = Game.creeps[i];
        if(cr.memory.role == 'harvester')
        {
            this.harvester_doing(cr);
            continue;
        }
        
        if(cr.memory.role == 'cl_upgrader')
        {
            this.cl_upgrader_doing(cr);
            continue;
        }
        
        if(cr.memory.role == 'ex_builder')
        {
            this.ex_builder_doing(cr);
            continue;
        }        
    }      
},
//------------------------------------------------------------------------------
processing : function()
{
    s1_obj = Game.spawns.s1;
    
    this.check_and_spawnd_creep();
    this.creep_doing();
}

};