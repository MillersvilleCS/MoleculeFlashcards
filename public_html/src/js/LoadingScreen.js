
LoadingScreen = function ( )
{

};

LoadingScreen.prototype = new Screen ( );

LoadingScreen.prototype.onUpdate = function ( delta )
{
    var timeElement = document.getElementById ( "time" );
    timeElement.innerHTML = game.getScreen ( 'game' ).getSecondsLeft ();

    var timeElement = document.getElementById ( "score" );
    timeElement.innerHTML = game.getScreen ( 'game' ).score;

    if ( MouseManager.leftButton.isPressed && this.currentMolecule !== undefined)
    {
        this.currentMolecule.mesh.rotation.z -=
                (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;
        
        this.currentMolecule.mesh.rotation.x +=
                (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
    }
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
