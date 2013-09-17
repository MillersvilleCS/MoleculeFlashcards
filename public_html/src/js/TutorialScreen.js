(function(window, $) {
    'use strict';

    var TutorialScreen = function( ) {
        Screen.apply(this, arguments);
    };

    TutorialScreen.prototype = Object.create(Screen.prototype);
    TutorialScreen.prototype.constructor = TutorialScreen;

    TutorialScreen.prototype.onUpdate = function(delta) {

    };

    TutorialScreen.prototype.onPause = function( ) {

    };

    TutorialScreen.prototype.onLeave = function( ) {
        $('#tutorialUI').removeClass('active in');
        $('#rightPanel').removeClass('in');

        disableButtons( );
    };

    TutorialScreen.prototype.onResume = function( ) {
        $('#tutorialUI').addClass('active in');
        $('#rightPanel').addClass('in');

        enableButtons(this);
    };

    function enableButtons(tutorialScreen) {
        $('#tutorialUI').find('.button[data-logic=\'endTutorial\']')
                .on('click', function() {
            $(this).trigger(new ScreenChangeEvent('menu'));
        });
    }

    function disableButtons( ) {
        $('#tutorialUI').find('.button').off('click');
    }

    window.TutorialScreen = TutorialScreen;
})(window, jQuery);
