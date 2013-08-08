
Screen = function ( )
{
    
};

Screen.prototype = {
    constructor: Screen,
    scene: new THREE.Scene ( ),
    onUpdate: function ( delta )
    {
        throw new UnimplementedFunctionException ( "onUpdate" );
    },
    onPause: function ( )
    {
        throw new UnimplementedFunctionException ( "onPause" );
    },
    onLeave: function ( )
    {
        throw new UnimplementedFunctionException ( "onLeave" );
    },
    onResume: function ( )
    {
        throw new UnimplementedFunctionException ( "onResume" );
    }
};
