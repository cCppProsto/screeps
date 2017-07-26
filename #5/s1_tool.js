//------------------------------------------------------------------------------
const SPAWN1_ID = 1;

var s1                 = null;
var s1_sources         = [];
var s1_energy_capacity = 0;
var s1_energy          = 0;
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
module.exports =
{
    //--------------------------------------------------------------------------
    get_sources: function()
    {
      return s1_sources;
    },
    //--------------------------------------------------------------------------
    get_energy_capacity: function()
    {
      return s1_energy_capacity;
    },
    //--------------------------------------------------------------------------
    get_energy: function()
    {
      return s1_energy;
    },
    //--------------------------------------------------------------------------
    get_repair_objects: function()
    {
        var res;
        res = Game.spawns.s1.room.find(FIND_STRUCTURES, { filter :
                            function(obj)
                            {
                                if(obj.structureType == STRUCTURE_CONTAINER)
                                    return obj.hits < (obj.hitsMax / 2);
                                return false;
                            }});

        if(res.length == 0)
        {
            res = Game.spawns.s1.room.find(FIND_STRUCTURES, { filter :
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
        return res = Game.spawns.s1.room.find(FIND_CONSTRUCTION_SITES);
    },
    //--------------------------------------------------------------------------
    get_build_objects : function()
    {
        return Game.spawns.s1.room.find(FIND_CONSTRUCTION_SITES);
    },
    //--------------------------------------------------------------------------
    get_stores_with_count_energy : function(energyCount)
    {
        var res;
        res = Game.spawns.s1.room.find(FIND_STRUCTURES, { filter:
                             function(obj)
                             {
                                 if(obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE)
                                     return obj.store[RESOURCE_ENERGY] > energyCount;

                                 if(obj.structureType == STRUCTURE_EXTENSION)
                                    return obj.energy > 0;
                                 return false;
                             }});
        return res;
    },
    //--------------------------------------------------------------------------
    get_stores_for_trancfer : function()
    {
        var res;
        res = Game.spawns.s1.room.find(FIND_STRUCTURES, { filter:
                            function(obj)
                            {
                                if(obj.structureType == STRUCTURE_EXTENSION)
                                    return obj.energy < obj.energyCapacity;
                                return false;
                            }});

        if(res == false)
        {
            res = Game.spawns.s1.room.find(FIND_STRUCTURES, { filter:
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
        res = Game.spawns.s1.room.find(FIND_STRUCTURES, { filter :
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
        res = Game.spawns.s1.room.find(FIND_STRUCTURES, { filter:
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
        var res = Game.spawns.s1.room.find(FIND_CONSTRUCTION_SITES);

        if(res.length > 0)
            return res[0].id;
        return null;
    },
    //--------------------------------------------------------------------------
    calc_energy : function()
    {
        s1_energy            = 0;
        s1_energy_capacity   = 0;
        s1_energy            += Game.spawns.s1.energy;
        s1_energy_capacity   += Game.spawns.s1.energyCapacity;

        var extensions = Game.spawns.s1.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});

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
        if(Game.spawns.s1.memory.sourceID >= Game.spawns.s1.memory.sourceCount)
            Game.spawns.s1.memory.sourceID = 0;
        return s1_sources[Game.spawns.s1.memory.sourceID++];
    },
    //--------------------------------------------------------------------------
    find_energy_sources : function()
    {
        var fsrc   = Game.spawns.s1.room.find(FIND_SOURCES);
        s1_sources = [];

        for(var i in fsrc)
            s1_sources.push(fsrc[i].id);

        Game.spawns.s1.memory.sourceID    = 0;
        Game.spawns.s1.memory.sourceCount = fsrc.length;
    },
    //--------------------------------------------------------------------------
    processing : function()
    {
        if(s1_sources.length == 0)
            this.find_energy_sources();
    }
};
