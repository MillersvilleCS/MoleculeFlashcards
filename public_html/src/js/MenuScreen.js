( function () {
    'use strict';
    
    var MenuScreen = function ( data ) {
        'use strict';
        Screen.apply (this, arguments);

        this.dataRef = data;
        this.dataRef.gameID = 0;
    };
    var topics;
    var $lastTopicElement;

    var TOPIC_HTML = '<div class = \'topic\' data-id = \'$uniqueID\' >' +
                        '<img class = \'topicImage\' src = \'$imageSrc\' width = \'114\' height = \'94\' >' +
                        '<b>$title</b>' + '<br />' +
                        '<div class = \'topicDescription\'>$description</div>' +
                     '</div>';
    var SCORES_HTML = '$rank $name $score <br />';

    MenuScreen.prototype = Object.create (Screen.prototype);
    MenuScreen.prototype.constructor = MenuScreen;

    MenuScreen.prototype.onUpdate = function (delta) {
        'use strict';
    };

    MenuScreen.prototype.onPause = function ( ) {
        'use strict';
    };

    MenuScreen.prototype.onLeave = function ( ) {
        'use strict';
        disableButtons ( );
        $ ('#mainMenuUI').fadeOut (500);
    };

    MenuScreen.prototype.onResume = function ( ) {
        'use strict';
        enableButtons(this);
        $ ('#gameUI').fadeIn (500);
        $ ('#mainMenuUI').fadeIn (500);
        FCCommunicationManager.availableGames( this.dataRef.auth, this.showAvailableTopics.bind( this ) );
    };

    MenuScreen.prototype.tempImageChange = function ( imageSrc ) {
        'use strict';
        /* Until this is running on the exscitech server, we need to give an absolute path */
        return 'http://exscitech.gcl.cis.udel.edu/' + imageSrc.substr(2, imageSrc.length - 2);
    };

    MenuScreen.prototype.insertInfo = function ( keys, values, base, location ) {
        'use strict';
        var workingHTML = base;
        for(var i = 0; i < keys.length; ++i) {
            workingHTML = workingHTML.replace( keys[i], values[i] );
        }

        $( location ).append( workingHTML );
    };

    MenuScreen.prototype.showAvailableTopics = function ( response ) {
        'use strict';
        topics = response.available_games;
        this.dataRef.gameID = topics[0].id;
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
                i
            ];
            this.insertInfo( keys, values, TOPIC_HTML, '#topicList' );
            topics[i].dataID = i;
        }
        $lastTopicElement = $($('#topicList').children()[0]);
        $lastTopicElement.css('background-color', 'grey');
        this.changeRightPanel ( topics[0] );
    };

    MenuScreen.prototype.changeRightPanel = function ( topic ) {
        'use strict';
        $('#timeLimit').html('Time Limit: ' + Timer.getDigitalRep( topic.time_limit / 1000 ) );
        $('#highScores').html('');
        var currScores = topic.high_scores;
        for(var i = 0; i < currScores.length; ++i) {
            var keys = [
                '$rank',
                '$name',
                '$score'
            ];
            var values = [
                currScores[i].rank,
                currScores[i].username,
                currScores[i].score
            ];
            this.insertInfo( keys, values, SCORES_HTML, '#highScores' );
        }
        this.dataRef.gameID = topic.id;
    };

    MenuScreen.prototype.tutorial = function ( ) {
        'use strict';
       
    };

    MenuScreen.prototype.endTutorial = function ( ) {
       
    };

    function enableButtons (menuScreen) {
        $('#mainMenuUI .button[data-logic=\'play\']').on('click', function () {
            var screenChangeEvent = jQuery.Event('screenChange');
            screenChangeEvent.screenID = 'game';
            menuScreen.$element.trigger(screenChangeEvent);
        });
        
        $('#mainMenuUI .button[data-logic=\'tutorial\']').on('click', function () {
            menuScreen.tutorial ( );
        });
        
        $('#tutorialUI .button[data-logic=\'endTutorial\']').on('click', function () {
            menuScreen.endTutorial ( );
        });
        
        $('#mainMenuUI .button[data-logic=\'scores\']').on('click', function () {
            var screenChangeEvent = jQuery.Event('screenChange');
            screenChangeEvent.screenID = 'score';
            menuScreen.$element.trigger(screenChangeEvent);
        });

        $('#mainMenuUI .button[data-logic=\'start\']').on('click', function () {
            var screenChangeEvent = jQuery.Event('screenChange');
            screenChangeEvent.screenID = 'game';
            menuScreen.$element.trigger(screenChangeEvent);
        });
        
        $('#topicList').on('click', '.topic[data-id]' , function (e) {
            menuScreen.changeRightPanel ( topics[$(this).data('id')] );
            $lastTopicElement.css('background-color', 'transparent');
            $(this).css('background-color', 'grey');
            $lastTopicElement = $(this);
        });
    }

    function disableButtons ( ) {
        $('#mainMenuUI .button').off('click');
        $('#tutorialUI .button').off('click');
    }
    
    window.MenuScreen = MenuScreen;
}) ( );