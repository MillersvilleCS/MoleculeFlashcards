( function () {
    'use strict';
    
    var MenuScreen = function ( data ) {
        Screen.apply (this, arguments);

        this.dataRef = data;
    };
    
    var $element;
    var topics;
    var currentTopic = 0;

    var TOPIC_HTML = '<div class = \'topic\' id = \'$uniqueID\' >' +
                        '<img class = \'topicImage\' src = \'$imageSrc\' width = \'114\' height = \'94\' >' +
                        '<b>$title</b>' + '<br />' +
                        '<div class = \'topicDescription\'>$description</div>' +
                     '</div>';

    MenuScreen.prototype = Object.create (Screen.prototype);
    MenuScreen.prototype.constructor = MenuScreen;

    MenuScreen.prototype.onUpdate = function (delta) {
    };

    MenuScreen.prototype.onPause = function ( ) {
    };

    MenuScreen.prototype.onLeave = function ( ) {
        disableButtons ( );
        $ ('#mainMenuUI').fadeOut (500);
    };

    MenuScreen.prototype.onResume = function ( ) {
        enableButtons(this);
        $ ('#gameUI').fadeIn (500);
        $ ('#mainMenuUI').fadeIn (500);
        FCCommunicationManager.availableGames( this.dataRef.auth, this.showAvailableTopics.bind( this ) );
    };
    
    MenuScreen.prototype.getElement = function ( ) {
        if ( !$element ) {
            $element = $ ( '#mainMenuUI' );
        }
        return $element;
    };

    MenuScreen.prototype.tempImageChange = function ( imageSrc ) {
        /* Until this is running on the exscitech server, we need to give an absolute path */

        return 'http://exscitech.gcl.cis.udel.edu/' + imageSrc.substr(2, imageSrc.length - 2);
    };

    MenuScreen.prototype.insertInfo = function ( keys, values, base, location ) {
        var workingHTML = base;
        for(var i = 0; i < keys.length; ++i) {
            workingHTML = workingHTML.replace( keys[i], values[i] );
        }

        $( location ).append( workingHTML );
    };

    MenuScreen.prototype.showAvailableTopics = function ( response ) {
        topics = response.available_games;
        for( var i = 0; i < topics.length; ++i ) {
            var keys = [
                '$title', 
                '$description',
                '$imageSrc',
                '$uniqueID'
            ];
            var values = [
                topics[i].name, 
                topics[i].description,
                this.tempImageChange ( topics[i].image ),
                'divID' + i
            ];
            this.insertInfo( keys, values, TOPIC_HTML, '#topicList' );
            topics[i].divID = i;
        }
    };

    MenuScreen.prototype.tutorial = function ( ) {
        $ ('#mainMenuUI').fadeOut (200);
        $ ('#tutorialUI').delay (200).fadeIn (300);
        $ ('#rightPanel').delay (2000).fadeIn (300);
        //$ ( '#rightPanel' ).delay ( 10000 ).fadeOut ( 300 );
        //$ ( '#tutorialUI' ).delay ( 12000 ).fadeOut ( 300 );
        //$ ( '#mainMenuUI' ).delay ( 12000 ).fadeIn ( 300 );
    };

    MenuScreen.prototype.endTutorial = function ( ) {
        $ ('#rightPanel').fadeOut (300);
        $ ('#tutorialUI').fadeOut (300);
        $ ('#mainMenuUI').delay (300).fadeIn (300);
    };

//    MenuScreen.prototype.buttonLogic = function (button) {
//        switch (button) {
//            case 'Play':
//                return 'game';
//
//            case 'TUTORIAL':
//                this.tutorial ( );
//                break;
//
//            case 'Tutorial Return':
//                this.endTutorial ( );
//                break;
//
//            case 'HIGH SCORES':
//                return 'score';
//
//            case 'Main Menu':
//                return 'menu';
//
//            default:
//                //alert( 'Not Yet Implemented!' );
//        }
//    };

    function enableButtons (menuScreen) {
        $('#mainMenuUI .button[data-logic="play"]').on('click', function () {
            var screenChangeEvent = jQuery.Event("screenChange");
            screenChangeEvent.screenID = "game";
            menuScreen.getElement().trigger(screenChangeEvent);
        });
        
        $('#mainMenuUI .button[data-logic="tutorial"]').on('click', function () {
            menuScreen.tutorial ( );
        });
        
        $('#mainMenuUI .button[data-logic="endTutorial"]').on('click', function () {
            menuScreen.endTutorial ( );
        });
        
        $('#mainMenuUI .button[data-logic="scores"]').on('click', function () {
            var screenChangeEvent = jQuery.Event("screenChange");
            screenChangeEvent.screenID = "score";
            menuScreen.getElement().trigger(screenChangeEvent);
        });
        
        $('#mainMenuUI .button[data-logic="menu"]').on('click', function () {
            var screenChangeEvent = jQuery.Event("screenChange");
            screenChangeEvent.screenID = "menu";
            menuScreen.getElement().trigger(screenChangeEvent);
        });
        
    }

    function disableButtons ( ) {
        $('#mainMenuUI .button').off('click');
    }
    
    // export MenuScreen
    window.MenuScreen = MenuScreen;
}) ( );