( function (window, $) {
    'use strict';

    var MenuScreen = function ( $element ) {
        Screen.apply (this, [$element]);
    };
    var topics;
    var $lastTopicElement;

    var TOPIC_HTML = '<div class = \'topic\' data-id = \'$uniqueID\' >' +
                        '<img class = \'topicImage\' src = \'$imageSrc\' width = \'114\' height = \'94\' >' +
                        '<b>$title</b>' + '<br />' +
                        '<div class = \'topicDescription\'>$description</div>' +
                     '</div>';
    var NAMES_HTML = '#$rank $name <br />';
    var SCORES_HTML = '$score <br />';

    MenuScreen.prototype = Object.create (Screen.prototype);
    MenuScreen.prototype.constructor = MenuScreen;

    MenuScreen.prototype.onUpdate = function (delta) {

    };

    MenuScreen.prototype.onPause = function ( ) {

    };

    MenuScreen.prototype.onLeave = function ( ) {
        disableButtons ( );
        $('#mainMenuUI').fadeOut (500);
    };

    MenuScreen.prototype.onResume = function ( ) {
        enableButtons(this);
        $('#gameUI').fadeIn (500);
        $('#mainMenuUI').fadeIn (500);
        FCCommunicationManager.availableGames( UserData.auth, this.showAvailableTopics.bind( this ) );
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
        $('#topicList').html('');
        topics = response.available_games;
        UserData.gameID = topics[0].id;
        UserData.gameTimeLimit = topics[0].time_limit;
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
        $('#topicList').scrollTop( 0 );
        $lastTopicElement = $($('#topicList').children()[0]);
        $lastTopicElement.css('background-color', 'grey');
        this.changeRightPanel ( topics[0] );
    };

    MenuScreen.prototype.changeRightPanel = function ( topic ) {
        $('#timeLimit').html('Time Limit: ' + Timer.getDigitalRep( topic.time_limit / 1000 ) );
        $('#questionCount').html('Number of Questions: ' + topic.q_count );
        $('#names').html('');
        $('#scores').html('');
        var currScores = topic.high_scores;
        for(var i = 0; i < currScores.length; ++i) {
            var keys = [
                '$rank',
                '$name'
            ];
            var values = [
                currScores[i].rank,
                currScores[i].username
            ];
            var scoreKey = [
                '$score'
            ];
            var scoreValue = [
                currScores[i].score
            ];
            this.insertInfo( keys, values, NAMES_HTML, '#names' );
            this.insertInfo( scoreKey, scoreValue, SCORES_HTML, '#scores' );
        }
        UserData.gameID = topic.id;
        UserData.gameTimeLimit = topic.time_limit;
    };

    function enableButtons (menuScreen) {
        $('#mainMenuUI .button[data-logic=\'tutorial\']').on('click', function () {
            $ (this).trigger(new ScreenChangeEvent('tutorial'));
        });

        $('#tutorialUI .button[data-logic=\'endTutorial\']').on('click', function () {
            menuScreen.endTutorial ( );
        });

        $('#mainMenuUI .button[data-logic=\'scores\']').on('click', function () {
//            var screenChangeEvent = jQuery.Event('screenChange');
//            screenChangeEvent.screenID = 'score';
            $ (this).trigger(new ScreenChangeEvent('score'));
        });

        $('#mainMenuUI .button[data-logic=\'start\']').on('click', function () {
//            var screenChangeEvent = jQuery.Event('screenChange');
//            screenChangeEvent.screenID = 'game';
            $ (this).trigger(new ScreenChangeEvent('game'));
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
        $('#topicList').off('click');
    }

    window.MenuScreen = MenuScreen;
}) (window, jQuery);