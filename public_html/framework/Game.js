Game = function ( )
{
    this.screenMap = new Map ( )
    this.screenID = undefined;
};

Game.prototype = {
    constructor: Game,
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
        return this.screenMap.get ( this.screenID );
    },
    hasScreen: function ( screenID )
    {
        return this.screenMap.contains ( screenID );
    },
    getScreen: function ( screenID )
    {
        return this.screenMap.get ( screenID );
    },
    swapScreens: function ( screenID )
    {
        this.getCurrentScreen ( ).onLeave ( );
        this.screenID = screenID;
        this.getCurrentScreen ( ).onResume ( );
    }
};



