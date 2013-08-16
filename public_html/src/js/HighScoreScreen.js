( function () {
    'use strict';
    
    var HighScoreScreen = function ( ) {
        Screen.apply (this, arguments);
    };
    
    var $element;

    HighScoreScreen.prototype = Object.create (Screen.prototype);
    HighScoreScreen.prototype.constructor = HighScoreScreen;

    HighScoreScreen.prototype.onUpdate = function (delta) {
    };

    HighScoreScreen.prototype.onPause = function ( ) {
    };

    HighScoreScreen.prototype.onLeave = function ( ) {
        disableButtons ( );
        $ ('#highScoreUI').fadeOut (500);
    };

    HighScoreScreen.prototype.onResume = function ( ) {
        enableButtons(this);
        $ ('#highScoreUI').fadeIn (500);
    };
    
    HighScoreScreen.prototype.getElement = function ( ) {
        if ( !$element ) {
            $element = $ ( '#highScoreUI' );
        }
        return $element;
    };

    function enableButtons (menuScreen) {
        $('#highScoreUI .button[data-logic="menu"]').on('click', function () {
            var screenChangeEvent = jQuery.Event("screenChange");
            screenChangeEvent.screenID = "menu";
            menuScreen.getElement().trigger(screenChangeEvent);
        });        
    }

    function disableButtons ( ) {
        $('#highScoreUI .button').off('click');
    }
    
    // export HighScoreScreen
    window.HighScoreScreen = HighScoreScreen;
}) ( );
