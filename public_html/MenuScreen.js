/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
MenuScreen = function ( )
{
    this.scene = new THREE.Scene ( );
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

};

MenuScreen.prototype.onResume = function ( )
{

};

MenuScreen.prototype.buttonLogic = function( button )
{
    switch ( button )
    {
        case 'START':
            $( '#mainMenuUI' ).fadeOut ( 500 );
            return 'game';

        case 'HIGH SCORES':
            $( 'canvas' ).css('display', 'none' );
            $( '#mainMenuUI' ).fadeOut ( 500 );
            $( '#gameUI' ).fadeOut ( 500 );
            $( '#highScoreUI' ).css ( 'display', 'block' );
            break;
            
        case 'Main Menu':
            $( '#mainMenuUI' ).fadeIn ( 500 );
            $( '#gameUI' ).fadeIn ( 500 );
            $( '#highScoreUI' ).delay ( 500 ).fadeOut ( 1 );
            $( 'canvas' ).delay ( 500 ).fadeIn ( 1 );
            return 'menu';
            
        default:
            alert( 'Not Yet Implemented!' );
    }
};