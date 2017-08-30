var s1_tool    = require('s1_tool');

// for debug messages
var iDM = false;
var eDM = true;

const iDM_HEAD = "RCL UPGRADER[INFO] ";
const eDM_HEAD = "RCL UPGRADER[ERROR] ";

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
const SPAWN_S1_ID = 1;

const MAIN_STATE =
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

const t1_body_300 = [WORK, MOVE, CARRY, CARRY, CARRY];
const t2_body_550 = [WORK, WORK, MOVE,  MOVE,  MOVE, CARRY, CARRY, CARRY, CARRY];
const t3_body_750 = [WORK, WORK, WORK,  MOVE,  MOVE,  MOVE,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   body         = [];

const t1_tick_for_full = 75;
const t2_tick_for_full = 50;
const t3_tick_for_full = 50;
//------------------------------------------------------------------------------
module.exports =
{
  body_calc : function()
  {
    //s1_tool.energy_calculate();
    //var current_energy = Game.spawns.s1.memory.energyInStores;
    
    body = [];
    var current_energy = Game.rooms[Game.spawns.s1.memory.RoomID].energyAvailable;

    if(current_energy >= 750)
    {
      body = t3_body_750;
      return TYPE.T3;
    }
    
    if(current_energy >= 550)
    {
      body = t2_body_550;
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
                                        { role        : Game.spawns.s1.memory.RclUpgraderRoleID
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
  check_and_set_to_get_energy : function(upgrader)
  {
    var tickToLive = upgrader.ticksToLive; 

    var enID = upgrader.memory.energyID;
    
    //console.log(upgrader.name + " - " + tickToLive + " : " + upgrader.memory.tick_to_full);
    
    if(tickToLive < (upgrader.memory.tick_to_full + 80))  // 80 ????
    {
      upgrader.memory.main_state = MAIN_STATE.SUICIDE;
      return;
    }

    var storageID = s1_tool.get_not_empty_storages_id();
    if(storageID.length > 0)
    {
      upgrader.memory.storageID = storageID;
      upgrader.memory.main_state = MAIN_STATE.TO_STORAGE;
      return;
    }

    if(s1_tool.energy_is_busy(enID) == true)
    {
      upgrader.memory.main_state = MAIN_STATE.TO_WAIT;
      return;
    }

    var energy_obj = Game.getObjectById(enID);
    s1_tool.energy_grab(enID);    

    upgrader.memory.main_state  = MAIN_STATE.TO_FARM;
  },
  //--------------------------------------------------------------------
  init : function(upgrader)
  {
    var mem = upgrader.memory;
    
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

    this.check_and_set_to_get_energy(upgrader);

    if(iDM == true) console.log(iDM_HEAD + upgrader.name + " found resource id(" + mem.energyID + ")");
  },
  //--------------------------------------------------------------------
  to_storage : function(upgrader)
  {
    var storage_obj = Game.getObjectById(upgrader.memory.storageID);
    
    if(upgrader.pos.inRangeTo(storage_obj, 1))
    {
      var res = upgrader.withdraw(storage_obj, RESOURCE_ENERGY);
      
      if(res == ERR_FULL)
      {
        upgrader.memory.main_state = MAIN_STATE.TO_UPGRADE;
        return;
      }
      
      if(res != OK)
      {
        this.check_and_set_to_get_energy(upgrader);
        return;
      }
      
      upgrader.memory.main_state = MAIN_STATE.TO_UPGRADE;
    }
    else
      this.move_to_target(upgrader, storage_obj);
  },
  //--------------------------------------------------------------------
  to_farm : function(upgrader)
  {
    var energy_obj = Game.getObjectById(upgrader.memory.energyID);
    if(upgrader.pos.inRangeTo(energy_obj, 1))
      upgrader.memory.main_state = MAIN_STATE.FARM;
    else
      this.move_to_target(upgrader, energy_obj);
  },
  //--------------------------------------------------------------------
  farm : function(upgrader)
  {
    var total = _.sum(upgrader.carry);

    if(total < upgrader.carryCapacity)
    {
      var res = upgrader.harvest(Game.getObjectById(upgrader.memory.energyID));
      
      if(res != OK)
      {
        upgrader.memory.main_state = MAIN_STATE.INIT;
        if(eDM == true) console.log(eDM_HEAD + upgrader.name + " STATE.FARM res(" + res + ")");
        return;
      }
    }
    else
    {
      s1_tool.energy_ungrab(upgrader.memory.energyID);
      upgrader.memory.main_state = MAIN_STATE.TO_UPGRADE;
    }
  },
  //--------------------------------------------------------------------
  to_upgrade : function(upgrader)
  {
    if(upgrader.pos.inRangeTo(Game.spawns.s1.room.controller, 3))
      upgrader.memory.main_state = MAIN_STATE.UPGRADE;
    else
      this.move_to_target(upgrader, Game.spawns.s1.room.controller);
  },
  //--------------------------------------------------------------------
  upgrade : function(upgrader)
  {
    var res = upgrader.upgradeController(Game.spawns.s1.room.controller);
    if(res != OK)
      this.check_and_set_to_get_energy(upgrader);
  },
  //--------------------------------------------------------------------
  to_wait : function(upgrader)
  {
    if(upgrader.pos.inRangeTo(upgrader.memory.wpx, upgrader.memory.wpy, 1))
      upgrader.memory.main_state = MAIN_STATE.WAIT;
    else
      this.move_to_xy(upgrader, upgrader.memory.wpx, upgrader.memory.wpy);
  },
  //--------------------------------------------------------------------
  wait : function(upgrader)
  {
    console.log("upgrader " + upgrader.name + " is waiting");

    if(s1_tool.energy_is_busy(upgrader.memory.energyID) == false)
    {
      this.check_and_set_to_get_energy(upgrader);
      return;
    }
  },
  //--------------------------------------------------------------------
  suicide : function(upgrader)
  {
    //if(iDM == true) console.log(iDM_HEAD + upgrader.name + " AKBAR!");
    console.log(iDM_HEAD + upgrader.name + " Bye!");
    upgrader.suicide();
  },
  //--------------------------------------------------------------------
  doing_peace : function(upgrader)
  {
    switch(upgrader.memory.main_state)
    {
      case MAIN_STATE.INIT:       { this.init(upgrader);      break; } 
      case MAIN_STATE.TO_STORAGE: { this.to_storage(upgrader);break; } 
      case MAIN_STATE.TO_FARM:    { this.to_farm(upgrader);   break; } 
      case MAIN_STATE.FARM:       { this.farm(upgrader);      break; } 
      case MAIN_STATE.TO_UPGRADE: { this.to_upgrade(upgrader);break; } 
      case MAIN_STATE.UPGRADE:    { this.upgrade(upgrader);   break; } 
      case MAIN_STATE.TO_WAIT:    { this.to_wait(upgrader);   break; } 
      case MAIN_STATE.WAIT:       { this.wait(upgrader);      break; } 
      case MAIN_STATE.SUICIDE:    { this.suicide(upgrader);   break; } 
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
