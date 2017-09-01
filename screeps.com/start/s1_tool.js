//------------------------------------------------------------------------------
const SPAWN1_ID = 1;

//var s1                 = null;
var s1_energy_capacity = 0;
var s1_energy          = 0;

var WALL_HITS_AMOUNT    = 100000; // 100k
var RAMPART_HITS_AMOUNT = 200000; // 200k
var COUNT_TICKS_FOR_ATTACK_CHECK = 10;

Game.spawns.s1.memory.energyResourcesID_0_Pos = [];
Game.spawns.s1.memory.energyResourcesID[0] = [];
Game.spawns.s1.memory.m1_energyResourcesID_0_Current = 0;
Game.spawns.s1.memory.m2_energyResourcesID_0_Current = 0;
Game.spawns.s1.memory.energyResourcesID = [];
Game.spawns.s1.memory.energyResourcesID[0] = '5982fc8db097071b4adbdb6e';
Game.spawns.s1.memory.energyResourcesID_0_Max = 3;
Game.spawns.s1.memory.energyResourcesID_0_Pos[0] = 5; // X
Game.spawns.s1.memory.energyResourcesID_0_Pos[1] = 11; // Y


Game.spawns.s1.memory.energyResourcesID_1_Pos = [];
Game.spawns.s1.memory.m1_energyResourcesID_1_Current = 0;
Game.spawns.s1.memory.m2_energyResourcesID_1_Current = 0;
Game.spawns.s1.memory.energyResourcesID = [];
Game.spawns.s1.memory.energyResourcesID[1] = '5982fc8db097071b4adbdb6f';
Game.spawns.s1.memory.energyResourcesID_1_Max = 2;
Game.spawns.s1.memory.energyResourcesID_1_Pos[0] = 10; // X
Game.spawns.s1.memory.energyResourcesID_1_Pos[1] = 25; // Y

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

Game.spawns.s1.memory.isStatisticMemory1 = true;
Game.spawns.s1.memory.sHr_m1_to_harvest    = 0;
Game.spawns.s1.memory.sHr_m1_harvest       = 0;
Game.spawns.s1.memory.sHr_m1_transfer_calc = 0;
Game.spawns.s1.memory.sHr_m1_transfer      = 0;

Game.spawns.s1.memory.sBld_m1_findResource= 0;
Game.spawns.s1.memory.sBld_m1_toEnergy    = 0;
Game.spawns.s1.memory.sBld_m1_toRepair    = 0;
Game.spawns.s1.memory.sBld_m1_Repair      = 0;
Game.spawns.s1.memory.sBld_m1_toBuild     = 0;
Game.spawns.s1.memory.sBld_m1_Build       = 0;
Game.spawns.s1.memory.sBld_m1_toHarvest   = 0;
Game.spawns.s1.memory.sBld_m1_harvest     = 0;

Game.spawns.s1.memory.sRCU_m1_toHarvest = 0;
Game.spawns.s1.memory.sRCU_m1_harvest   = 0;
Game.spawns.s1.memory.sBld_m1_toUpgrade = 0;
Game.spawns.s1.memory.sBld_m1_Upgrade   = 0;

Game.spawns.s1.memory.sHr_m2_to_harvest   = 0;
Game.spawns.s1.memory.sHr_m2_harvest      = 0;
Game.spawns.s1.memory.sHr_m2_transfer_calc= 0;
Game.spawns.s1.memory.sHr_m2_transfer     = 0;

Game.spawns.s1.memory.sBld_m2_findResource= 0;
Game.spawns.s1.memory.sBld_m2_toEnergy    = 0;
Game.spawns.s1.memory.sBld_m2_toRepair    = 0;
Game.spawns.s1.memory.sBld_m2_Repair      = 0;
Game.spawns.s1.memory.sBld_m2_toBuild     = 0;
Game.spawns.s1.memory.sBld_m2_Build       = 0;
Game.spawns.s1.memory.sBld_m2_toHarvest   = 0;
Game.spawns.s1.memory.sBld_m2_harvest     = 0;

