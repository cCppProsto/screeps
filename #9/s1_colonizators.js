var s1_tool    = require('s1_tool');

const SPAWN_S1_ID = 1;

// for debug messages
var iDM = false;
var eDM = true;

const iDM_HEAD = "HARVESTER[INFO] ";
const eDM_HEAD = "HARVESTER[ERROR] ";

const controllerForClaimID = "d9cf0772ccaa764";


Game.spawns.s1.memory.isNeedToReinitColonizators = true;

// capacity = 2300
const body_worker_1100 = [WORK, WORK, WORK, WORK, WORK, 
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
                         CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

// lefted 1400
const body_claimer_1400 = [CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE];

const HARVEST_STATE =
{
  INIT                : 0
 ,TO_FARM             : 1
 ,FARM                : 2
 ,TO_TARGET_FOR_CLAIM : 3
 ,WAIT_CLAIMER        : 4
 ,WAIT_CLAIM          : 5
 ,TO_UPGRADE          : 6
};

const CLAIMER_STATE =
{
  INIT                : 0
 ,TO_TARGET_FOR_CLAIM : 1
 ,CLAIM               : 2
 ,SUICIDE             : 3
};

module.exports =
{
  reinit : function()
  {
    if(Game.spawns.s1.memory.isNeedToReinitColonizators == true)
    {
      Game.spawns.s1.memory.harvesterForColonizeID  = "s1ColonHarvester";
      Game.spawns.s1.memory.claimerForColonizeID    = "s1ColonClaimer";
      Game.spawns.s1.memory.controllerForClaimID    = "d9cf0772ccaa764"; 
      
      // reinit
      Game.spawns.s1.memory.isNeedToReinitColonizators = false;
      Game.spawns.s1.memory.colonizeIsDoing = true;
      Game.spawns.s1.memory.isNeedToCreateClaimer = false;
    }
  },
  //--------------------------------------------------------------------
  check_and_create_harvester : function()
  {
    if(Game.creeps['s1ColonHarvester'] == null)
    {
      var current_energy = Game.rooms[Game.spawns.s1.memory.RoomID].energyAvailable;
      if(current_energy >= 1100)
      {
        if(!Game.spawns.s1.spawning)
        {
          var res;
          res = Game.spawns.s1.createCreep(body_worker_1100, 's1ColonHarvester',
                                        { role        : Game.spawns.s1.memory.ColonizatorsRoleID
                                         ,state       : HARVEST_STATE.INIT
                                         ,energyID    : ""
                                         ,claimID     : Game.spawns.s1.memory.controllerForClaimID
                                         ,spawn_id    : SPAWN_S1_ID
                                        });
          console.log("s1ColonHarvester CREATED!!!!!!!!! " + res);
        }
      }
    }
  },
  //--------------------------------------------------------------------
  check_and_create_claimer : function()
  {
    if(Game.spawns.s1.memory.isNeedToCreateClaimer == true)
    {
      if(Game.creeps['s1ColonClaimer'] == null)
      {
        var current_energy = Game.rooms[Game.spawns.s1.memory.RoomID].energyAvailable;
        if(current_energy >= 1400)
        {
          if(!Game.spawns.s1.spawning)
          {
            var res;
            res = Game.spawns.s1.createCreep(body_claimer_1400, 's1ColonClaimer',
                                          { role        : Game.spawns.s1.memory.ColonizatorsRoleID
                                           ,state       : CLAIMER_STATE.INIT
                                           ,claimID     : Game.spawns.s1.memory.controllerForClaimID
                                           ,spawn_id    : SPAWN_S1_ID
                                          });
            console.log("s1ColonClaimer CREATing " + res);
            Game.spawns.s1.memory.isNeedToCreateClaimer = false;
          }
        }
      }
    }
  },
  //--------------------------------------------------------------------
  harvester_doing : function()
  {
    if(Game.creeps['s1ColonHarvester'] == null)
      return;
    
    if(Game.creeps['s1ColonHarvester'].spawning)
      return;
     
    switch(Game.creeps['s1ColonHarvester'].memory.state)
    {
      case HARVEST_STATE.INIT:
      {
        var mem = Game.creeps['s1ColonHarvester'].memory;
        mem.energyID = s1_tool.get_energy_id();
        mem.state    = HARVEST_STATE.TO_FARM;
        break;
      }
      case HARVEST_STATE.TO_FARM:
      {
        var energy_obj = Game.getObjectById(Game.creeps['s1ColonHarvester'].memory.energyID);
        if(Game.creeps['s1ColonHarvester'].pos.inRangeTo(energy_obj, 1))
          Game.creeps['s1ColonHarvester'].memory.state = HARVEST_STATE.FARM;
        else
        {
          if(Game.creeps['s1ColonHarvester'].fatigue == 0)
            Game.creeps['s1ColonHarvester'].moveTo(energy_obj); 
        }
        break;
      }
      case HARVEST_STATE.FARM:
      {
        var total = _.sum(Game.creeps['s1ColonHarvester'].carry);
        if(total < Game.creeps['s1ColonHarvester'].carryCapacity)
          Game.creeps['s1ColonHarvester'].harvest(Game.getObjectById(Game.creeps['s1ColonHarvester'].memory.energyID));
        else
        {
          // create claimer
          Game.creeps['s1ColonHarvester'].memory.state = HARVEST_STATE.TO_TARGET_FOR_CLAIM;
          Game.spawns.s1.memory.isNeedToCreateClaimer = true;
          console.log("Start creating CLAIMER");
        }
        break;
      }
      case HARVEST_STATE.TO_TARGET_FOR_CLAIM:
      {
        if(Game.creeps['s1ColonHarvester'].room.name == Game.spawns.s1.memory.RoomID)
        {
          if(Game.creeps['s1ColonHarvester'].fatigue == 0)
            Game.creeps['s1ColonHarvester'].moveTo(0,22); 
        }
        else
        {
          var claim_obj = Game.getObjectById(Game.creeps['s1ColonHarvester'].memory.claimID);
          if(Game.creeps['s1ColonHarvester'].pos.inRangeTo(claim_obj, 2))
            Game.creeps['s1ColonHarvester'].memory.state = HARVEST_STATE.WAIT_CLAIMER;
          else
            Game.creeps['s1ColonHarvester'].moveTo(claim_obj);
        }
        
        break;
      }
      case HARVEST_STATE.WAIT_CLAIMER:
      {
        console.log("Wait CLAIM!!");
        break;
      }
      case HARVEST_STATE.WAIT_CLAIM:
      {
        Game.creeps['s1ColonHarvester'].suicide();
        break;
      }
      case HARVEST_STATE.TO_UPGRADE:
      {

        var claim_obj = Game.getObjectById(Game.creeps['s1ColonHarvester'].memory.claimID);
        var res = Game.creeps['s1ColonHarvester'].upgradeController(claim_obj);
        if(res != OK)
        {
          Game.spawns.s1.memory.colonizeIsDoing = false;
          console.log("Stop doing");
        }
        break;
      }
    }
  },
  //--------------------------------------------------------------------
  claimer_doing : function()
  {
    if(Game.creeps['s1ColonClaimer'] == null)
      return;
    
    if(Game.creeps['s1ColonClaimer'].spawning)
      return;

    switch(Game.creeps['s1ColonClaimer'].memory.state)
    {
      case CLAIMER_STATE.INIT:
      {
        var mem   = Game.creeps['s1ColonClaimer'].memory;
        mem.state = CLAIMER_STATE.TO_TARGET_FOR_CLAIM;
        break;
      }
      case CLAIMER_STATE.TO_TARGET_FOR_CLAIM:
      {
        if(Game.creeps['s1ColonClaimer'].room.name == Game.spawns.s1.memory.RoomID)
        {
          if(Game.creeps['s1ColonClaimer'].fatigue == 0)
            Game.creeps['s1ColonClaimer'].moveTo(0,22); 
        }
        else
        {
          var claim_obj = Game.getObjectById(Game.creeps['s1ColonClaimer'].memory.claimID);
          if(Game.creeps['s1ColonClaimer'].pos.inRangeTo(claim_obj, 1))
            Game.creeps['s1ColonClaimer'].memory.state = CLAIMER_STATE.CLAIM;
          else
            Game.creeps['s1ColonClaimer'].moveTo(claim_obj);
        }
        break;
      }
      case CLAIMER_STATE.CLAIM:
      {
        var claim_obj = Game.getObjectById(Game.creeps['s1ColonClaimer'].memory.claimID);
        var res = Game.creeps['s1ColonClaimer'].claimController(claim_obj);
        if(Game.creeps['s1ColonHarvester'] != null)
        {
          if(Game.creeps['s1ColonHarvester'].memory.state == HARVEST_STATE.WAIT_CLAIMER)
            Game.creeps['s1ColonHarvester'].memory.state = HARVEST_STATE.TO_UPGRADE;
        }
        break;
      }
      case CLAIMER_STATE.SUICIDE:
      {
        break;
      }
    }
  },
  //--------------------------------------------------------------------
  doing : function()
  {      
    this.reinit();

    if(Game.spawns.s1.memory.colonizeIsDoing == false)
      return;
    
    this.check_and_create_harvester();
    this.check_and_create_claimer();
    
    this.harvester_doing();
    this.claimer_doing();
  }
}






