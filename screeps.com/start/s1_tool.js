  //------------------------------------------------------------------------------
const SPAWN1_ID = 1;

//var s1                 = null;
var s1_energy_capacity = 0;
var s1_energy          = 0;

var WALL_HITS_AMOUNT    = 100000; // 100k
var RAMPART_HITS_AMOUNT = 200000; // 200k
var COUNT_TICKS_FOR_ATTACK_CHECK = 10;
//------------------------------------------------------------------------------

// !!! ATTENTION !!!   --> for fisrt run need uncomment <--   !!! ATTENTION !!!
//Game.spawns.s1.memory.structuresIsRecalc = true;
//Game.spawns.s1.memory.lastRecalculatedTime = Game.time;
//Game.spawns.s1.memory.energyResourcesID = [];
/*
Game.spawns.s1.memory.construction_containers = [];
Game.spawns.s1.memory.construction_controllers = [];
Game.spawns.s1.memory.construction_labs = [];
Game.spawns.s1.memory.construction_links = [];
Game.spawns.s1.memory.construction_nukers = [];
Game.spawns.s1.memory.construction_observers = [];
Game.spawns.s1.memory.construction_power_spawns = [];
Game.spawns.s1.memory.construction_ramparts = [];
Game.spawns.s1.memory.construction_roads = [];
Game.spawns.s1.memory.construction_spawns = [];
Game.spawns.s1.memory.construction_storages = [];
Game.spawns.s1.memory.construction_terminals = [];
Game.spawns.s1.memory.construction_towers = [];
Game.spawns.s1.memory.construction_walls = [];
Game.spawns.s1.memory.construction_extensions = [];
Game.spawns.s1.memory.construction_extractors = [];

Game.spawns.s1.memory.structure_containers = [];
Game.spawns.s1.memory.structure_controllers = [];
Game.spawns.s1.memory.structure_labs = [];
Game.spawns.s1.memory.structure_links = [];
Game.spawns.s1.memory.structure_nukers = [];
Game.spawns.s1.memory.structure_observers = [];
Game.spawns.s1.memory.structure_power_spawns = [];
Game.spawns.s1.memory.structure_ramparts = [];
Game.spawns.s1.memory.structure_roads = [];
Game.spawns.s1.memory.structure_spawns = [];
Game.spawns.s1.memory.structure_storages = [];
Game.spawns.s1.memory.structure_terminals = [];
Game.spawns.s1.memory.structure_towers = [];
Game.spawns.s1.memory.structure_walls = [];
Game.spawns.s1.memory.structure_extensions = [];
Game.spawns.s1.memory.structure_extractors = [];

Game.spawns.s1.memory.repaire_towers = [];
Game.spawns.s1.memory.repaire_storages = [];
Game.spawns.s1.memory.repaire_extractors = [];
Game.spawns.s1.memory.repaire_extensions = [];
Game.spawns.s1.memory.repaire_spawns = [];
Game.spawns.s1.memory.repaire_containers = [];
Game.spawns.s1.memory.repaire_controllers = [];
Game.spawns.s1.memory.repaire_labs = [];
Game.spawns.s1.memory.repaire_links = [];
Game.spawns.s1.memory.repaire_nukers = [];
Game.spawns.s1.memory.repaire_observers = [];
Game.spawns.s1.memory.repaire_power_spawns = [];
Game.spawns.s1.memory.repaire_ramparts = [];
Game.spawns.s1.memory.repaire_terminals = [];
Game.spawns.s1.memory.repaire_walls = [];
Game.spawns.s1.memory.repaire_roads = [];

Game.spawns.s1.memory.mineralMineID = "";
*/

Game.spawns.s1.memory.objectsRecalcNecessarilyTick = 60;

