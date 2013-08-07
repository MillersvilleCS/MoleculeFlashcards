
LoadingScreen = function ( )
{
    this.moleculeCount = 0;

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
    
};

LoadingScreen.prototype.onResume = function ( )
{
   
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
