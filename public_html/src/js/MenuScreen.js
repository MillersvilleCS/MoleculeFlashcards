
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

MenuScreen.prototype.tutorial = function ( )
{
    $ ( '#mainMenuUI' ).fadeOut ( 200 );
    $ ( '#tutorialUI' ).delay ( 200 ).fadeIn ( 300 );
    $ ( '#rightPanel' ).delay ( 2000 ).fadeIn ( 300 );
    //$ ( '#rightPanel' ).delay ( 10000 ).fadeOut ( 300 );
    //$ ( '#tutorialUI' ).delay ( 12000 ).fadeOut ( 300 );
    //$ ( '#mainMenuUI' ).delay ( 12000 ).fadeIn ( 300 );
};

MenuScreen.prototype.endTutorial = function ( )
{
    $ ( '#rightPanel' ).fadeOut ( 300 );
    $ ( '#tutorialUI' ).fadeOut ( 300 );
    $ ( '#mainMenuUI' ).delay ( 300 ).fadeIn ( 300 );
};

MenuScreen.prototype.buttonLogic = function ( button )
{
    switch ( button )
    {
        case 'Play':
            return 'game';

        case 'TUTORIAL':
            this.tutorial ( );
            break;

        case 'Tutorial Return':
            this.endTutorial ( );
            break;

        case 'HIGH SCORES':
            return 'score';

        case 'Main Menu':
            return 'menu';

        default:
            //alert( 'Not Yet Implemented!' );
    }
};