//------------------------------------------------------------------------------
module.exports =
{
    get_wall_hits_amount: function()
    {
      return WALL_HITS_AMOUNT;
    },
    //--------------------------------------------------------------------------
    clear_objects : function()
    {
      Game.spawns.s1.memory.construction_containers = [];
      Game.spawns.s1.memory.construction_controllers = [];
      Game.spawns.s1.memory.construction_labs = [];
      Game.spawns.s1.memory.construction_links = [];
      Game.spawns.s1.memory.construction_nukers = [];
      Game.spawns.s1.memory.construction_observers = [];
      Game.spawns.s1.memory.construction_power_spawns = [];
      Game.spawns.s1.memory.construction_ramparts = [];
      Game.spawns.s1.memory.construction_roads = [];
      Game.spawns.s1.memory.construction_spawns = [];
      Game.spawns.s1.memory.construction_storages = [];
      Game.spawns.s1.memory.construction_terminals = [];
      Game.spawns.s1.memory.construction_towers = [];
      Game.spawns.s1.memory.construction_walls = [];
      Game.spawns.s1.memory.construction_extensions = [];
      Game.spawns.s1.memory.construction_extractors = [];

      Game.spawns.s1.memory.structure_containers = [];
      Game.spawns.s1.memory.structure_controllers = [];
      Game.spawns.s1.memory.structure_labs = [];
      Game.spawns.s1.memory.structure_links = [];
      Game.spawns.s1.memory.structure_nukers = [];
      Game.spawns.s1.memory.structure_observers = [];
      Game.spawns.s1.memory.structure_power_spawns = [];
      Game.spawns.s1.memory.structure_ramparts = [];
      Game.spawns.s1.memory.structure_roads = [];
      Game.spawns.s1.memory.structure_spawns = [];
      Game.spawns.s1.memory.structure_storages = [];
      Game.spawns.s1.memory.structure_terminals = [];
      Game.spawns.s1.memory.structure_towers = [];
      Game.spawns.s1.memory.structure_walls = [];
      Game.spawns.s1.memory.structure_extensions = [];
      Game.spawns.s1.memory.structure_extractors = [];

      Game.spawns.s1.memory.repaire_towers = [];
      Game.spawns.s1.memory.repaire_storages = [];
      Game.spawns.s1.memory.repaire_extractors = [];
      Game.spawns.s1.memory.repaire_extensions = [];
      Game.spawns.s1.memory.repaire_spawns = [];
      Game.spawns.s1.memory.repaire_containers = [];
      Game.spawns.s1.memory.repaire_controllers = [];
      Game.spawns.s1.memory.repaire_labs = [];
      Game.spawns.s1.memory.repaire_links = [];
      Game.spawns.s1.memory.repaire_nukers = [];
      Game.spawns.s1.memory.repaire_observers = [];
      Game.spawns.s1.memory.repaire_power_spawns = [];
      Game.spawns.s1.memory.repaire_ramparts = [];
      Game.spawns.s1.memory.repaire_terminals = [];
      Game.spawns.s1.memory.repaire_walls = [];
      Game.spawns.s1.memory.repaire_roads = [];

      Game.spawns.s1.memory.mineralMineID = "";
    },
    //--------------------------------------------------------------------------
    recalculate_objects : function()
    {
      var elapsed = Game.time - Game.spawns.s1.memory.lastRecalculatedTime;
      //console.log("elapsed = " + elapsed + " : " + Game.spawns.s1.memory.objectsRecalcNecessarilyTick);

      if (Game.spawns.s1.memory.structuresIsRecalc == false)
       if (elapsed < Game.spawns.s1.memory.objectsRecalcNecessarilyTick)
         return;

      Game.spawns.s1.memory.lastRecalculatedTime = Game.time;

      this.clear_objects();

      if(Game.spawns.s1.memory.energyResourcesID.length == 0 )
      {
        var fsrc   = Game.spawns.s1.room.find(FIND_SOURCES);

        for(var i in fsrc)
          Game.spawns.s1.memory.energyResourcesID.push(fsrc[i].id);

        Game.spawns.s1.memory.sourceID = 0;
        Game.spawns.s1.memory.sourceCount = Game.spawns.s1.memory.energyResourcesID.length;

        console.log("resources recalculate!");
      }

      var minerals = Game.spawns.s1.room.find(FIND_MINERALS);
      if(minerals.length > 0)
        Game.spawns.s1.memory.mineralMineID = minerals[0].id;

      var res = Game.spawns.s1.room.find(FIND_STRUCTURES);
      for (var i in res)
      {
        switch(res[i].structureType)
        {
          case 'constructedWall':
          {
            Game.spawns.s1.memory.structure_walls.push(res[i].id);
            if(res[i].hits < WALL_HITS_AMOUNT)
              Game.spawns.s1.memory.repaire_walls.push(res[i].id);
            break;
          }
          case 'spawn':
          {
            Game.spawns.s1.memory.structure_spawns.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_spawns.push(res[i].id);
            break;
          }
          case 'extension':
          {
            Game.spawns.s1.memory.structure_extensions.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_extensions.push(res[i].id);
            break;
          }
          case 'rampart':
          {
            Game.spawns.s1.memory.structure_ramparts.push(res[i].id);
            if(res[i].hits < RAMPART_HITS_AMOUNT)
              Game.spawns.s1.memory.repaire_ramparts.push(res[i].id);
            break;
          }
          case 'link':
          {
            Game.spawns.s1.memory.structure_links.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_links.push(res[i].id);
            break;
          }
          case 'storage':
          {
            Game.spawns.s1.memory.structure_storages.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_storages.push(res[i].id);
            break;
          }
          case 'tower':
          {
            Game.spawns.s1.memory.structure_towers.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_towers.push(res[i].id);
            break;
          }
          case 'observer':
          {
            Game.spawns.s1.memory.structure_observers.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_observers.push(res[i].id);
            break;
          }
          case 'powerSpawn':
          {
            Game.spawns.s1.memory.structure_power_spawns.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_power_spawns.push(res[i].id);
            break;
          }
          case 'extractor':
          {
            Game.spawns.s1.memory.structure_extractors.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_extractors.push(res[i].id);
            break;
          }
          case 'lab':
          {
            Game.spawns.s1.memory.structure_labs.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_labs.push(res[i].id);
            break;
          }
          case 'terminal':
          {
            Game.spawns.s1.memory.structure_terminals.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_terminals.push(res[i].id);
            break;
          }
          case 'container':
          {
            Game.spawns.s1.memory.structure_containers.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_containers.push(res[i].id);
            break;
          }
          case 'nuker':
          {
            Game.spawns.s1.memory.structure_nukers.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_nukers.push(res[i].id);
            break;
          }
          case 'road':
          {
            Game.spawns.s1.memory.structure_roads.push(res[i].id);
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_roads.push(res[i].id);
            break;
          }
          case 'controller':
          {
            if(res[i].hits < res[i].hitsMax)
              Game.spawns.s1.memory.repaire_controllers.push(res[i].id);
            break;
          }
          default:
          {
            console.log("recalculate_objects_for_repair : UNKNOWN " +  res[i].structureType);
            break;
          }
        }
      }

      var res = Game.spawns.s1.room.find(FIND_CONSTRUCTION_SITES);
      for (var i in res)
      {
        switch(res[i].structureType)
        {
          case 'constructedWall': Game.spawns.s1.memory.construction_walls.push(res[i].id);        break;
          case 'spawn':           Game.spawns.s1.memory.construction_spawns.push(res[i].id);       break;
          case 'extension':       Game.spawns.s1.memory.construction_extensions.push(res[i].id);   break;
          case 'rampart':         Game.spawns.s1.memory.construction_ramparts.push(res[i].id);     break;
          case 'link':            Game.spawns.s1.memory.construction_links.push(res[i].id);        break;
          case 'storage':         Game.spawns.s1.memory.construction_storages.push(res[i].id);     break;
          case 'tower':           Game.spawns.s1.memory.construction_towers.push(res[i].id);       break;
          case 'observer':        Game.spawns.s1.memory.construction_observers.push(res[i].id);    break;
          case 'powerSpawn':      Game.spawns.s1.memory.construction_power_spawns.push(res[i].id); break;
          case 'extractor':       Game.spawns.s1.memory.construction_extractors.push(res[i].id);   break;
          case 'lab':             Game.spawns.s1.memory.construction_labs.push(res[i].id);         break;
          case 'terminal':        Game.spawns.s1.memory.construction_terminals.push(res[i].id);    break;
          case 'container':       Game.spawns.s1.memory.construction_containers.push(res[i].id);   break;
          case 'nuker':           Game.spawns.s1.memory.construction_nukers.push(res[i].id);       break;
          case 'road':            Game.spawns.s1.memory.construction_roads.push(res[i].id);        break;
          case 'controller':      Game.spawns.s1.memory.construction_controllers.push(res[i].id);  break;
          default:
          {
            console.log("recalculate_objects_for_build : UNKNOWN " +  res[i].structureType);
            break;
          }
        }
      }
      Game.spawns.s1.memory.structuresIsRecalc = false;
      console.log("All object was recalculated!");
    },
    //--------------------------------------------------------------------------
    get_towers : function()
    {
      return Game.spawns.s1.memory.structure_towers;
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
    get_build_object_id : function()
    {
      if(Game.spawns.s1.memory.construction_towers.length > 0)        return Game.spawns.s1.memory.construction_towers[0];
      if(Game.spawns.s1.memory.construction_extensions.length > 0)    return Game.spawns.s1.memory.construction_extensions[0];
      if(Game.spawns.s1.memory.construction_storages.length > 0)      return Game.spawns.s1.memory.construction_storages[0];
      if(Game.spawns.s1.memory.construction_roads.length > 0)         return Game.spawns.s1.memory.construction_roads[0];
      if(Game.spawns.s1.memory.construction_spawns.length > 0)        return Game.spawns.s1.memory.construction_spawns[0];
      if(Game.spawns.s1.memory.construction_containers.length > 0)    return Game.spawns.s1.memory.construction_containers[0];
      if(Game.spawns.s1.memory.construction_controllers.length > 0)   return Game.spawns.s1.memory.construction_controllers[0];
      if(Game.spawns.s1.memory.construction_labs.length > 0)          return Game.spawns.s1.memory.construction_labs[0];
      if(Game.spawns.s1.memory.construction_links.length > 0)         return Game.spawns.s1.memory.construction_links[0];
      if(Game.spawns.s1.memory.construction_nukers.length > 0)        return Game.spawns.s1.memory.construction_nukers[0];
      if(Game.spawns.s1.memory.construction_observers.length > 0)     return Game.spawns.s1.memory.construction_observers[0];
      if(Game.spawns.s1.memory.construction_power_spawns.length > 0)  return Game.spawns.s1.memory.construction_power_spawns[0];
      if(Game.spawns.s1.memory.construction_ramparts.length > 0)      return Game.spawns.s1.memory.construction_ramparts[0];
      if(Game.spawns.s1.memory.construction_terminals.length > 0)     return Game.spawns.s1.memory.construction_terminals[0];
      if(Game.spawns.s1.memory.construction_extractors.length > 0)    return Game.spawns.s1.memory.construction_extractors[0];
      if(Game.spawns.s1.memory.construction_walls.length > 0)         return Game.spawns.s1.memory.construction_walls[0];

      return "";
    },
    //--------------------------------------------------------------------------
    get_extractor_id : function()
    {
      if(Game.spawns.s1.memory.structure_extractors.length > 0)    return Game.spawns.s1.memory.structure_extractors[0];
      return "";
    },
    //--------------------------------------------------------------------------
    get_repair_object_id_for_builder : function()
    {
      if(Game.spawns.s1.memory.repaire_towers.length > 0)       return Game.spawns.s1.memory.repaire_towers[0];
      if(Game.spawns.s1.memory.repaire_ramparts.length > 0)     return Game.spawns.s1.memory.repaire_ramparts[0];
      if(Game.spawns.s1.memory.repaire_walls.length > 0)        return Game.spawns.s1.memory.repaire_walls[0];
      //if(Game.spawns.s1.memory.repaire_storages.length > 0)     return Game.spawns.s1.memory.repaire_storages[0];
      //if(Game.spawns.s1.memory.repaire_containers.length > 0)   return Game.spawns.s1.memory.repaire_containers[0];
      //if(Game.spawns.s1.memory.repaire_labs.length > 0)         return Game.spawns.s1.memory.repaire_labs[0];
      // if(Game.spawns.s1.memory.repaire_links.length > 0)       return Game.spawns.s1.memory.repaire_links[0];
      //if(Game.spawns.s1.memory.repaire_roads.length > 0)        return Game.spawns.s1.memory.repaire_roads[0];
      //if(Game.spawns.s1.memory.repaire_nukers.length > 0)       return Game.spawns.s1.memory.repaire_nukers[0];
      //if(Game.spawns.s1.memory.repaire_observers.length > 0)    return Game.spawns.s1.memory.repaire_observers[0];
      //if(Game.spawns.s1.memory.repaire_power_spawns.length > 0) return Game.spawns.s1.memory.repaire_power_spawns[0];
      //if(Game.spawns.s1.memory.repaire_terminals.length > 0)    return Game.spawns.s1.memory.repaire_terminals[0];
      //if(Game.spawns.s1.memory.repaire_extensions.length > 0)   return Game.spawns.s1.memory.repaire_extensions[0];
      //if(Game.spawns.s1.memory.repaire_extractors.length > 0)   return Game.spawns.s1.memory.repaire_extractors[0];
      //console.log("obj repair for builder not find");
      return "";
    },
    //--------------------------------------------------------------------------
    get_repair_container_id : function()
    {
      if(Game.spawns.s1.memory.repaire_containers.length > 0)
      {
        for(var i in Game.spawns.s1.memory.repaire_containers)
        {
          var container = Game.getObjectById(Game.spawns.s1.memory.repaire_containers[i]);
          if(container.hits < container.hitsMax)
            return Game.spawns.s1.memory.repaire_containers[i];
        }
      }
      return "";
    },
    //--------------------------------------------------------------------------
    get_repair_road_id : function()
    {
      if(Game.spawns.s1.memory.repaire_roads.length > 0)
      {
        for(var i in Game.spawns.s1.memory.repaire_roads)
        {
          var road = Game.getObjectById(Game.spawns.s1.memory.repaire_roads[i]);
          if(road.hits < road.hitsMax)
            return Game.spawns.s1.memory.repaire_roads[i];
        }
      }
      return "";
    },
    //--------------------------------------------------------------------------
    get_storage_id : function()
    {
      if(Game.spawns.s1.memory.structure_storages.length > 0)
        return Game.spawns.s1.memory.structure_storages[0];
      return "";
    },
    //--------------------------------------------------------------------------
    get_store_with_max_energy : function()
    {
      var max = 0;
      var tmp = 0;
      var id = "";
      for(var i in Game.spawns.s1.memory.structure_extensions)
      {
        tmp = Game.getObjectById(Game.spawns.s1.memory.structure_extensions[i])[RESOURCE_ENERGY];
        if(tmp > max)
        {
          max = tmp;
          id = Game.spawns.s1.memory.structure_extensions[i];
        }
      }

      for(var i in Game.spawns.s1.memory.structure_containers)
      {
        tmp = Game.getObjectById(Game.spawns.s1.memory.structure_containers[i])[RESOURCE_ENERGY];
        if(tmp > max)
        {
          max = tmp;
          id = Game.spawns.s1.memory.structure_containers[i];
        }
      }

      for(var i in Game.spawns.s1.memory.structure_storages)
      {
        tmp = Game.getObjectById(Game.spawns.s1.memory.structure_storages[i]).store[RESOURCE_ENERGY];
        if(tmp > max)
        {
          max = tmp;
          id = Game.spawns.s1.memory.structure_storages[i];
        }
      }

      //if(id.length == 0)
      //  console.log("get_store_with_max_energy: NOT FOUND");
      return id;
    },
    //--------------------------------------------------------------------------
    get_store_id_for_trancfer_for_harvester : function()
    {
      var id = "";
      for(var i in Game.spawns.s1.memory.structure_extensions)
      {
        id = Game.spawns.s1.memory.structure_extensions[i];
        var obj = Game.getObjectById(id);
        if(obj.energy < obj.energyCapacity )
          return id;
      }

      id = "";
      for(var i in Game.spawns.s1.memory.structure_storages)
      {
        id = Game.spawns.s1.memory.structure_storages[i];
        var obj = Game.getObjectById(id);
        if(obj.store[RESOURCE_ENERGY] < obj.storeCapacity)
          return id;
      }

      id = "";
      for(var i in Game.spawns.s1.memory.structure_containers)
      {
        id = Game.spawns.s1.memory.structure_containers[i];
        var obj = Game.getObjectById(id);
        if(obj.store[RESOURCE_ENERGY] < obj.storeCapacity)
          return id;
      }

      Game.spawns.s1.memory.structuresIsRecalc = true;
      console.log("Not found store for transfering for harvester");
      return id;
    },
    //--------------------------------------------------------------------------
    get_tower_id_with_not_full_energy : function()
    {
      for(var i in Game.spawns.s1.memory.structure_towers)
      {
        var id = Game.spawns.s1.memory.structure_towers[i];
        var obj = Game.getObjectById(id);

        if(obj.energy < obj.energyCapacity)
          return id;
      }
      return "";
    },
    //--------------------------------------------------------------------------
    is_owner_of_creep : function(cr_name)
    {
      return (Game.creeps[cr_name].memory.spawnID == SPAWN1_ID);
    },
    //--------------------------------------------------------------------------
    calc_energy : function()
    {
      s1_energy            = 0;
      s1_energy_capacity   = 0;
      s1_energy            += Game.spawns.s1.energy;
      s1_energy_capacity   += Game.spawns.s1.energyCapacity;

      for(var i in Game.spawns.s1.memory.structure_extensions)
      {
        s1_energy += Game.getObjectById(Game.spawns.s1.memory.structure_extensions[i]).energy;
        s1_energy_capacity+= Game.getObjectById(Game.spawns.s1.memory.structure_extensions[i]).energyCapacity;
      }
      //console.log("energy = " + s1_energy + ", capacity = " + s1_energy_capacity);
    },
    //--------------------------------------------------------------------------
    get_source_id : function()
    {
      if(Game.spawns.s1.memory.sourceID >= Game.spawns.s1.memory.sourceCount)
        Game.spawns.s1.memory.sourceID = 0;
      var res = Game.spawns.s1.memory.energyResourcesID[Game.spawns.s1.memory.sourceID];
      Game.spawns.s1.memory.sourceID++;

      return res;
    },
    //--------------------------------------------------------------------------
    get_enemies : function()
    {
      if(Game.spawns.s1.memory.attach_check == COUNT_TICKS_FOR_ATTACK_CHECK)
      {
        var enemy_targets = Game.spawns.s1.room.find(FIND_HOSTILE_CREEPS);
        if(enemy_targets.length > 0)
            return enemy_targets;
        else
            return null;
        Game.spawns.s1.memory.attach_check = 0;
      }
      else
        Game.spawns.s1.memory.attach_check++;

      return null;
    }
};
