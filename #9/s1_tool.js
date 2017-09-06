// for debug messages
var iDM = true;
var eDM = true;

const iDM_HEAD = "S1_TOOL[INFO]: ";
const eDM_HEAD = "S1_TOOL[ERROR]: ";

const SPAWN_S1_ID = 1;

const HARV_MAIN_STATE =
{
  INIT        : 0
 ,TO_FARM     : 1
 ,FARM        : 2
 ,TO_WAIT     : 3
 ,WAIT        : 4
 ,TO_STORAGE  : 5
 ,TO_SPAWN    : 6
 ,SUICIDE     : 7
};

const HARV_SECOND_STATE =
{
  PEACE             : 0
 ,BASE_IS_ATTACKED  : 1
};

const UPGRADER_MAIN_STATE =
{
  INIT        : 0
 ,TO_STORAGE  : 1
 ,TO_FARM     : 2
 ,FARM        : 3
 ,TO_UPGRADE  : 4
 ,UPGRADE     : 5
 ,TO_WAIT     : 6
 ,WAIT        : 7
 ,SUICIDE     : 8
};

const UPGRADER_SECOND_STATE =
{
  PEACE             : 0
 ,BASE_IS_ATTACKED  : 1
};


const BUILDER_MAIN_STATE =
{
  INIT        : 0
 ,TO_STORAGE  : 1
 ,TO_FARM     : 2
 ,FARM        : 3
 ,TO_BUILD    : 4
 ,BUILD       : 5
 ,TO_REPAIR   : 6
 ,REPAIR      : 7
 ,TO_WAIT     : 8
 ,WAIT        : 9
 ,SUICIDE     : 10
};

const BUILDER_SECOND_STATE =
{
  PEACE             : 0
 ,BASE_IS_ATTACKED  : 1
};


//Game.spawns.s1.memory.memoryReinit     = true;
//Game.spawns.s1.memory.forceRecalculate = true;




const gcWallHitsAmount          = 100000; // 100k
const gcRampartHitsAmount       = 150000; // 150k
const gcCountTickForAttackCheck = 10;

