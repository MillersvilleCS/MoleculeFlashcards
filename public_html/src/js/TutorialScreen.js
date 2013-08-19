( function () {
    'use strict';
    
    var TutorialScreen = function ( ) {
        'use strict';
        Screen.apply (this, arguments);
    };

    TutorialScreen.prototype = Object.create (Screen.prototype);
    TutorialScreen.prototype.constructor = TutorialScreen;

    TutorialScreen.prototype.onUpdate = function (delta) {
        'use strict';
    };

    TutorialScreen.prototype.onPause = function ( ) {
        'use strict';
    };

    TutorialScreen.prototype.onLeave = function ( ) {
        'use strict';
        
        $ ('#TutorialScreenUI').fadeOut (500);
        $ ('#rightPanel').fadeOut (300);
        $ ('#tutorialUI').fadeOut (300);
        $ ('#mainMenuUI').delay (300).fadeIn (300);
        
        disableButtons ( );
    };

    TutorialScreen.prototype.onResume = function ( ) {
        'use strict';
        
        $ ('#TutorialScreenUI').fadeIn (500);
        $ ('#mainMenuUI').fadeOut (200);
        $ ('#tutorialUI').delay (200).fadeIn (300);
        $ ('#rightPanel').delay (2000).fadeIn (300);
        
        enableButtons(this);
    };

    function enableButtons (menuScreen) {
        'use strict';
        
        $('#TutorialScreenUI.button[data-logic="menu"]').on('click', 
            function () {
                'use strict';

                var screenChangeEvent = jQuery.Event("screenChange");
                screenChangeEvent.screenID = "menu";
                menuScreen.getElement().trigger(screenChangeEvent);
            }
        );        
    }

    function disableButtons ( ) {
        'use strict';
        
        $('#TutorialScreenUI.button').off('click');
    }
    
    // export HighScoreScreen
    window.TutorialScreen = TutorialScreen;
}) ();
