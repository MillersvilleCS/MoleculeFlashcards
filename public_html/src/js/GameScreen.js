(function(window, $) {
    'use strict';

    var GameScreen = function($element) {
        Screen.apply(this, [$element]);

        this.timer = new Timer( );
        this.userAnswers = new Map( );

        this.gameLength = 120;

        this.scoreManager = new ScoreManager( );

        this.defaultHTML = $('#gameButtons').html();

        this.loadingState = undefined;
        this.questionList = undefined;
        this.gameData = undefined;
        this.currentQuestion = undefined;
        this.currentAnswer = undefined;
        this.questionIterator = undefined;

        var pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.position.set(0, 0, 130);
        this.scene.add(pointLight);
    };

    var BUTTON_HTML = '<div id="$refId" class="button" data-logic="$id">$text</div>';
    var QUESTION_MOLECULE = 0;
    var QUESTION_TEXT = 1;
    var QUESTION_ID = 2;
    var QUESTION_ANSWERS = 3;

    GameScreen.prototype = Object.create(Screen.prototype);
    GameScreen.prototype.constructor = GameScreen;

    GameScreen.prototype.onUpdate = function(delta) {
        if(this.getSecondsLeft() === 0 && this.currentQuestion !== undefined) {
            this.endGame( );
        }

        if(this.getSecondsLeft( ) <= 15) {
            $('#time').css('color', 'red');
        }

        $('#time').text(Timer.getDigitalRep(this.getSecondsLeft( )));
        $('#score').text(this.scoreManager.score);

        if(MouseManager.leftButton.isPressed && this.currentQuestion !== undefined) {
            this.currentQuestion[QUESTION_MOLECULE].rotation.z -=
                    (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;

            this.currentQuestion[QUESTION_MOLECULE].rotation.x +=
                    (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
        }
    };

    GameScreen.prototype.onPause = function( ) {
        if( this.timer.running ) {
            this.timer.stop();
        }
    };

    GameScreen.prototype.onLeave = function( ) {
        FCCommunicationManager.errorCallback = undefined;
        disableReturnButton( );
        $('#gameButtons').html(this.defaultHTML);
        $('#gameCompletedUI').removeClass('in active');
        $('#rightPanel').removeClass('in');
        $('#questionPanel')
            .removeClass('in active')
            .empty();
        $('#time')
                .css('color', '#F8F8FE')
                .text('2:00');
        $('#score').text('0');

        this.scoreManager.reset( );
    };

    GameScreen.prototype.onResume = function( ) {
        function receiveQuestionList(data) {
            this.gameData = data;
            this.loadingState = 0;
            $('#loadingMessage').text('Loading');
            /* Assumes at least 1 question */
            FCCommunicationManager.getMedia(
                    this.gameData.game_session_id,
                    FCCommunicationManager.MEDIA_PDB,
                    this.gameData.questions[this.loadingState].id,
                    this.createPDB.bind(this));
        }

        $('#loadingUI').addClass('in active');
        $('#rightPanel').addClass('in');
        $('#questionPanel').addClass('active');

        FCCommunicationManager.errorCallback = this.onPause.bind(this);
        this.timer.reset();
        this.questionList = [];
        this.loadingState = 0;

        FCCommunicationManager.loadFlashcardGame(UserData.auth, UserData.gameID, receiveQuestionList.bind(this));
    };

    GameScreen.prototype.getSecondsLeft = function() {
        var time = this.gameLength - this.timer.getElapsedSec();
        return (time > 0) ? time : 0;
    };

    GameScreen.prototype.startGame = function( ) {
        $('#beginButton').removeClass('in');
        $('#loadingUI').removeClass('in active');

        this.gameLength = UserData.gameTimeLimit / 1000;
        this.questionIterator = new Iterator(this.questionList);

        this.timer.start();
        this.nextQuestion( );
    };

    GameScreen.prototype.createPDB = function(data) {
        /* Pulls in PDB's for each question and builds them */
        /* Update Loading Text */
        var loadingString = 'Loading';
        for(var i = 0; i < (this.loadingState / 2) % 3; ++i) {
            loadingString += '.';
        }
        $('#loadingMessage').text(loadingString);
        $('#loadingMessage').removeClass('readyText');
        /* Build Molecule */
        var molecule = MoleculeGeometryBuilder.load(data, 0.25, 15, 1, 0);
        if( molecule != undefined ) {
            molecule.position = new THREE.Vector3(-1, -1, 0);
            molecule.scale = new THREE.Vector3(0.5, 0.5, 0.5);

            this.questionList.push([molecule,
                this.gameData.questions[this.loadingState].text,
                this.gameData.questions[this.loadingState].id,
                this.gameData.questions[this.loadingState].answers]);   

            this.loadingState++;
            if(this.loadingState < this.gameData.questions.length) {          

                FCCommunicationManager.getMedia(this.gameData.game_session_id,
                        FCCommunicationManager.MEDIA_PDB,
                        this.gameData.questions[this.loadingState].id,
                        this.createPDB.bind(this));
            } else {
                enableButtons(this);
                /*
                $('#loadingMessage')
                        .text('Ready')
                        .css({
                    'padding-left': '0px',
                    'text-align': 'center'
                });
    */
                $('#loadingMessage').text('Ready');
                $('#loadingMessage').addClass('readyText');
                $('#beginButton').addClass('in');
            }
        } else {
            /* 
                Cannot do a proper error here (easily).
                The Last-request was not set because the get request
                technically "succeeded" but pulled the school's wifi
                login instead. MoleculeGeometryBuilder will return an
                undefined when it crashes parsing. This will handle it
                "gracefully". The likelyhood of this error is incredibly
                low. The only causes are if the school wifi logs you out
                while the loading screen is up (< 10 seconds) or if there
                is a corrupted file.
            */
            alert('A fatal error has occurred. Please log-in to the wifi! Error 407.\n\n' +
                  'Please contact ' + 'saschlac' + '@udel' + '.edu' + ' if this problem persists.');
            this.loadingState--;
            FCCommunicationManager.getMedia(this.gameData.game_session_id,
                    FCCommunicationManager.MEDIA_PDB,
                    this.gameData.questions[this.loadingState].id,
                    this.createPDB.bind(this));
        }
    };

    GameScreen.prototype.nextQuestion = function( ) {
        function insertInfo(replacements, templateString, selector) {
            var result = templateString;
            for(var key in replacements) {
                result = result.replace(key, replacements[key]);
            }

            $(selector).append(result);
        }

        function setQuestionText(questionText) {
            if(questionText) {
                $('#questionPanel')
                    .text(questionText)
                    .addClass('in');
            } else {
                $('#questionPanel')
                    .empty()
                    .removeClass('in');
            }
        }

        function setButtons(answers) {
            $('#gameButtons').empty();
            answers.forEach(function(answer) {
                insertInfo({
                    '$refId': answer.id,
                    '$id': answer.id,
                    '$text': answer.text
                },
                BUTTON_HTML, '#gameButtons');
            });
        }

        this.userAnswers = new Map( );
        if(this.questionIterator.hasNext( )) {
            if(this.questionIterator.index !== -1) {
                this.scene.remove(this.currentQuestion[ QUESTION_MOLECULE ]);
            }
            this.currentQuestion = this.questionIterator.next( );
            this.scene.add(this.currentQuestion[ QUESTION_MOLECULE ]);
            setQuestionText(this.currentQuestion[ QUESTION_TEXT ]);
            setButtons(this.currentQuestion[ QUESTION_ANSWERS ]);
        } else {
            this.endGame( );
        }
    };

    GameScreen.prototype.answerQuestion = function(data) {
        if( !this.timer.running ) {
            //this.timer.start();
            /* This code is executed if there was a connection error mid-game, kick to menu on reload */
            /* Must call change event async */
            setTimeout(
                function( ref, QUESTION_MOLECULE ) {
                    FCCommunicationManager.errorCallback = undefined;
                    disableButtons( );
                    ref.scene.remove(ref.currentQuestion[ QUESTION_MOLECULE ]);
                    ref.currentQuestion = undefined;
                    ref.timer.stop( );
                    $('#gameUI').trigger(new ScreenChangeEvent('menu'));
                },
                1, this, QUESTION_MOLECULE
            );

            return;
        }

        if(data.correct === 'true') {
            this.scoreManager.correct(data.score - this.scoreManager.score);
            this.nextQuestion();
        } else {
            this.scoreManager.incorrect(data.score - this.scoreManager.score);
            $('#scoreChange, #' + this.currentAnswer).addClass('incorrect');
        }
        $('#scoreChange').text(this.scoreManager.text()).addClass('flashInOut');
    };

    GameScreen.prototype.pollAnswer = function(userAnswer, currentQuestion) {
        this.currentAnswer = userAnswer;
        FCCommunicationManager.submitFlashcardAnswer(
                UserData.auth,
                this.gameData.game_session_id,
                this.currentQuestion[QUESTION_ID],
                userAnswer,
                this.timer.getElapsedMs(),
                this.answerQuestion.bind(this)
                );
    };

    GameScreen.prototype.endGame = function( ) {
        function allowExit(response) {
            $('#finalScore').text('Final Score: ' + response.final_score);
            $('#rank').text('Rank: #' + response.rank);
            $('#gameCompletedUI').addClass('in active');

            this.scoreManager.correct(response.final_score - this.scoreManager.score);
            setTimeout(
                function( ref ) {
                    $('#scoreChange').text('+Time: ' + ref.scoreManager.text()).addClass('flashInOut long');
                },
            1000, this);
        }
        disableButtons( );
        this.scene.remove(this.currentQuestion[ QUESTION_MOLECULE ]);
        this.currentQuestion = undefined;
        this.timer.stop( );
        FCCommunicationManager.endFlashcardGame(UserData.auth,
                this.gameData.game_session_id,
                this.timer.getElapsedMs(),
                allowExit.bind(this));
    };

    function enableButtons(gameScreen) {
        $('#gameUI').find('.button[data-logic=\'return\']').on('click', function() {
            $(this).trigger(new ScreenChangeEvent('menu'));
        });

        $('#gameButtons').on('click', '.button[data-logic]', function() {
            var answer = $(this).data('logic');
            if(!gameScreen.userAnswers.contains(answer)) {
                gameScreen.pollAnswer(answer);
                gameScreen.userAnswers.put(answer);
            }
        });

        $('#loadingUI').find('.button[data-logic=\'begin\']').on('click', function() {
            $('#loadingUI').find('.button').off('click');
            gameScreen.startGame( );
        });

        $('#scoreChange').on('animationend webkitAnimationEnd ', function() {
            $(this).removeClass('flashInOut incorrect long');
        });
    }

    function disableButtons( ) {
        $('#gameButtons').off('click');
        $('#loadingUI').find('.button').off('click');
    }

    function disableReturnButton( ) {
        $('#gameUI').find('.button').off('click');
    }

    window.GameScreen = GameScreen;
})(window, jQuery);
