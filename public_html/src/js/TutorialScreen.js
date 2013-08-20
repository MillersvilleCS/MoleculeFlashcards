( function () {
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
        $ ('#TutorialScreenUI').fadeOut (500);
        $ ('#rightPanel').fadeOut (300);
        $ ('#tutorialUI').fadeOut (300);
        $ ('#mainMenuUI').delay (300).fadeIn (300);
        
        disableButtons ( );
    };

    TutorialScreen.prototype.onResume = function ( ) {
        $ ('#TutorialScreenUI').fadeIn (500);
        $ ('#mainMenuUI').fadeOut (200);
        $ ('#tutorialUI').delay (200).fadeIn (300);
        $ ('#rightPanel').delay (2000).fadeIn (300);
        
        enableButtons(this);
    };

    function enableButtons (menuScreen) {
        $('#TutorialScreenUI.button[data-logic=\'menu\']').on('click', 
            function () {
                

                var screenChangeEvent = jQuery.Event('screenChange');
                screenChangeEvent.screenID = 'menu';
                menuScreen.getElement().trigger(screenChangeEvent);
            }
        );        
    }

    function disableButtons ( ) {
        $('#TutorialScreenUI.button').off('click');
    }
    
    window.TutorialScreen = TutorialScreen;
}) ();
