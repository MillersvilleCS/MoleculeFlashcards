Game = function ( )
{
    /**@const*/
    this.screenMap = new Map ( );
};

Game.prototype = {
    constructor: Game,
    currentScreenID: undefined,
    initialized: false,
    init: function ( screenID )
    {
        'use strict';
        if ( this.initialized === false )
        {
            this.initialized = true;
            this.currentScreenID = screenID;
            this.getCurrentScreen ( ).onResume ( );
        }
        else
        {
            throw new AlreadyInitilizedException ( "Game" );
        }
    },
    update: function ( delta )
    {
        'use strict';
        throw new UnimplementedFunctionException ( "update" );
    },
    getCurrentScene: function ( )
    {
        'use strict';
        return this.getCurrentScreen ( ).scene;
    },
    getCurrentScreen: function ( )
    {
        'use strict';
        return this.screenMap.get ( this.currentScreenID );
    },
    hasScreen: function ( screenID )
    {
        'use strict';
        return this.screenMap.contains ( screenID );
    },
    getScreen: function ( screenID )
    {
        'use strict';
        return this.screenMap.get ( screenID );
    },
    addScreen: function ( screenID, screen)
    {
        'use strict';
        this.screenMap.put ( screenID, screen );  
    },
    swapScreens: function ( screenID )
    {
        'use strict';
        this.getCurrentScreen ( ).onLeave ( );
        this.currentScreenID = screenID;
        this.getCurrentScreen ( ).onResume ( );
    }
};