Game.spawns.s1.memory.sRCU_m2_toHarvest = 0;
Game.spawns.s1.memory.sRCU_m2_harvest   = 0;
Game.spawns.s1.memory.sBld_m2_toUpgrade = 0;
Game.spawns.s1.memory.sBld_m2_Upgrade   = 0;

Game.spawns.s1.memory.mineralMineID = "";

Game.spawns.s1.memory.m1_energyResourcesID_0_Current = 0;
Game.spawns.s1.memory.m2_energyResourcesID_0_Current = 0;
Game.spawns.s1.memory.m1_energyResourcesID_1_Current = 0;
Game.spawns.s1.memory.m2_energyResourcesID_1_Current = 0;

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
        Game.spawns.s1.memory.attach_check = 0;

        var enemy_targets = Game.spawns.s1.room.find(FIND_HOSTILE_CREEPS);
        if(enemy_targets.length > 0)
        {
            var enemiesRes = [];
            for(var i in enemy_targets)
              enemiesRes.push(enemy_targets[i].id);
        }
        else
            return [];
      }
      else
        Game.spawns.s1.memory.attach_check++;

      return [];
    },
    //--------------------------------------------------------------------------
    distance_calc : function(pos1, pos2)
    {
      var v1 = (pos1.x - pos2.x);
      var v2 = (pos1.y - pos2.y);
      return v1*v1 + v2*v2;
    },
    //--------------------------------------------------------------------------
    get_nearest_not_empty_store_energy_id : function(creepObj)
    {
      var res = "";
      var tmp_arr = [];

      for(var i in Game.spawns.s1.memory.structure_extensions)
      {
        var id = Game.spawns.s1.memory.structure_extensions[i];
        tmp = Game.getObjectById(id)[RESOURCE_ENERGY];
        if(tmp > 100)
          tmp_arr.push(id);
      }
      res = this.get_nearest_object_id(creepObj, tmp_arr);
      if(res.length > 0)
        return res;

      for(var i in Game.spawns.s1.memory.structure_containers)
      {
        var id = Game.spawns.s1.memory.structure_containers[i];
        tmp = Game.getObjectById(id)[RESOURCE_ENERGY];
        if(tmp > 100)
          tmp_arr.push(id);
      }
      res = this.get_nearest_object_id(creepObj, tmp_arr);
      if(res.length > 0)
        return res;

      for(var i in Game.spawns.s1.memory.structure_storages)
      {
        var id = Game.spawns.s1.memory.structure_storages[i];
        tmp = Game.getObjectById(id)[RESOURCE_ENERGY];
        if(tmp > 100)
          tmp_arr.push(id);
      }
      res = this.get_nearest_object_id(creepObj, tmp_arr);
      if(res.length > 0)
        return res;

      return "";
    },
    //--------------------------------------------------------------------------
    get_nearest_store_for_transfer_id : function(creepObj)
    {
      var res = "";
      var tmp_arr = [];

      for(var i in Game.spawns.s1.memory.structure_extensions)
      {
        id = Game.spawns.s1.memory.structure_extensions[i];
        var obj = Game.getObjectById(id);
        if(obj.energy < obj.energyCapacity )
          tmp_arr.push(id);
      }
      res = this.get_nearest_object_id(creepObj, tmp_arr);
      if(res.length > 0)
        return res;

      for(var i in Game.spawns.s1.memory.structure_storages)
      {
        id = Game.spawns.s1.memory.structure_storages[i];
        var obj = Game.getObjectById(id);
        if(obj.store[RESOURCE_ENERGY] < obj.storeCapacity)
          tmp_arr.push(id);
      }
      res = this.get_nearest_object_id(creepObj, tmp_arr);
      if(res.length > 0)
        return res;

      for(var i in Game.spawns.s1.memory.structure_containers)
      {
        id = Game.spawns.s1.memory.structure_containers[i];
        var obj = Game.getObjectById(id);
        if(obj.store[RESOURCE_ENERGY] < obj.storeCapacity)
          tmp_arr.push(id);
      }
      res = this.get_nearest_object_id(creepObj, tmp_arr);
      if(res.length > 0)
        return res;

      return "";
    },
    //--------------------------------------------------------------------------
    get_nearest_not_full_tower_id : function(creepObj)
    {
      var res = "";
      var tmp_arr = [];

      for(var i in Game.spawns.s1.memory.structure_towers)
      {
        var id = Game.spawns.s1.memory.structure_towers[i];
        var obj = Game.getObjectById(id);

        if(obj.energy < obj.energyCapacity)
          tmp_arr.push(id);
      }

      res = this.get_nearest_object_id(creepObj, tmp_arr);

      return res;

    },
    //--------------------------------------------------------------------------
    get_nearest_build_id : function(creepObj)
    {
      var res = "";

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_towers);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_extensions);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_storages);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_ramparts);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_walls);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_containers);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_controllers);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_labs);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_links);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_nukers);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_observers);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_power_spawns);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_roads);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_spawns);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_terminals);
      if(res.length > 0)
        return res;

      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.construction_extractors);
      if(res.length > 0)
        return res;

      return "";
    },
    //--------------------------------------------------------------------------
    get_nearest_energy_source_id : function(creepObj)
    {
      var tmp_arr = [];
      var id = "";
      var res = "";
      for(var i in Game.spawns.s1.memory.energyResourcesID)
      {
        id = Game.spawns.s1.memory.energyResourcesID[i];
        tmp_arr.push(id);
      }

      res = this.get_nearest_object_id(creepObj, tmp_arr);
      return res;
    },
    //--------------------------------------------------------------------------
    get_nearest_object_id : function(creepObj, struct_array)
    {
      if(struct_array.length > 0)
      {
        if(struct_array.length == 1)
          return struct_array[0];

        var creepPos = creepObj.pos;
        var min      = 1000000;
        var min_id   = "";

        for(var i in struct_array)
        {
          var obj = Game.getObjectById(struct_array[i]);
          if(obj)
          {
            var obj_pos = Game.getObjectById(struct_array[i]).pos;

            var dist = this.distance_calc(creepPos, obj_pos);
            if( dist < min)
            {
              min = dist;
              min_id = struct_array[i];
            }
          }
        }
        return min_id;
      }
      return "";
    },
    //--------------------------------------------------------------------------
    get_max_count_on_res_by_id : function(id)
    {
      if(id == Game.spawns.s1.memory.energyResourcesID[0])
        return Game.spawns.s1.memory.energyResourcesID_0_Max;

      if(id == Game.spawns.s1.memory.energyResourcesID[1])
        return Game.spawns.s1.memory.energyResourcesID_1_Max;
      return 0;
    },
    //--------------------------------------------------------------------------
    get_res_busy_by_id : function(id)
    {
      //console.log("0 = " + Game.spawns.s1.memory.m2_energyResourcesID_0_Current);
      //console.log("1 = " + Game.spawns.s1.memory.m2_energyResourcesID_1_Current);

      if(id == Game.spawns.s1.memory.energyResourcesID[0])
        return Game.spawns.s1.memory.m2_energyResourcesID_0_Current;

      if(id == Game.spawns.s1.memory.energyResourcesID[1])
        return Game.spawns.s1.memory.m2_energyResourcesID_1_Current;
    },
    //--------------------------------------------------------------------------
    get_wait_point_pos_by_id : function(id)
    {
      if(id == Game.spawns.s1.memory.energyResourcesID[0])
        return Game.spawns.s1.memory.energyResourcesID_0_Pos;

      if(id == Game.spawns.s1.memory.energyResourcesID[1])
        return Game.spawns.s1.memory.energyResourcesID_1_Pos;
    },
    //--------------------------------------------------------------------------
    builder_statistic_update : function(builder)
    {
      var m = builder.memory;

      switch(m.state)
      {
        case 0://FIND_RESOURCE  : 0
        case 2://TAKE_ENERGY    : 2
        case 3://FIND_REPAIR    : 3
        case 6://FIND_BUILD     : 6
        case 9://RECALCULATE    : 9
        case 10://FIND_FARM      : 10
          break;
        case 1://TO_ENERGY      : 1
        {
          Game.spawns.s1.memory.sBld_m1_toEnergy++;
          break;
        }
        case 4://TO_REPAIR      : 4
        {
          Game.spawns.s1.memory.sBld_m1_toRepair++;
          break;
        }
        case 5://REPAIR         : 5
        {
          Game.spawns.s1.memory.sBld_m1_Repair++;
          break;
        }
        case 7://TO_BUILD       : 7
        {
          Game.spawns.s1.memory.sBld_m1_toBuild++;
          break;
        }
        case 8://BUILD          : 8
        {
          Game.spawns.s1.memory.sBld_m1_Build++;
          break;
        }
        case 11://TO_HARVEST     : 11
        {
          Game.spawns.s1.memory.sBld_m1_toHarvest++;
          break;
        }
        case 12://HARVEST        : 12
        {
          Game.spawns.s1.memory.sBld_m1_harvest++;

          if(m.resourceID == Game.spawns.s1.memory.energyResourcesID[0])
            Game.spawns.s1.memory.m1_energyResourcesID_0_Current++;
          else if(m.resourceID == Game.spawns.s1.memory.energyResourcesID[1])
            Game.spawns.s1.memory.m1_energyResourcesID_1_Current++;
          break;
        }
      }
    },
    //--------------------------------------------------------------------------
    harvester_statistic_update : function(harvester)
    {
      var m = harvester.memory;

      switch(m.state)
      {
        case 0: // STATE.FIND_RESOURCE:
        {
          break;
        }
        case 1: // STATE.TO_HARVEST:
        {
          Game.spawns.s1.memory.sHr_m1_to_harvest++;
          break;
        }
        case 2: // STATE.HARVEST:
        {
          Game.spawns.s1.memory.sHr_m1_harvest++;

          if(m.resourceID == Game.spawns.s1.memory.energyResourcesID[0])
            Game.spawns.s1.memory.m1_energyResourcesID_0_Current++;
          else if(m.resourceID == Game.spawns.s1.memory.energyResourcesID[1])
            Game.spawns.s1.memory.m1_energyResourcesID_1_Current++;

          break;
        }
        case 3: // STATE.TRANSFER_CALCULATE:
        {
          Game.spawns.s1.memory.sHr_m1_transfer_calc++;
          break;
        }
        case 4: // STATE.TRANCFERING:
        {
          Game.spawns.s1.memory.sHr_m1_transfer++;
          break;
        }
      }
    },
    //--------------------------------------------------------------------------
    rcl_upgrader_statistic_update : function(upgrader)
    {
      var m = upgrader.memory;

      switch(m.state)
      {
        case 0: //FIND_RESOURCE : 0
          break;
        case 1: //TO_HARVEST    : 1
        {
          Game.spawns.s1.memory.sRCU_m1_toHarvest++;
          break;
        }
        case 2: //HARVEST       : 2
        {
          Game.spawns.s1.memory.sRCU_m1_harvest++;

          if(m.resourceID == Game.spawns.s1.memory.energyResourcesID[0])
            Game.spawns.s1.memory.m1_energyResourcesID_0_Current++;
          else if(m.resourceID == Game.spawns.s1.memory.energyResourcesID[1])
            Game.spawns.s1.memory.m1_energyResourcesID_1_Current++;
          break;
        }
        case 3: //TO_UPGRADE    : 3
        {
          Game.spawns.s1.memory.sBld_m1_toUpgrade++;
          break;
        }
        case 4: //UPGRADE       : 4
        {
          Game.spawns.s1.memory.sBld_m1_Upgrade++;
          break;
        }
      }
    },
    //--------------------------------------------------------------------------
    statistic_update : function()
    {
      if(Game.spawns.s1.memory.isStatisticMemory1 == null)
      {
        Game.spawns.s1.memory.isStatisticMemory1 = true;
        Game.spawns.s1.memory.sHr_m1_to_harvest    = 0;
        Game.spawns.s1.memory.sHr_m1_harvest       = 0;
        Game.spawns.s1.memory.sHr_m1_transfer_calc = 0;
        Game.spawns.s1.memory.sHr_m1_transfer      = 0;

        Game.spawns.s1.memory.sBld_m1_findResource= 0;
        Game.spawns.s1.memory.sBld_m1_toEnergy    = 0;
        Game.spawns.s1.memory.sBld_m1_toRepair    = 0;
        Game.spawns.s1.memory.sBld_m1_Repair      = 0;
        Game.spawns.s1.memory.sBld_m1_toBuild     = 0;
        Game.spawns.s1.memory.sBld_m1_Build       = 0;
        Game.spawns.s1.memory.sBld_m1_toHarvest   = 0;
        Game.spawns.s1.memory.sBld_m1_harvest     = 0;

        Game.spawns.s1.memory.sRCU_m1_toHarvest = 0;
        Game.spawns.s1.memory.sRCU_m1_harvest   = 0;
        Game.spawns.s1.memory.sBld_m1_toUpgrade = 0;
        Game.spawns.s1.memory.sBld_m1_Upgrade   = 0;

        Game.spawns.s1.memory.sHr_m2_to_harvest   = 0;
        Game.spawns.s1.memory.sHr_m2_harvest      = 0;
        Game.spawns.s1.memory.sHr_m2_transfer_calc= 0;
        Game.spawns.s1.memory.sHr_m2_transfer     = 0;

        Game.spawns.s1.memory.sBld_m2_findResource= 0;
        Game.spawns.s1.memory.sBld_m2_toEnergy    = 0;
        Game.spawns.s1.memory.sBld_m2_toRepair    = 0;
        Game.spawns.s1.memory.sBld_m2_Repair      = 0;
        Game.spawns.s1.memory.sBld_m2_toBuild     = 0;
        Game.spawns.s1.memory.sBld_m2_Build       = 0;
        Game.spawns.s1.memory.sBld_m2_toHarvest   = 0;
        Game.spawns.s1.memory.sBld_m2_harvest     = 0;

        Game.spawns.s1.memory.sRCU_m2_toHarvest = 0;
        Game.spawns.s1.memory.sRCU_m2_harvest   = 0;
        Game.spawns.s1.memory.sBld_m2_toUpgrade = 0;
        Game.spawns.s1.memory.sBld_m2_Upgrade   = 0;
      }

      Game.spawns.s1.memory.sHr_m2_to_harvest   = Game.spawns.s1.memory.sHr_m1_to_harvest;
      Game.spawns.s1.memory.sHr_m2_harvest      = Game.spawns.s1.memory.sHr_m1_harvest;
      Game.spawns.s1.memory.sHr_m2_transfer_calc= Game.spawns.s1.memory.sHr_m1_transfer_calc;
      Game.spawns.s1.memory.sHr_m2_transfer     = Game.spawns.s1.memory.sHr_m1_transfer;

      Game.spawns.s1.memory.sBld_m2_toEnergy    = Game.spawns.s1.memory.sBld_m1_toEnergy;
      Game.spawns.s1.memory.sBld_m2_toRepair    = Game.spawns.s1.memory.sBld_m1_toRepair;
      Game.spawns.s1.memory.sBld_m2_Repair      = Game.spawns.s1.memory.sBld_m1_Repair;
      Game.spawns.s1.memory.sBld_m2_toBuild     = Game.spawns.s1.memory.sBld_m1_toBuild;
      Game.spawns.s1.memory.sBld_m2_Build       = Game.spawns.s1.memory.sBld_m1_Build;
      Game.spawns.s1.memory.sBld_m2_toHarvest   = Game.spawns.s1.memory.sBld_m1_toHarvest;
      Game.spawns.s1.memory.sBld_m2_harvest     = Game.spawns.s1.memory.sBld_m1_harvest;

      Game.spawns.s1.memory.sRCU_m2_toHarvest = Game.spawns.s1.memory.sRCU_m1_toHarvest;
      Game.spawns.s1.memory.sRCU_m2_harvest   = Game.spawns.s1.memory.sRCU_m1_harvest;
      Game.spawns.s1.memory.sBld_m2_toUpgrade = Game.spawns.s1.memory.sBld_m1_toUpgrade;
      Game.spawns.s1.memory.sBld_m2_Upgrade   = Game.spawns.s1.memory.sBld_m1_Upgrade;

      Game.spawns.s1.memory.m2_energyResourcesID_0_Current = Game.spawns.s1.memory.m1_energyResourcesID_0_Current;
      Game.spawns.s1.memory.m2_energyResourcesID_1_Current = Game.spawns.s1.memory.m1_energyResourcesID_1_Current;



      Game.spawns.s1.memory.sHr_m1_to_harvest   = 0;
      Game.spawns.s1.memory.sHr_m1_harvest      = 0;
      Game.spawns.s1.memory.sHr_m1_transfer_calc= 0;
      Game.spawns.s1.memory.sHr_m1_transfer     = 0;

      Game.spawns.s1.memory.sBld_m1_toEnergy    = 0;
      Game.spawns.s1.memory.sBld_m1_toRepair    = 0;
      Game.spawns.s1.memory.sBld_m1_Repair      = 0;
      Game.spawns.s1.memory.sBld_m1_toBuild     = 0;
      Game.spawns.s1.memory.sBld_m1_Build       = 0;
      Game.spawns.s1.memory.sBld_m1_toHarvest   = 0;
      Game.spawns.s1.memory.sBld_m1_harvest     = 0;

      Game.spawns.s1.memory.sRCU_m1_toHarvest = 0;
      Game.spawns.s1.memory.sRCU_m1_harvest   = 0;
      Game.spawns.s1.memory.sBld_m1_toUpgrade = 0;
      Game.spawns.s1.memory.sBld_m1_Upgrade   = 0;

      Game.spawns.s1.memory.m1_energyResourcesID_0_Current = 0;
      Game.spawns.s1.memory.m1_energyResourcesID_1_Current = 0;
    },
    //--------------------------------------------------------------------------
    statistic_print : function()
    {
      if(Game.spawns.s1.memory.isStatisticMemory1 == true)
      {
        console.log("Harv: toHarv " + Game.spawns.s1.memory.sHr_m1_to_harvest +
                    " | Harv "       + Game.spawns.s1.memory.sHr_m1_harvest +
                    " | TransfCalc " + Game.spawns.s1.memory.sHr_m1_transfer_calc +
                    " | Transf "     + Game.spawns.s1.memory.sHr_m1_transfer);

        console.log("Bldr: toEnrg " + Game.spawns.s1.memory.sBld_m1_toEnergy +
                    " | toRepr "     + Game.spawns.s1.memory.sBld_m1_toRepair +
                    " | Repr "       + Game.spawns.s1.memory.sBld_m1_Repair +
                    " | toBld "      + Game.spawns.s1.memory.sBld_m1_toBuild +
                    " | Bld "        + Game.spawns.s1.memory.sBld_m1_Build +
                    " | toHarv "     + Game.spawns.s1.memory.sBld_m1_toHarvest+
                    " | Harv "       + Game.spawns.s1.memory.sBld_m1_harvest
                  );
        console.log("RCLU: toHarv " + Game.spawns.s1.memory.sRCU_m1_toHarvest +
                    " | Harv"       + Game.spawns.s1.memory.sRCU_m1_harvest +
                    " | toUpgr "    + Game.spawns.s1.memory.sBld_m1_toUpgrade +
                    " | Upgr "      + Game.spawns.s1.memory.sBld_m1_Upgrade
                  );
      }
      else
      {
        console.log("Harv: toHarv " + Game.spawns.s1.memory.sHr_m2_to_harvest +
                    " | Harv "       + Game.spawns.s1.memory.sHr_m2_harvest +
                    " | TransfCalc " + Game.spawns.s1.memory.sHr_m2_transfer_calc +
                    " | Transf "     + Game.spawns.s1.memory.sHr_m2_transfer);

        console.log("Bldr: toEnrg " + Game.spawns.s1.memory.sBld_m2_toEnergy +
                    " | toRepr "     + Game.spawns.s1.memory.sBld_m2_toRepair +
                    " | Repr "       + Game.spawns.s1.memory.sBld_m2_Repair +
                    " | toBld "      + Game.spawns.s1.memory.sBld_m2_toBuild +
                    " | Bld "        + Game.spawns.s1.memory.sBld_m2_Build +
                    " | toHarv "     + Game.spawns.s1.memory.sBld_m2_toHarvest +
                    " | Harv "       + Game.spawns.s1.memory.sBld_m2_harvest
                  );

        console.log("RCLU: toHarv " + Game.spawns.s1.memory.sRCU_m2_toHarvest +
                    " | Harv"       + Game.spawns.s1.memory.sRCU_m2_harvest +
                    " | toUpgr "    + Game.spawns.s1.memory.sBld_m2_toUpgrade +
                    " | Upgr "      + Game.spawns.s1.memory.sBld_m2_Upgrade
                  );
      }
    },
    //--------------------------------------------------------------------------
    statistic_common_print : function()
    {
      if(Game.spawns.s1.memory.isStatisticMemory1 == true)
      {
        console.log("toHarvest " + (  Game.spawns.s1.memory.sHr_m1_to_harvest
                                    + Game.spawns.s1.memory.sBld_m1_toHarvest
                                    + Game.spawns.s1.memory.sRCU_m1_toHarvest)
                  +
                    " | Harvest "   + (Game.spawns.s1.memory.sHr_m1_harvest
                                       + Game.spawns.s1.memory.sBld_m1_harvest
                                       + Game.spawns.s1.memory.sRCU_m1_harvest)
                  );

        console.log("Res(" + Game.spawns.s1.memory.energyResourcesID[0] + ")" +
                     Game.spawns.s1.memory.m1_energyResourcesID_0_Current + " "+
                     "Res(" + Game.spawns.s1.memory.energyResourcesID[1] + ")" +
                     Game.spawns.s1.memory.m1_energyResourcesID_1_Current
                  );
      }
      else
      {
        console.log("toHarvest " + (  Game.spawns.s1.memory.sHr_m2_to_harvest
                                    + Game.spawns.s1.memory.sBld_m2_toHarvest
                                    + Game.spawns.s1.memory.sRCU_m2_toHarvest)
                  +
                    " | Harvest "   + (Game.spawns.s1.memory.sHr_m2_harvest
                                       + Game.spawns.s1.memory.sBld_m2_harvest
                                       + Game.spawns.s1.memory.sRCU_m2_harvest)
                  );

        console.log("Res(" + Game.spawns.s1.memory.energyResourcesID[0] + ")" +
                     Game.spawns.s1.memory.m2_energyResourcesID_0_Current + " "+
                     "Res(" + Game.spawns.s1.memory.energyResourcesID[1] + ")" +
                     Game.spawns.s1.memory.m2_energyResourcesID_1_Current
                  );
      }
    },
    //--------------------------------------------------------------------------
    get_busy_resource : function(id)
    {
      //console.log(Game.spawns.s1.memory.m1_energyResourcesID_0_Current + ":" + Game.spawns.s1.memory.m1_energyResourcesID_1_Current);
      return 0;
      if(id == Game.spawns.s1.memory.energyResourcesID[0])
        return Game.spawns.s1.memory.m1_energyResourcesID_0_Current;

      if(id == Game.spawns.s1.memory.energyResourcesID[1])
        return Game.spawns.s1.memory.m1_energyResourcesID_1_Current;
      return 0;
    }
};
