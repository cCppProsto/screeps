var s1_tool    = require('s1_tool');

const SPAWN_S1_ID = 1;

// for debug messages
var iDM = false;
var eDM = true; 

const iDM_HEAD = "BUILDER[INFO] ";
const eDM_HEAD = "BUILDER[ERROR] ";

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
const SPAWN1_ID = 1;

const MAIN_STATE =
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

const t1_body_300  = [WORK, MOVE, MOVE, CARRY, CARRY];
const t2_body_500  = [WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY];
const t3_body_800  = [WORK, WORK, WORK, MOVE, MOVE,  MOVE,  MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var   body         = [];

const t1_tick_for_full = 75;
const t2_tick_for_full = 50;
const t3_tick_for_full = 50;


// for debug messages
var iDL = false; //("INFO: Builder[" + builder.name + "]  ");
var eDL = true; //("ERROR: Builder[" + builder.name + "]  state res = " + res);

//------------------------------------------------------------------------------
module.exports =
{
  body_calc : function()
  {
    s1_tool.energy_calculate();
    body = [];

    var current_energy = Game.spawns.s1.memory.energyInStores;

    if(current_energy >= 800)
    {
      body = t3_body_800;
      return TYPE.T3;
    }
    
    if(current_energy >= 500)
    {
      body = t2_body_500;
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
                                        { role        : Game.spawns.s1.memory.BuilderRoleID
                                         ,type        : type
                                         ,main_state  : MAIN_STATE.INIT
                                         ,second_state: SECOND_STATE.PEACE
                                         ,energyID    : ""
                                         ,storageID   : ""
                                         ,buildID     : ""
                                         ,repairID    : ""
                                         ,wpx         : -1
                                         ,wpy         : -1
                                         ,tick_to_full: 0
                                         ,spawn_id    : SPAWN_S1_ID
                                        });
    }
  },
  //--------------------------------------------------------------------
  move_to_target : function(builder, target)
  {
    if(builder.fatigue == 0)
      builder.moveTo(target, {reusePath: 10});  
  },
  //--------------------------------------------------------------------
  move_to_xy : function(builder, x, y)
  {
    if(builder.fatigue == 0)
      builder.moveTo(x, y, {reusePath: 10});
  },
  //--------------------------------------------------------------------
  init : function(builder)
  {
    var mem = builder.memory;
    
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

    this.check_and_set_to_get_energy(builder);

    if(iDM == true) console.log(iDM_HEAD + builder.name + " found resource id(" + mem.energyID + ")");
  },
  //--------------------------------------------------------------------
  check_and_set_to_get_energy : function(builder)
  {
    var tickToLive = builder.ticksToLive; 
    var enID = builder.memory.energyID;
    
    if(tickToLive < (builder.memory.tick_to_full + 40))  // 40 ????
    {
      builder.memory.main_state = MAIN_STATE.SUICIDE;
      return;
    }

    var storageID = s1_tool.get_not_empty_storages_id();
    if(storageID.length > 0)
    {
      builder.memory.storageID = storageID;
      builder.memory.main_state = MAIN_STATE.TO_STORAGE;
      return;
    }

    if(s1_tool.energy_is_busy(enID) == true)
    {
      builder.memory.main_state = MAIN_STATE.TO_WAIT;
      return;
    }

    var energy_obj = Game.getObjectById(enID);
    s1_tool.energy_grab(enID);    

    builder.memory.main_state  = MAIN_STATE.TO_FARM;
  },
  //--------------------------------------------------------------------
  check_and_to_build_repaire : function(builder)
  {
    var build_id = s1_tool.get_nearest_build_id(builder);
    if(build_id.length > 0)
    {
      builder.memory.buildID     = build_id;
      builder.memory.main_state  = MAIN_STATE.TO_BUILD;
      return;
    }
    var repair_id = s1_tool.get_nearest_repair_object_id_for_builder(builder);
    if(repair_id.length > 0)
    {
      builder.memory.repairID    = repair_id;
      builder.memory.main_state  = MAIN_STATE.TO_REPAIR;
      return;
    }
    builder.memory.main_state  = MAIN_STATE.SUICIDE;
  },
  //--------------------------------------------------------------------
  to_storage : function(builder)
  {
    var storage_obj = Game.getObjectById(builder.memory.storageID);
    
    if(builder.pos.inRangeTo(storage_obj, 1))
    {
      var res = builder.withdraw(storage_obj, RESOURCE_ENERGY);
      
      if(res == ERR_FULL)
      {
        this.check_and_to_build_repaire(builder);
        return;
      }
      
      if(res != OK)
      {
        this.check_and_set_to_get_energy(builder);
        return;
      }
      
      this.check_and_to_build_repaire(builder);
    }
    else
      this.move_to_target(builder, storage_obj);
  },
  //--------------------------------------------------------------------
  to_farm : function(builder)
  {
    var energy_obj = Game.getObjectById(builder.memory.energyID);
    if(builder.pos.inRangeTo(energy_obj, 1))
      builder.memory.main_state = MAIN_STATE.FARM;
    else
      this.move_to_target(builder, energy_obj);
  },
  //--------------------------------------------------------------------
  farm : function(builder)
  {
    var total = _.sum(builder.carry);

    if(total < builder.carryCapacity)
    {
      var res = builder.harvest(Game.getObjectById(builder.memory.energyID));
      
      if(res != OK)
      {
        builder.memory.main_state = MAIN_STATE.INIT;
        if(eDM == true) console.log(eDM_HEAD + builder.name + " STATE.FARM res(" + res + ")");
        return;
      }
    }
    else
    {
      s1_tool.energy_ungrab(builder.memory.energyID);
      this.check_and_to_build_repaire(builder);
    }
  },
  //--------------------------------------------------------------------
  to_build : function(builder)
  {
    var build_obj = Game.getObjectById(builder.memory.buildID);
    if(build_obj)
    {
      if(builder.pos.inRangeTo(build_obj, 1))
        builder.memory.main_state = MAIN_STATE.BUILD;
      else
        this.move_to_target(builder, build_obj);
    }
    else
      this.check_and_to_build_repaire(builder);
  },
  //--------------------------------------------------------------------
  build : function(builder)
  {
    var res = builder.build(Game.getObjectById(builder.memory.buildID));

    console.log(res);
    if(res == ERR_NOT_ENOUGH_RESOURCES)
    {
      this.check_and_set_to_get_energy(builder);
      return;
    }

    if(res == ERR_INVALID_TARGET) // build is done
    {
      if(iDM == true) console.log(iDM_HEAD + builder.name + " build is done!");

      s1_tool.recalculate_objects();
      
      var total = _.sum(builder.carry);
      if(total > 0)
        this.check_and_to_build_repaire(builder);
      else
        this.check_and_set_to_get_energy(builder);
    }
  },
  //--------------------------------------------------------------------
  to_repair : function(builder)
  {
    var repair_obj = Game.getObjectById(builder.memory.repairID);
    if(repair_obj)
    {
      if(builder.pos.inRangeTo(repair_obj, 1))
        builder.memory.main_state = MAIN_STATE.REPAIR;
      else
        this.move_to_target(builder, repair_obj);
    }
    else
      this.check_and_to_build_repaire(builder);
  },
  //--------------------------------------------------------------------
  repair : function(builder)
  {
    var repairObj = Game.getObjectById(builder.memory.repairID);
    if(repairObj)
    {
      var res = builder.repair(repairObj);

      if(res == ERR_NOT_ENOUGH_RESOURCES)
        this.check_and_set_to_get_energy(builder);

      if(res == ERR_INVALID_TARGET) // repair is done
      {
        if(iDM == true) console.log(iDM_HEAD + builder.name + " repair is done!");
  
        s1_tool.builder_job_is_done();
  
        var total = _.sum(builder.carry);
        if(total > 0)
          this.check_and_to_build_repaire(builder);
        else
          this.check_and_set_to_get_energy(builder);
      }
    }
    else
      this.check_and_to_build_repaire(builder);
  },
  //--------------------------------------------------------------------
  to_wait : function(builder)
  {
    if(builder.pos.inRangeTo(builder.memory.wpx, builder.memory.wpy, 2))
      builder.memory.main_state = MAIN_STATE.WAIT;
    else
      this.move_to_xy(builder, builder.memory.wpx, builder.memory.wpy);
  },
  //--------------------------------------------------------------------
  wait : function(builder)
  {
    if(s1_tool.energy_is_busy(builder.memory.energyID) == false)
    {
      this.check_and_set_to_get_energy(builder);
      return;
    }
  },
  //--------------------------------------------------------------------
  suicide : function(builder)
  {
    //if(iDM == true) console.log(iDM_HEAD + upgrader.name + " AKBAR!");
    console.log(iDM_HEAD + builder.name + " Bye!");
    builder.suicide();
  },
  //--------------------------------------------------------------------
  doing_peace : function(builder)
  {
    //console.log(builder.name + " : " + builder.memory.main_state);
    
    switch(builder.memory.main_state)
    {
      case MAIN_STATE.INIT:       { this.init(builder);       break; } 
      case MAIN_STATE.TO_STORAGE: { this.to_storage(builder); break; } 
      case MAIN_STATE.TO_FARM:    { this.to_farm(builder);    break; } 
      case MAIN_STATE.FARM:       { this.farm(builder);       break; } 
      case MAIN_STATE.TO_BUILD:   { this.to_build(builder);   break; } 
      case MAIN_STATE.BUILD:      { this.build(builder);      break; } 
      case MAIN_STATE.TO_REPAIR:  { this.to_repair(builder);  break; } 
      case MAIN_STATE.REPAIR:     { this.repair(builder);     break; } 
      case MAIN_STATE.TO_WAIT:    { this.to_wait(builder);    break; } 
      case MAIN_STATE.WAIT:       { this.wait(builder);       break; } 
      case MAIN_STATE.SUICIDE:    { this.suicide(builder);    break; } 
    }
  },
  //--------------------------------------------------------------------
  doing_base_is_attacked : function(builder)
  {
  },
  //--------------------------------------------------------------------
  doing : function(builder)
  {
    if(builder.spawning)
        return;
  
    switch(builder.memory.second_state)
    {
      case SECOND_STATE.PEACE:            { this.doing_peace(builder); break; }
      case SECOND_STATE.BASE_IS_ATTACKED: { break; }
    }
  }
};
