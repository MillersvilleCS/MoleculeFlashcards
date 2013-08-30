( function (window, $) {
    'use strict';

    var TutorialScreen = function ( ) {
        Screen.apply (this, arguments);
    };

    TutorialScreen.prototype = Object.create (Screen.prototype);
    TutorialScreen.prototype.constructor = TutorialScreen;

    TutorialScreen.prototype.onUpdate = function (delta) {

    };

    TutorialScreen.prototype.onPause = function ( ) {

    };

    TutorialScreen.prototype.onLeave = function ( ) {
        $('#tutorialUI').removeClass('active in');
        $('#rightPanel').removeClass('in');
        /*
        $ ('#TutorialScreenUI').fadeOut (500);
        $ ('#rightPanel').fadeOut (300);
        $ ('#tutorialUI').fadeOut (300);
        $ ('#mainMenuUI').delay (300).fadeIn (300);
        */

        disableButtons ( );
    };

    TutorialScreen.prototype.onResume = function ( ) {
        $('#tutorialUI').addClass('active in');
        setTimeout(function () {
            $('#rightPanel').addClass('in');
        }, 2000);
        /*
        $ ('#TutorialScreenUI').fadeIn (500);
        $ ('#mainMenuUI').fadeOut (200);
        $ ('#tutorialUI').delay (200).fadeIn (300);
        $ ('#rightPanel').delay (2000).fadeIn (300);
        */

        enableButtons(this);
    };

    function enableButtons (tutorialScreen) {
        $('#tutorialUI .button[data-logic=\'endTutorial\']').on('click', function () {
            $(this).trigger(new ScreenChangeEvent('menu'));
        });
    }

    function disableButtons ( ) {
        $('#tutorialUI .button').off('click');
    }

    window.TutorialScreen = TutorialScreen;
}) (window, jQuery);
