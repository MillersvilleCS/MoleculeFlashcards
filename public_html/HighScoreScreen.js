
HighScoreScreen = function ( )
{

};

HighScoreScreen.prototype = new Screen ( );

HighScoreScreen.prototype.onUpdate = function ( delta )
{

};

HighScoreScreen.prototype.onPause = function ( )
{

};

HighScoreScreen.prototype.onLeave = function ( )
{
    $ ( '#highScoreUI' ).delay ( 500 ).fadeOut ( 1 );
};

HighScoreScreen.prototype.onResume = function ( )
{
     $ ( '#highScoreUI' ).css ( 'display', 'block' );
};

HighScoreScreen.prototype.buttonLogic = function ( button )
{
    switch ( button )
    {
        case 'Main Menu':
            return 'menu';

        default:
            //alert( 'Not Yet Implemented!' );
    }
};
