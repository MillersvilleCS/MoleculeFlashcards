Game = function ( )
{
    this.screenMap = new Map ( )
};

Game.prototype = {
    constructor: Game,
    currentScreenID: undefined,
    initialized: false,
    init: function ( screenID )
    {
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
        throw new UnimplementedFunctionException ( "update" );
    },
    getCurrentScene: function ( )
    {
        return this.getCurrentScreen ( ).scene;
    },
    getCurrentScreen: function ( )
    {
        return this.screenMap.get ( this.currentScreenID );
    },
    hasScreen: function ( screenID )
    {
        return this.screenMap.contains ( screenID );
    },
    getScreen: function ( screenID )
    {
        return this.screenMap.get ( screenID );
    },
    addScreen: function ( screenID, screen)
    {
        this.screenMap.put ( screenID, screen );  
    },
    swapScreens: function ( screenID )
    {
        this.getCurrentScreen ( ).onLeave ( );
        this.currentScreenID = screenID;
        this.getCurrentScreen ( ).onResume ( );
    }
};



