
MenuScreen = function ( )
{

};

MenuScreen.prototype = new Screen ( );

MenuScreen.prototype.onUpdate = function ( delta )
{

};

MenuScreen.prototype.onPause = function ( )
{

};

MenuScreen.prototype.onLeave = function ( )
{
    $ ( '#mainMenuUI' ).fadeOut ( 500 );
};

MenuScreen.prototype.onResume = function ( )
{
    $ ( '#gameUI' ).fadeIn ( 500 );
    $ ( '#mainMenuUI' ).fadeIn ( 500 );
};

MenuScreen.prototype.buttonLogic = function ( button )
{
    switch ( button )
    {
        case 'Play':
            return 'game';

        case 'HIGH SCORES':
            return 'score';

        case 'Main Menu':
            return 'menu';

        default:
            //alert( 'Not Yet Implemented!' );
    }
};
