(function(window, $) {
    'use strict';

    var HighScoreScreen = function($element) {

        Screen.apply(this, [$element]);
    };

    var $element;

    HighScoreScreen.prototype = Object.create(Screen.prototype);
    HighScoreScreen.prototype.constructor = HighScoreScreen;

    HighScoreScreen.prototype.onUpdate = function(delta) {

    };

    HighScoreScreen.prototype.onPause = function( ) {

    };

    HighScoreScreen.prototype.onLeave = function( ) {
        disableButtons( );
        $('#highScoreUI').fadeOut(500);
    };

    HighScoreScreen.prototype.onResume = function( ) {
        enableButtons(this);
        $('#highScoreUI').fadeIn(500);
    };

    function enableButtons(menuScreen) {
        $('#highScoreUI .button[data-logic=\'menu\']').on('click', function() {
            $(this).trigger(new ScreenChangeEvent('menu'));
        });
    }

    function disableButtons( ) {
        $('#highScoreUI .button').off('click');
    }

    // export HighScoreScreen
    window.HighScoreScreen = HighScoreScreen;
})(window, jQuery);