//----------------------------------------------------------------------
module.exports =
{
  memory_init : function()
  {
    if(Game.spawns.s1.memory.memoryReinit == null)
      Game.spawns.s1.memory.memoryReinit = true;

    if(Game.spawns.s1.memory.memoryReinit == true)
    {
      Game.spawns.s1.memory.memoryReinit = false;
  
      // init all variables
      
      Game.spawns.s1.memory.HarvesterRoleID    = 0;
      Game.spawns.s1.memory.BuilderRoleID      = 1;
      Game.spawns.s1.memory.RclUpgraderRoleID  = 2;
      Game.spawns.s1.memory.MineralHarvesterID = 3;
      Game.spawns.s1.memory.ColonizatorsRoleID = 4;
      
      Game.spawns.s1.memory.lastRecalculatedTime    = Game.time;
      Game.spawns.s1.memory.forceRecalculate        = true;
      Game.spawns.s1.memory.GameTicksForRecalculate = 60;
      
      Game.spawns.s1.memory.harvester_count = 0;
      Game.spawns.s1.memory.rcl_upgrader_count = 0;
      Game.spawns.s1.memory.builder_count = 0;
      
      Game.spawns.s1.memory.attach_check = 0;
      Game.spawns.s1.memory.enemies = [];
      Game.spawns.s1.memory.isAttacked = false;
      
      Game.spawns.s1.memory.countJobForBuilder = 0;
      
      Game.spawns.s1.memory.isNeedToColonize           = false;
      Game.spawns.s1.memory.isNeedToReinitColonizators = false;
      Game.spawns.s1.memory.isNeedToCreateClaimer      = false;
      
      
      // ENERGY >>
      Game.spawns.s1.memory.energyInStores      = 0;
      Game.spawns.s1.memory.energyStoreCapacity = 0;

      Game.spawns.s1.memory.energyCount   = 2;
      Game.spawns.s1.memory.energyCurrNum = 0;
      
      Game.spawns.s1.memory.RoomID = "W5N8";
      
      Game.spawns.s1.memory.energyID_0 = "68050773313e4cb";
      Game.spawns.s1.memory.energyID_0_pos = [];
      Game.spawns.s1.memory.energyID_0_pos[0] = 14; // x
      Game.spawns.s1.memory.energyID_0_pos[1] = 13; // y
      Game.spawns.s1.memory.energyID_0_max_creeps = 4;
      Game.spawns.s1.memory.energyID_0_wait_pos = [];
      Game.spawns.s1.memory.energyID_0_wait_pos[0] = 17; // x
      Game.spawns.s1.memory.energyID_0_wait_pos[1] = 11; // y
      Game.spawns.s1.memory.energyID_0_gath_count = 0;

      Game.spawns.s1.memory.energyID_1 = "9fa9077331385d3";
      Game.spawns.s1.memory.energyID_1_pos = [];
      Game.spawns.s1.memory.energyID_1_pos[0] = 11; // x
      Game.spawns.s1.memory.energyID_1_pos[1] = 25; // y
      Game.spawns.s1.memory.energyID_1_max_creeps  = 3;
      Game.spawns.s1.memory.energyID_1_wait_pos    = [];
      Game.spawns.s1.memory.energyID_1_wait_pos[0] = 9; // x
      Game.spawns.s1.memory.energyID_1_wait_pos[1] = 22; // y
      Game.spawns.s1.memory.energyID_1_gath_count = 0;
      // ENERGY <<
      
      // ROOM OBJECTS >>
      Game.spawns.s1.memory.constr_containers = [];
      Game.spawns.s1.memory.constr_controllers = [];
      Game.spawns.s1.memory.constr_labs = [];
      Game.spawns.s1.memory.constr_links = [];
      Game.spawns.s1.memory.constr_nukers = [];
      Game.spawns.s1.memory.constr_observers = [];
      Game.spawns.s1.memory.constr_power_spawns = [];
      Game.spawns.s1.memory.constr_ramparts = [];
      Game.spawns.s1.memory.constr_roads = [];
      Game.spawns.s1.memory.constr_spawns = [];
      Game.spawns.s1.memory.constr_storages = [];
      Game.spawns.s1.memory.constr_terminals = [];
      Game.spawns.s1.memory.constr_towers = [];
      Game.spawns.s1.memory.constr_walls = [];
      Game.spawns.s1.memory.constr_extensions = [];
      Game.spawns.s1.memory.constr_extractors = [];
      
      Game.spawns.s1.memory.struct_containers = [];
      Game.spawns.s1.memory.struct_controllers = [];
      Game.spawns.s1.memory.struct_labs = [];
      Game.spawns.s1.memory.struct_links = [];
      Game.spawns.s1.memory.struct_nukers = [];
      Game.spawns.s1.memory.struct_observers = [];
      Game.spawns.s1.memory.struct_power_spawns = [];
      Game.spawns.s1.memory.struct_ramparts = [];
      Game.spawns.s1.memory.struct_roads = [];
      Game.spawns.s1.memory.struct_spawns = [];
      Game.spawns.s1.memory.struct_storages = [];
      Game.spawns.s1.memory.struct_terminals = [];
      Game.spawns.s1.memory.struct_towers = [];
      Game.spawns.s1.memory.struct_walls = [];
      Game.spawns.s1.memory.struct_extensions = [];
      Game.spawns.s1.memory.struct_extractors = [];
      
      Game.spawns.s1.memory.rpr_towers = [];
      Game.spawns.s1.memory.rpr_storages = [];
      Game.spawns.s1.memory.rpr_extractors = [];
      Game.spawns.s1.memory.rpr_extensions = [];
      Game.spawns.s1.memory.rpr_spawns = [];
      Game.spawns.s1.memory.rpr_containers = [];
      Game.spawns.s1.memory.rpr_controllers = [];
      Game.spawns.s1.memory.rpr_labs = [];
      Game.spawns.s1.memory.rpr_links = [];
      Game.spawns.s1.memory.rpr_nukers = [];
      Game.spawns.s1.memory.rpr_observers = [];
      Game.spawns.s1.memory.rpr_power_spawns = [];
      Game.spawns.s1.memory.rpr_ramparts = [];
      Game.spawns.s1.memory.rpr_terminals = [];
      Game.spawns.s1.memory.rpr_walls = [];
      Game.spawns.s1.memory.rpr_roads = [];
      
      Game.spawns.s1.memory.mineralMineID = "";
      
      // ROOM OBJECTS <<
      // ...
      
      if(iDM == true) console.log(iDM_HEAD + "memory inited");
    }
  },
  
  //------------------ ENERGY FUNC >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  get_energy_id : function()
  {
    if(Game.spawns.s1.memory.energyCurrNum >= Game.spawns.s1.memory.energyCount)
      Game.spawns.s1.memory.energyCurrNum = 0;
    
    switch(Game.spawns.s1.memory.energyCurrNum)
    {
      case 0: { Game.spawns.s1.memory.energyCurrNum++; return Game.spawns.s1.memory.energyID_0; }
      case 1: { Game.spawns.s1.memory.energyCurrNum++; return Game.spawns.s1.memory.energyID_1; }
    }
    return "";
  },
  //--------------------------------------------------------------------
  get_energy_pos_by_id : function(id)
  {
    if(id == Game.spawns.s1.memory.energyID_0)  return Game.spawns.s1.memory.energyID_0_pos;
    if(id == Game.spawns.s1.memory.energyID_1)  return Game.spawns.s1.memory.energyID_1_pos;
    return [];
  },
  //--------------------------------------------------------------------
  get_energy_wait_pos_by_id : function(id)
  {
    if(id == Game.spawns.s1.memory.energyID_0)  return Game.spawns.s1.memory.energyID_0_wait_pos;
    if(id == Game.spawns.s1.memory.energyID_1)  return Game.spawns.s1.memory.energyID_1_wait_pos;
    return [];
  },
  //--------------------------------------------------------------------
  get_max_creep_on_energy_by_id : function(id)
  {
    if(id == Game.spawns.s1.memory.energyID_0)  return Game.spawns.s1.memory.energyID_0_max_creeps;
    if(id == Game.spawns.s1.memory.energyID_1)  return Game.spawns.s1.memory.energyID_1_max_creeps;
    return 0;
  },
  //--------------------------------------------------------------------------
  get_busy_energy_by_id : function(id)
  {
    if(id == Game.spawns.s1.memory.energyID_0)  return Game.spawns.s1.memory.energyID_0_gath_count;
    if(id == Game.spawns.s1.memory.energyID_1)  return Game.spawns.s1.memory.energyID_1_gath_count;
    return 0;
  },
  //--------------------------------------------------------------------------
  energy_is_busy : function(id)
  {
    if(id == Game.spawns.s1.memory.energyID_0)  
      return Game.spawns.s1.memory.energyID_0_gath_count >= Game.spawns.s1.memory.energyID_0_max_creeps;
      
    if(id == Game.spawns.s1.memory.energyID_1)  
      return Game.spawns.s1.memory.energyID_1_gath_count >= Game.spawns.s1.memory.energyID_1_max_creeps;

    return false;
  },  
  //--------------------------------------------------------------------------
  energy_grab : function(id)
  {
    if(id == Game.spawns.s1.memory.energyID_0)
    {
      Game.spawns.s1.memory.energyID_0_gath_count++;
      return;
    } 
    
    if(id == Game.spawns.s1.memory.energyID_1)
    {
      Game.spawns.s1.memory.energyID_1_gath_count++;
      return;
    }
  }, 
  //--------------------------------------------------------------------------
  energy_ungrab : function(id)
  {
    if(id == Game.spawns.s1.memory.energyID_0)
    {
      Game.spawns.s1.memory.energyID_0_gath_count--;
      return;
    } 
    
    if(id == Game.spawns.s1.memory.energyID_1)
    {
      Game.spawns.s1.memory.energyID_1_gath_count--;
      return;
    }
  }, 
  //--------------------------------------------------------------------------
  energy_calculate : function()
  {
    Game.spawns.s1.memory.energyInStores      = 0;
    Game.spawns.s1.memory.energyStoreCapacity = 0;
    
    Game.spawns.s1.memory.energyInStores      += Game.spawns.s1.energy;
    Game.spawns.s1.memory.energyStoreCapacity += Game.spawns.s1.energyCapacity;

    for(var i in Game.spawns.s1.memory.struct_extensions)
    {
      Game.spawns.s1.memory.energyInStores      += Game.getObjectById(Game.spawns.s1.memory.struct_extensions[i]).energy;
      Game.spawns.s1.memory.energyStoreCapacity += Game.getObjectById(Game.spawns.s1.memory.struct_extensions[i]).energyCapacity;
    }
  },
  //------------------ ENERGY FUNC <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  
  //------------------ ROOM OBJECTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  recalculate_objects : function()
  {
    var elapsed = Game.time - Game.spawns.s1.memory.lastRecalculatedTime;

    if (Game.spawns.s1.memory.forceRecalculate == false)
     if (elapsed < Game.spawns.s1.memory.GameTicksForRecalculate)
       return;

    this.clear_objects();

    Game.spawns.s1.memory.countJobForBuilder   = 0;
    Game.spawns.s1.memory.forceRecalculate     = false;
    Game.spawns.s1.memory.lastRecalculatedTime = Game.time;
    
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
          Game.spawns.s1.memory.struct_walls.push(res[i].id);
          if(res[i].hits < gcWallHitsAmount)
          {
            Game.spawns.s1.memory.rpr_walls.push(res[i].id);
            Game.spawns.s1.memory.countJobForBuilder++;
          }
          break;
        }
        case 'spawn':
        {
          Game.spawns.s1.memory.struct_spawns.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_spawns.push(res[i].id);
          break;
        }
        case 'extension':
        {
          Game.spawns.s1.memory.struct_extensions.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_extensions.push(res[i].id);
          break;
        }
        case 'rampart':
        {
          Game.spawns.s1.memory.struct_ramparts.push(res[i].id);
          if(res[i].hits < gcRampartHitsAmount)
          {
            Game.spawns.s1.memory.rpr_ramparts.push(res[i].id);
            Game.spawns.s1.memory.countJobForBuilder++;
          }
          break;
        }
        case 'link':
        {
          Game.spawns.s1.memory.struct_links.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_links.push(res[i].id);
          break;
        }
        case 'storage':
        {
          Game.spawns.s1.memory.struct_storages.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_storages.push(res[i].id);
          break;
        }
        case 'tower':
        {
          Game.spawns.s1.memory.struct_towers.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
          {
            Game.spawns.s1.memory.rpr_towers.push(res[i].id);
            Game.spawns.s1.memory.countJobForBuilder++;
          }
          break;
        }
        case 'observer':
        {
          Game.spawns.s1.memory.struct_observers.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_observers.push(res[i].id);
          break;
        }
        case 'powerSpawn':
        {
          Game.spawns.s1.memory.struct_power_spawns.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_power_spawns.push(res[i].id);
          break;
        }
        case 'extractor':
        {
          Game.spawns.s1.memory.struct_extractors.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_extractors.push(res[i].id);
          break;
        }
        case 'lab':
        {
          Game.spawns.s1.memory.struct_labs.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_labs.push(res[i].id);
          break;
        }
        case 'terminal':
        {
          Game.spawns.s1.memory.struct_terminals.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_terminals.push(res[i].id);
          break;
        }
        case 'container':
        {
          Game.spawns.s1.memory.struct_containers.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_containers.push(res[i].id);
          break;
        }
        case 'nuker':
        {
          Game.spawns.s1.memory.struct_nukers.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_nukers.push(res[i].id);
          break;
        }
        case 'road':
        {
          Game.spawns.s1.memory.struct_roads.push(res[i].id);
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_roads.push(res[i].id);
          break;
        }
        case 'controller':
        {
          if(res[i].hits < res[i].hitsMax)
            Game.spawns.s1.memory.rpr_controllers.push(res[i].id);
          break;
        }
        default:
        {
          if(eDM == true) console.log(eDM_HEAD + " recalculate structures UNKNOWN " + res[i].structureType);
          break;
        }
      }
    }

    var res = Game.spawns.s1.room.find(FIND_CONSTRUCTION_SITES);
    for (var i in res)
    {
      switch(res[i].structureType)
      {
        case 'constructedWall': 
        {
          Game.spawns.s1.memory.constr_walls.push(res[i].id);        
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'spawn':           
        {
          Game.spawns.s1.memory.constr_spawns.push(res[i].id);       
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'extension':       
        {
          Game.spawns.s1.memory.constr_extensions.push(res[i].id);   
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'rampart':         
        {
          Game.spawns.s1.memory.constr_ramparts.push(res[i].id);     
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'link':            
        {
          Game.spawns.s1.memory.constr_links.push(res[i].id);        
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'storage':         
        {
          Game.spawns.s1.memory.constr_storages.push(res[i].id);     
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'tower':           
        {
          Game.spawns.s1.memory.constr_towers.push(res[i].id);       
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'observer':        
        {
          Game.spawns.s1.memory.constr_observers.push(res[i].id);    
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'powerSpawn':      
        {
          Game.spawns.s1.memory.constr_power_spawns.push(res[i].id); 
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'extractor':       
        {
          Game.spawns.s1.memory.constr_extractors.push(res[i].id);   
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'lab':             
        {
          Game.spawns.s1.memory.constr_labs.push(res[i].id);         
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'terminal':        
        {
          Game.spawns.s1.memory.constr_terminals.push(res[i].id);    
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'container':       
        {
          Game.spawns.s1.memory.constr_containers.push(res[i].id);   
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'nuker':           
        {
          Game.spawns.s1.memory.constr_nukers.push(res[i].id);       
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'road':            
        {
          Game.spawns.s1.memory.constr_roads.push(res[i].id);        
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        case 'controller':      
        {
          Game.spawns.s1.memory.constr_controllers.push(res[i].id);  
          Game.spawns.s1.memory.countJobForBuilder++;
          break;
        }
        default:
        {
          if(eDM == true) console.log(eDM_HEAD + " recalculate constructions UNKNOWN " + res[i].structureType);
          break;
        }
      }
    }

    if(iDM == true) console.log(iDM_HEAD + "all objects were recalculated");
  },
  //--------------------------------------------------------------------
  clear_objects_construction : function()
  {
    Game.spawns.s1.memory.constr_containers = [];
    Game.spawns.s1.memory.constr_controllers = [];
    Game.spawns.s1.memory.constr_labs = [];
    Game.spawns.s1.memory.constr_links = [];
    Game.spawns.s1.memory.constr_nukers = [];
    Game.spawns.s1.memory.constr_observers = [];
    Game.spawns.s1.memory.constr_power_spawns = [];
    Game.spawns.s1.memory.constr_ramparts = [];
    Game.spawns.s1.memory.constr_roads = [];
    Game.spawns.s1.memory.constr_spawns = [];
    Game.spawns.s1.memory.constr_storages = [];
    Game.spawns.s1.memory.constr_terminals = [];
    Game.spawns.s1.memory.constr_towers = [];
    Game.spawns.s1.memory.constr_walls = [];
    Game.spawns.s1.memory.constr_extensions = [];
    Game.spawns.s1.memory.constr_extractors = [];
  },
  //--------------------------------------------------------------------
  clear_objects_structure : function()
  {
    Game.spawns.s1.memory.struct_containers = [];
    Game.spawns.s1.memory.struct_controllers = [];
    Game.spawns.s1.memory.struct_labs = [];
    Game.spawns.s1.memory.struct_links = [];
    Game.spawns.s1.memory.struct_nukers = [];
    Game.spawns.s1.memory.struct_observers = [];
    Game.spawns.s1.memory.struct_power_spawns = [];
    Game.spawns.s1.memory.struct_ramparts = [];
    Game.spawns.s1.memory.struct_roads = [];
    Game.spawns.s1.memory.struct_spawns = [];
    Game.spawns.s1.memory.struct_storages = [];
    Game.spawns.s1.memory.struct_terminals = [];
    Game.spawns.s1.memory.struct_towers = [];
    Game.spawns.s1.memory.struct_walls = [];
    Game.spawns.s1.memory.struct_extensions = [];
    Game.spawns.s1.memory.struct_extractors = [];
  },
  //--------------------------------------------------------------------
  clear_objects_repair : function()
  {
    Game.spawns.s1.memory.rpr_towers = [];
    Game.spawns.s1.memory.rpr_storages = [];
    Game.spawns.s1.memory.rpr_extractors = [];
    Game.spawns.s1.memory.rpr_extensions = [];
    Game.spawns.s1.memory.rpr_spawns = [];
    Game.spawns.s1.memory.rpr_containers = [];
    Game.spawns.s1.memory.rpr_controllers = [];
    Game.spawns.s1.memory.rpr_labs = [];
    Game.spawns.s1.memory.rpr_links = [];
    Game.spawns.s1.memory.rpr_nukers = [];
    Game.spawns.s1.memory.rpr_observers = [];
    Game.spawns.s1.memory.rpr_power_spawns = [];
    Game.spawns.s1.memory.rpr_ramparts = [];
    Game.spawns.s1.memory.rpr_terminals = [];
    Game.spawns.s1.memory.rpr_walls = [];
    Game.spawns.s1.memory.rpr_roads = [];
  },
  //--------------------------------------------------------------------
  clear_objects : function()
  {
    this.clear_objects_construction();
    this.clear_objects_structure();
    this.clear_objects_repair();
  },
  //--------------------------------------------------------------------------
  get_repair_road_id : function()
  {
    if(Game.spawns.s1.memory.rpr_roads.length > 0)
    {
      for(var i in Game.spawns.s1.memory.rpr_roads)
      {
        var road = Game.getObjectById(Game.spawns.s1.memory.rpr_roads[i]);
        if(road.hits < road.hitsMax)
          return Game.spawns.s1.memory.rpr_roads[i];
      }
    }
    return "";
  },
  //--------------------------------------------------------------------------
  get_repair_rampart_id : function()
  {
    if(Game.spawns.s1.memory.rpr_ramparts.length > 0)
    {
      for(var i in Game.spawns.s1.memory.rpr_ramparts)
      {
        var ram_part = Game.getObjectById(Game.spawns.s1.memory.rpr_ramparts[i]);
        if(ram_part.hits < ram_part.hitsMax)
          return Game.spawns.s1.memory.rpr_ramparts[i];
      }
    }
    return "";
  },
  //--------------------------------------------------------------------------
  get_not_empty_storages_id : function()
  {
    for(var i in Game.spawns.s1.memory.struct_storages)
    {
      var id = Game.spawns.s1.memory.struct_storages[i];
      //console.log("storage = " + Game.getObjectById(id).store[RESOURCE_ENERGY] + " : " + id);

      if(Game.getObjectById(id).store[RESOURCE_ENERGY] > 300)
        return id;
    }

    return "";
  },  
  //------------------ ROOM OBJECTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  //------------------ POSITIONS DISTANCES NEAREST >>>>>>>>>>>>>>>>>>>>>
  //--------------------------------------------------------------------
  distance_calc : function(pos1, pos2)
  {
    var v1 = (pos1.x - pos2.x);
    var v2 = (pos1.y - pos2.y);
    return v1*v1 + v2*v2;
  },
  //--------------------------------------------------------------------
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
  //--------------------------------------------------------------------
  get_nearest_store_for_transfer_id : function(creepObj)
  {
    var res = "";
    var tmp_arr = [];

    for(var i in Game.spawns.s1.memory.struct_extensions)
    {
      id = Game.spawns.s1.memory.struct_extensions[i];
      var obj = Game.getObjectById(id);
      if(obj.energy < obj.energyCapacity )
        tmp_arr.push(id);
    }
    res = this.get_nearest_object_id(creepObj, tmp_arr);
    if(res.length > 0)
      return res;

    for(var i in Game.spawns.s1.memory.struct_storages)
    {
      id = Game.spawns.s1.memory.struct_storages[i];
      var obj = Game.getObjectById(id);
      if(obj.store[RESOURCE_ENERGY] < obj.storeCapacity)
        tmp_arr.push(id);
    }
    res = this.get_nearest_object_id(creepObj, tmp_arr);
    if(res.length > 0)
      return res;

    for(var i in Game.spawns.s1.memory.struct_containers)
    {
      id = Game.spawns.s1.memory.struct_containers[i];
      var obj = Game.getObjectById(id);
      if(obj.store[RESOURCE_ENERGY] < obj.storeCapacity)
        tmp_arr.push(id);
    }
    res = this.get_nearest_object_id(creepObj, tmp_arr);
    if(res.length > 0)
      return res;

    return "";
  },
  //--------------------------------------------------------------------
  get_nearest_not_full_tower_id : function(creepObj)
  {
    var res = "";
    var tmp_arr = [];

    for(var i in Game.spawns.s1.memory.struct_towers)
    {
      var id = Game.spawns.s1.memory.struct_towers[i];
      var obj = Game.getObjectById(id);

      if(obj.energy < obj.energyCapacity)
        tmp_arr.push(id);
    }

    res = this.get_nearest_object_id(creepObj, tmp_arr);

    return res;
  },
  //--------------------------------------------------------------------
  get_repair_road_id : function()
  {
    if(Game.spawns.s1.memory.rpr_roads.length > 0)
    {
      for(var i in Game.spawns.s1.memory.rpr_roads)
      {
        var road = Game.getObjectById(Game.spawns.s1.memory.rpr_roads[i]);
        if(road.hits < road.hitsMax)
          return Game.spawns.s1.memory.rpr_roads[i];
      }
    }
    return "";
  },
  //--------------------------------------------------------------------
  get_nearest_build_id : function(creepObj)
  {
    var res = "";

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_towers);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_extensions);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_storages);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_ramparts);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_walls);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_containers);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_controllers);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_labs);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_links);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_nukers);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_observers);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_power_spawns);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_roads);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_spawns);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_terminals);
    if(res.length > 0)
      return res;

    res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.constr_extractors);
    if(res.length > 0)
      return res;

    return "";
  },
  //--------------------------------------------------------------------------
  get_nearest_repair_object_id_for_builder : function(creepObj)
  {
    var res = "";
    
    if(Game.spawns.s1.memory.rpr_towers.length > 0)
    {       
      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.rpr_towers);
      if(res.length > 0)
        return res;
    }
    
    if(Game.spawns.s1.memory.rpr_ramparts.length > 0)
    {
      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.rpr_ramparts);
      if(res.length > 0)
        return res;
    }
    
    if(Game.spawns.s1.memory.rpr_walls.length > 0)
    {
      res = this.get_nearest_object_id(creepObj, Game.spawns.s1.memory.rpr_walls);
      if(res.length > 0)
        return res;
    }
    
    return res;
    //Game.spawns.s1.memory.rpr_storages[0];
    //Game.spawns.s1.memory.rpr_containers[0];
    //Game.spawns.s1.memory.rpr_labs[0];
    //Game.spawns.s1.memory.rpr_links[0];
    //Game.spawns.s1.memory.rpr_roads[0];
    //Game.spawns.s1.memory.rpr_nukers[0];
    //Game.spawns.s1.memory.rpr_observers[0];
    //Game.spawns.s1.memory.rpr_power_spawns[0];
    //Game.spawns.s1.memory.rpr_terminals[0];
    //Game.spawns.s1.memory.rpr_extensions[0];
    //Game.spawns.s1.memory.rpr_extractors[0];
  },
  //--------------------------------------------------------------------
  is_has_job_for_builder : function()
  {
    return Game.spawns.s1.memory.countJobForBuilder > 0;
  },
  //--------------------------------------------------------------------
  builder_job_is_done : function()
  {
    if(Game.spawns.s1.memory.countJobForBuilder > 0)
      Game.spawns.s1.memory.countJobForBuilder--;
  },
  //------------------ POSITIONS DISTANCES NEAREST <<<<<<<<<<<<<<<<<<<<<

  //------------------- STATICTICS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  clear_statictic : function()
  {
    Game.spawns.s1.memory.energyID_0_gath_count = 0;
    Game.spawns.s1.memory.energyID_1_gath_count = 0;
    
    Game.spawns.s1.memory.harvester_count    = 0;
    Game.spawns.s1.memory.rcl_upgrader_count = 0;
    Game.spawns.s1.memory.builder_count      = 0;
  },
  //--------------------------------------------------------------------
  statistic_upd_harvester : function(harvester)
  {
    Game.spawns.s1.memory.harvester_count++;
    
    var m_st    = harvester.memory.main_state;
    var m_enID  = harvester.memory.energyID;
    var en_id_0 = Game.spawns.s1.memory.energyID_0;
    var en_id_1 = Game.spawns.s1.memory.energyID_1;
    
    switch(m_st)
    {
      case HARV_MAIN_STATE.FARM:
      case HARV_MAIN_STATE.TO_FARM:
      {
        if(m_enID == en_id_0) { Game.spawns.s1.memory.energyID_0_gath_count++; break; }
        if(m_enID == en_id_1) { Game.spawns.s1.memory.energyID_1_gath_count++; break; }
        break;
      }
    }
  },
  //--------------------------------------------------------------------
  statistic_upd_rcl_upgrader : function(upgrader)
  {
    Game.spawns.s1.memory.rcl_upgrader_count++;
    
    var m_st    = upgrader.memory.main_state;
    var m_enID  = upgrader.memory.energyID;
    var en_id_0 = Game.spawns.s1.memory.energyID_0;
    var en_id_1 = Game.spawns.s1.memory.energyID_1;
    
    switch(m_st)
    {
      case UPGRADER_MAIN_STATE.FARM:
      case UPGRADER_MAIN_STATE.TO_FARM:
      {
        if(m_enID == en_id_0) { Game.spawns.s1.memory.energyID_0_gath_count++; break; }
        if(m_enID == en_id_1) { Game.spawns.s1.memory.energyID_1_gath_count++; break; }
        break;
      }
    }
  },
  //--------------------------------------------------------------------
  statistic_upd_builder : function(builder)
  {
    Game.spawns.s1.memory.builder_count++;
    
    var m_st    = builder.memory.main_state;
    var m_enID  = builder.memory.energyID;
    var en_id_0 = Game.spawns.s1.memory.energyID_0;
    var en_id_1 = Game.spawns.s1.memory.energyID_1;
    switch(m_st)
    {
      case BUILDER_MAIN_STATE.FARM:
      case BUILDER_MAIN_STATE.TO_FARM:
      {
        if(m_enID == en_id_0) { Game.spawns.s1.memory.energyID_0_gath_count++; break; }
        if(m_enID == en_id_1) { Game.spawns.s1.memory.energyID_1_gath_count++; break; }
        break;
      }
    }
  },
  //--------------------------------------------------------------------
  statistic_update : function()
  {
    this.clear_statictic();
    
    for(var i in Game.creeps)
    {
      if(Game.creeps[i].memory.spawn_id != SPAWN_S1_ID)
        continue;

      switch(Game.creeps[i].memory.role)
      {
        case Game.spawns.s1.memory.HarvesterRoleID:
        {
          this.statistic_upd_harvester(Game.creeps[i]);
          break;
        }
        case Game.spawns.s1.memory.BuilderRoleID:
        {
          this.statistic_upd_builder(Game.creeps[i]);
          break;
        }
        case Game.spawns.s1.memory.RclUpgraderRoleID:
        {
          this.statistic_upd_rcl_upgrader(Game.creeps[i]);
          break;
        }
      }
    }
  },
  //------------------- STATICTICS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  enemy_calculate : function()
  {
    Game.spawns.s1.memory.enemies = [];
    var enemies = Game.spawns.s1.room.find(FIND_HOSTILE_CREEPS);
    for(var i in enemies)
      Game.spawns.s1.memory.enemies.push(enemies[i].id);
  },
  //--------------------------------------------------------------------
  processing : function()
  {
    this.memory_init();
    
    this.recalculate_objects();
    
    this.statistic_update();
  }
};

















