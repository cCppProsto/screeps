var builder_role   = require('s1_role_builder');
var harvester_role = require('s1_role_harvester');
var rcl_upgrader_role = require('s1_role_rcl_upgrader');
var s1_tool    = require('s1_tool');

//------------------------------------------------------------------------------

var harvester_count    = 0;
var harvester_max      = 6;  // !! DEPENDS ON COUNT OF SOURCES IN SPAWN ROOM: 1 source = 3 max, 2 source = 6 max, etc.
var harvester_on_src   = 3;

var rcl_upgrader_count    = 0;
var rcl_upgrader_max      = 6;  // !! DEPENDS ON COUNT OF SOURCES IN SPAWN ROOM: 1 source = 3 max, 2 source = 6 max, etc.
var rcl_upgrader_on_src   = 3;

var builder_count    = 0;
var builder_max      = 4;

const CREEP_ROLE =
{
    HARVESTER     : 0
   ,RCL_UPGRADER  : 1
   ,BUILDER       : 2
};

module.exports =
{
    //--------------------------------------------------------------------------
    creeps_doing : function()
    {
        harvester_count    = 0;
        rcl_upgrader_count = 0;
        builder_count      = 0;

        for(var i in Game.creeps)
        {
            if(s1_tool.is_owner_of_creep(i))
            {
                var cr = Game.creeps[i];
                switch(cr.memory.role)
                {
                    case CREEP_ROLE.HARVESTER:
                    {
                        harvester_role.doing(cr);
                        ++harvester_count;
                        break;
                    }
                    case CREEP_ROLE.RCL_UPGRADER:
                    {
                        rcl_upgrader_role.doing(cr);
                        ++rcl_upgrader_count;
                        break;
                    }
                    case CREEP_ROLE.BUILDER:
                    {
                        builder_role.doing(cr);
                        ++builder_count;
                        break;
                    }
                }
            }
        }

        if(harvester_count < harvester_max)
        {
            harvester_role.create();
            return;
        }
        if(rcl_upgrader_count < rcl_upgrader_max)
        {
            rcl_upgrader_role.create();
            return;
        }
        if(builder_count < builder_max)
        {
            var res;
            res = s1_tool.get_build_objects();
            if(res.length > 0)
            {
                builder_role.create();
                return;
            }

            res = s1_tool.get_repair_objects();
            if(res.length > 0)
            {
                builder_role.create();
                return;
            }
            return;
        }
    },
    //--------------------------------------------------------------------------
    processing : function()
    {
        s1 = Game.spawns.s1;

        if(!s1)
            return;

        s1_tool.processing();

        this.creeps_doing();
    }
};
