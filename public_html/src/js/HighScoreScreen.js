
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
    $ ( '#highScoreUI' ).fadeOut( 500 );
};

HighScoreScreen.prototype.onResume = function ( )
{
     $ ( '#highScoreUI' ).fadeIn( 500 );
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
