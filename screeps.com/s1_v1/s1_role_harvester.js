var s1_tool    = require('s1_tool');

const SPAWN_S1_ID = 1;

// for debug messages
var iDM = false;
var eDM = true;

const iDM_HEAD = "HARVESTER[INFO] ";
const eDM_HEAD = "HARVESTER[ERROR] ";

/* CREEP BODY
MOVE            50
WORK            100
CARRY           50
ATTACK          80
RANGED_ATTACK   150
HEAL            250
CLAIM           600
TOUGH           10
*/

const CREEP_ROLE =
{
    HARVESTER         : 0
   ,RCL_UPGRADER      : 1
   ,BUILDER           : 2
   ,MINERAL_HARVESTER : 3
};

const MAIN_STATE =
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

const SECOND_STATE =
{
  PEACE             : 0
 ,BASE_IS_ATTACKED  : 1
};

const TYPE =
{
  T1 : 0
 ,T2 : 1
 ,T3 : 2
};

const t1_body_300  = [WORK, MOVE, CARRY, CARRY, CARRY];
const t2_body_450  = [WORK, WORK, MOVE,  CARRY, CARRY, CARRY, CARRY];
const t3_body_650  = [WORK, WORK, MOVE, MOVE,  MOVE,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
//const t4_body_1000 = [WORK, WORK, MOVE, MOVE,  MOVE,  MOVE,  MOVE,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   body         = [];

const t1_tick_for_full = 75;
const t2_tick_for_full = 50;
const t3_tick_for_full = 75;

//------------------------------------------------------------------------------
module.exports =
{
  body_calc : function()
  {
      s1_tool.energy_calculate();
      body = [];

      var current_energy = Game.spawns.s1.memory.energyInStores;

      if(current_energy >= 650)
      {
        body = t3_body_650;
        return TYPE.T3;
      }
      
      if(current_energy >= 450)
      {
        body = t2_body_450;
        return TYPE.T2;
      }
      
      if(current_energy >= 300)
      {
        body = t1_body_300;
        return TYPE.T1;
      }
      return -1;
  },
  //------------------------------------------------------------------------------
  create : function()
  {
    if(Game.spawns.s1.spawning)
      return;

    var type = this.body_calc();

    if(body.length > 0)
    {
      Game.spawns.s1.createCreep(body, null,
                                        { role        : CREEP_ROLE.HARVESTER
                                         ,type        : type
                                         ,main_state  : MAIN_STATE.INIT
                                         ,second_state: SECOND_STATE.PEACE
                                         ,energyID    : ""
                                         ,storageID   : ""
                                         ,wpx         : -1
                                         ,wpy         : -1
                                         ,tick_to_full: 0
                                         ,spawn_id    : SPAWN_S1_ID
                                        });
    }
  },
  //--------------------------------------------------------------------
  move_to_target : function(harvester, target)
  {
    if(harvester.fatigue == 0)
      harvester.moveTo(target, {reusePath: 10});  
  },
  //--------------------------------------------------------------------
  move_to_xy : function(harvester, x, y)
  {
    if(harvester.fatigue == 0)
      harvester.moveTo(x, y, {reusePath: 10});
  },
  //--------------------------------------------------------------------
  trancfer_calculate : function(harvester)
  {
    var tower_id;
    tower_id = s1_tool.get_nearest_not_full_tower_id(harvester);

    if(tower_id.length > 0)
    {
      if(iDM == true) console.log(iDM_HEAD + harvester.name + " moving to nearest not full tower id(" + tower_id + ")");
      harvester.memory.storageID  = tower_id;
      harvester.memory.main_state = MAIN_STATE.TO_STORAGE;
      return;
    }

    if(Game.spawns.s1.energy < Game.spawns.s1.energyCapacity)
    {
      if(iDM == true) console.log(iDM_HEAD + harvester.name + " moving to spawn s1");
      harvester.memory.main_state = MAIN_STATE.TO_SPAWN;
      return;
    }
    
    var store_id = "";
    store_id = s1_tool.get_nearest_store_for_transfer_id(harvester);
    if(store_id.length > 0)
    {
      if(iDM == true) console.log(iDM_HEAD + harvester.name + " moving to nearest storage id(" + store_id + ")");
      harvester.memory.storageID  = store_id;
      harvester.memory.main_state = MAIN_STATE.TO_STORAGE;
      return;
    }

    if(eDM == true) console.log(eDM_HEAD + harvester.name + " farm - trancfer calculate");
  },
  //--------------------------------------------------------------------
  check_and_set_to_farm : function(harvester)
  {
    var tickToLive = harvester.ticksToLive + 30; // 30 ????
    
    var enID = harvester.memory.energyID;

    if(tickToLive < harvester.memory.tick_to_full) 
    {
      harvester.memory.main_state = MAIN_STATE.SUICIDE;
      return;
    }
    
    if(s1_tool.energy_is_busy(enID) == true)
    {
      harvester.memory.main_state = MAIN_STATE.TO_WAIT;
      return;
    }

    harvester.memory.main_state  = MAIN_STATE.TO_FARM;

    var energy_obj = Game.getObjectById(enID);
    s1_tool.energy_grab(enID);    
  },
  //--------------------------------------------------------------------
  init : function(harvester)
  {
    var mem = harvester.memory;
    
    mem.energyID = s1_tool.get_energy_id();
    
    var pos = s1_tool.get_energy_wait_pos_by_id(mem.energyID);
    if(pos.length > 0)
    {
      mem.wpx = pos[0];
      mem.wpy = pos[1];
    }

    switch(mem.type)
    {
      case TYPE.T1: { mem.tick_to_full = t1_tick_for_full; break; }
      case TYPE.T2: { mem.tick_to_full = t2_tick_for_full; break; }
      case TYPE.T3: { mem.tick_to_full = t3_tick_for_full; break; }
    }

    this.check_and_set_to_farm(harvester);

    if(iDM == true) console.log(iDM_HEAD + harvester.name + " found resource id(" + mem.energyID + ")");
  },
  //--------------------------------------------------------------------
  to_farm : function(harvester)
  {
    var energy_obj = Game.getObjectById(harvester.memory.energyID);
    if(harvester.pos.inRangeTo(energy_obj, 1))
      harvester.memory.main_state = MAIN_STATE.FARM;
    else
      this.move_to_target(harvester, energy_obj);
  },
  //--------------------------------------------------------------------
  farm : function(harvester)
  {
    var total = _.sum(harvester.carry);

    if(total < harvester.carryCapacity)
    {
      var res = harvester.harvest(Game.getObjectById(harvester.memory.energyID));
      
      if(res != OK)
      {
        harvester.memory.main_state = MAIN_STATE.INIT;
        if(eDM == true) console.log(eDM_HEAD + harvester.name + " STATE.FARM res(" + res + ")");
        return;
      }
    }
    else
    {
      s1_tool.energy_ungrab(harvester.memory.energyID);
      this.trancfer_calculate(harvester);
    }
  },
  //--------------------------------------------------------------------
  to_storage : function(harvester)
  {
    var storage = Game.getObjectById(harvester.memory.storageID);

    if(!storage)
    {
      this.check_and_set_to_farm(harvester);
      return;
    }
    
    if(harvester.pos.inRangeTo(storage, 1))
    {
      var res = harvester.transfer(storage, RESOURCE_ENERGY);
      if(res == OK)
      {
        var total = _.sum(harvester.carry);
        if(total > 50)
        {
          this.trancfer_calculate(harvester);
          return;
        }
        this.check_and_set_to_farm(harvester);
        return;
      }
      
      if(res == ERR_FULL)
      {
        this.trancfer_calculate(harvester);
        return;
      }
      
      if(res == ERR_NOT_ENOUGH_RESOURCES)
      {
        this.check_and_set_to_farm(harvester);
        return;
      }
      
      if(eDM == true) console.log(eDM_HEAD + harvester.name + " trancfer to storage : " + res);
    }
    else
    {
      this.move_to_target(harvester, storage);
    }
  },
  //--------------------------------------------------------------------
  to_spawn : function(harvester)
  {
    var spawnObj = Game.spawns.s1;

    if(!spawnObj)
    {
      this.check_and_set_to_farm(harvester);
      return;
    }
    
    if(harvester.pos.inRangeTo(spawnObj, 1))
    {
      var res = harvester.transfer(spawnObj, RESOURCE_ENERGY);
      if(res == OK)
      {
        var total = _.sum(harvester.carry);
        if(total > 50)
        {
          this.trancfer_calculate(harvester);
          return;
        }
        this.check_and_set_to_farm(harvester);
        return;
      }

      if(res == ERR_FULL)
      {
        this.trancfer_calculate(harvester);
        return;
      }
      
      if(res == ERR_NOT_ENOUGH_RESOURCES)
      {
        this.check_and_set_to_farm(harvester);
        return;
      }
            
      if(eDM == true) console.log(eDM_HEAD + harvester.name + " trancfer to spawn : " + res);
    }
    else
    {
      this.move_to_target(harvester, spawnObj);
    }
  },
  //--------------------------------------------------------------------
  to_wait : function(harvester)
  {
    if(harvester.pos.inRangeTo(harvester.memory.wpx, harvester.memory.wpy, 2))
      harvester.memory.main_state = MAIN_STATE.WAIT;
    else
      this.move_to_xy(harvester, harvester.memory.wpx, harvester.memory.wpy);
  },
  //--------------------------------------------------------------------
  wait : function(harvester)
  {
    if(s1_tool.energy_is_busy(harvester.memory.energyID) == false)
    {
      this.check_and_set_to_farm(harvester);
      return;
    }
  },
  //--------------------------------------------------------------------
  suicide : function(harvester)
  {
    //if(iDM == true) console.log(iDM_HEAD + harvester.name + " AKBAR!");
    console.log(iDM_HEAD + harvester.name + " AKBAR!");
    harvester.suicide();
  },
  //--------------------------------------------------------------------
  doing_peace : function(harvester)
  {
    //console.log(harvester.name + " : " + harvester.memory.main_state);
    
    switch(harvester.memory.main_state)
    {
      case MAIN_STATE.INIT:       { this.init(harvester);    break; } 
      case MAIN_STATE.TO_FARM:    { this.to_farm(harvester); break; } 
      case MAIN_STATE.FARM:       { this.farm(harvester); break; } 
      case MAIN_STATE.TO_WAIT:    { this.to_wait(harvester); break; } 
      case MAIN_STATE.WAIT:       { this.wait(harvester); break; } 
      case MAIN_STATE.TO_STORAGE: { this.to_storage(harvester); break; } 
      case MAIN_STATE.TO_SPAWN:   { this.to_spawn(harvester); break; } 
      case MAIN_STATE.SUICIDE:    { this.suicide(harvester); break; } 
    }
  },
  //--------------------------------------------------------------------
  doing_base_is_attacked : function(harvester)
  {
  },
  //--------------------------------------------------------------------
  doing : function(harvester)
  {
    if(harvester.spawning)
        return;
  
    switch(harvester.memory.second_state)
    {
      case SECOND_STATE.PEACE:            { this.doing_peace(harvester); break; }
      case SECOND_STATE.BASE_IS_ATTACKED: { break; }
    }
  }
};














