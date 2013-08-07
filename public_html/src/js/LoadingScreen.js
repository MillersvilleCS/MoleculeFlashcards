
LoadingScreen = function ( )
{

};

LoadingScreen.prototype = new Screen ( );

LoadingScreen.prototype.onUpdate = function ( delta )
{

};

LoadingScreen.prototype.onPause = function ( )
{

};

LoadingScreen.prototype.onLeave = function ( )
{
    $ ( '#loadingUI' ).fadeOut ( 1 );
};

LoadingScreen.prototype.onResume = function ( )
{
    $ ( '#loadingUI' ).fadeIn( 1 );
};

LoadingScreen.prototype.buttonLogic = function ( button )
{
    switch ( button )
    {
        case 'Begin':
            return 'game';

        default:
            //alert( 'Not Yet Implemented!' );
    }
};
