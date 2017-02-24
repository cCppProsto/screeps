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

/*
Controller level    - 1

    spawn energy        - 300
        
        harvester           - [MOVE, WORK, WORK,  CARRY]
        cl_upgrader         - [MOVE, WORK, CARRY, CARRY, CARRY]

*/

const spawn_1_name  = "s1";
var   s1_obj        = null;

const harvester_1_body   = [MOVE, WORK, WORK,  CARRY];
const cl_upgrader_1_body = [MOVE, WORK, CARRY, CARRY, CARRY];


const harvester_max    = 4;
const cl_upgrader_max  = 4;

var harvester_count    = 0;
var cl_upgrader_count  = 0;

module.exports.loop = function()
{
    if(Game.spawns[spawn_1_name])
    {
        s1_obj = Game.spawns[spawn_1_name];
        
        // CHECK AND CREATE WORKERS  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if( !s1_obj.spawning && s1_obj.energy >= 300)
        {
            harvester_count    = 0;
            cl_upgrader_count  = 0;

            for(var i in Game.creeps)
            {
                var cr = Game.creeps[i];
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
            }
            
            if(harvester_count < harvester_max)
            {
                if(s1_obj.canCreateCreep(harvester_1_body) == OK)
                {
                    var res;
                    res = s1_obj.createCreep(harvester_1_body, null,  {role : 'harvester', isTransfer : false});
                    if(_.isString(res))
                        console.log("Creating a harvester '" + res + "' was startes");
                    else
                        console.log("Harvester spawn error: " + res);
                }
            }
            else
            if(cl_upgrader_count < cl_upgrader_max)
            {
                if(s1_obj.canCreateCreep(cl_upgrader_1_body) == OK)
                {
                    var res;
                    res = s1_obj.createCreep(cl_upgrader_1_body, null,  {role : 'cl_upgrader', isTransfer : false});
                    if(_.isString(res))
                        console.log("Creating a controller upgrader '" + res + "' was started");
                    else
                        console.log("Controller upgrader spawn error: " + res);
                }
            }
        }
        
        // WORKERS PROCESSING >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        
        for(var i in Game.creeps)
        {
            var cr    = Game.creeps[i];
            var total = _.sum(cr.carry);


            if(total == 0 )
                cr.memory.isTransfer = false;
                
            if( (total < cr.carryCapacity) && (!cr.memory.isTransfer))
            {
                var pos = cr.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(pos)
                {
                    if(cr.harvest(pos) == ERR_NOT_IN_RANGE)
                        cr.moveTo(pos);
                }
            }
            
            if(total >= cr.carryCapacity)
                cr.memory.isTransfer = true;            

            if(cr.memory.isTransfer)
            {            
                switch(cr.memory.role)
                {
                    case 'harvester':
                    {
                        if(s1_obj.energy < s1_obj.energyCapacity)
                        {
                            var res;
                            res = cr.transfer(s1_obj, RESOURCE_ENERGY);
                            if(res == ERR_NOT_IN_RANGE)
                                cr.moveTo(s1_obj);
                        }
                        else
                        {
                            if(cr.room.controller)
                            {
                                
                                var res = cr.upgradeController(cr.room.controller);
                                if(res == ERR_NOT_IN_RANGE)
                                    cr.moveTo(cr.room.controller);
                            }
                            
                        }
                        break;
                    }
                    case 'cl_upgrader':
                    {
                        if(cr.room.controller)
                        {
                            
                            var res = cr.upgradeController(cr.room.controller);
                            if(res == ERR_NOT_IN_RANGE)
                                cr.moveTo(cr.room.controller);
                        }
                    }
                }
            }
        }
    
        // WORKERS PROCESSING <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<        
    }
}












