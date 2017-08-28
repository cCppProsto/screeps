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

const CREEP_ROLE =
{
    HARVESTER         : 0
   ,RCL_UPGRADER      : 1
   ,BUILDER           : 2
   ,MINERAL_HARVESTER : 3
};

const MAIN_STATE =
{
  INIT                    : 0
 ,TO_STORAGE              : 1
 ,TO_FARM                 : 2
 ,FARM                    : 3
 ,FIND_AND_MOVE_TO_BUILD  : 4
 ,BUILD                   : 5
 ,FIND_AND_MOVE_TO_REPAIR : 6
 ,REPAIR                  : 7
 ,TO_WAIT                 : 8
 ,WAIT                    : 9
 ,SUICIDE                 : 10
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
                                        { role        : CREEP_ROLE.BUILDER
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

    this.check_and_set_to_farm(builder);

    if(iDM == true) console.log(iDM_HEAD + builder.name + " found resource id(" + mem.energyID + ")");
  },
  //--------------------------------------------------------------------
  to_storage : function(builder)
  {
  },
  //--------------------------------------------------------------------
  to_farm : function(builder)
  {
  },
  //--------------------------------------------------------------------
  farm : function(builder)
  {
  },
  //--------------------------------------------------------------------
  famt_build : function(builder)
  {
  },
  //--------------------------------------------------------------------
  build : function(builder)
  {
  },
  //--------------------------------------------------------------------
  famt_repair : function(builder)
  {
  },
  //--------------------------------------------------------------------
  repair : function(builder)
  {
  },
  //--------------------------------------------------------------------
  to_wait : function(builder)
  {
  },
  //--------------------------------------------------------------------
  wait : function(builder)
  {
  },
  //--------------------------------------------------------------------
  suicide : function(builder)
  {
  },
  //--------------------------------------------------------------------
  doing_peace : function(builder)
  {
    //console.log(builder.name + " : " + builder.memory.main_state);
    
    switch(builder.memory.main_state)
    {
      case MAIN_STATE.INIT:                   { this.init(builder);       break; } 
      case MAIN_STATE.TO_STORAGE:             { this.to_storage(builder); break; } 
      case MAIN_STATE.TO_FARM:                { this.to_farm(builder);    break; } 
      case MAIN_STATE.FARM:                   { this.farm(builder);       break; } 
      case MAIN_STATE.FIND_AND_MOVE_TO_BUILD: { this.famt_build(builder); break; } 
      case MAIN_STATE.BUILD:                  { this.build(builder);      break; } 
      case MAIN_STATE.FIND_AND_MOVE_TO_REPAIR:{ this.famt_repair(builder);break; } 
      case MAIN_STATE.REPAIR:                 { this.repair(builder);     break; } 
      case MAIN_STATE.TO_WAIT:                { this.to_wait(builder);    break; } 
      case MAIN_STATE.WAIT:                   { this.wait(builder);       break; } 
      case MAIN_STATE.SUICIDE:                { this.suicide(builder);    break; } 
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
