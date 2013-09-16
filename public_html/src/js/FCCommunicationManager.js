FCCommunicationManager = function () {
    
};

FCCommunicationManager.REQUEST_HANDLER_URL = 'http://docktest.gcl.cis.udel.edu/exscitech_sam/request_handler.php';
FCCommunicationManager.GET_MEDIA_URL = 'http://docktest.gcl.cis.udel.edu/exscitech_sam/get_media.php';
FCCommunicationManager.MEDIA_PDB = 0;
FCCommunicationManager.MEDIA_IMAGE = 1;
FCCommunicationManager.errorCallback = undefined;

FCCommunicationManager.login = function ( email, password , callback) {
    'use strict';
    email = email.toLowerCase ();
    var passwordHash = hex_md5 (password + email);

    var requestObject = {};
    requestObject.request_type = 'login';
    requestObject.email = email;
    requestObject.hash = passwordHash;

    CommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.register = function ( email, password , username, callback) {
    'use strict';
    email = email.toLowerCase ();

    var requestObject = {};
    requestObject.request_type = 'register';
    requestObject.email = email;
    requestObject.password = password;
    requestObject.username = username;

    CommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.availableGames = function ( auth, callback ) {
    'use strict';
    var requestObject = {};
    requestObject.request_type = 'get_avail_flashcard_games';
    requestObject.authenticator = auth;

    CommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.loadFlashcardGame = function ( auth, gameID, callback ) {
    'use strict';
    var requestObject = {};
    requestObject.request_type = 'load_flashcard_game';
    requestObject.authenticator = auth;
    requestObject.game_id = gameID;

    CommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.endFlashcardGame = function ( auth, gameSessionID, gameTime, callback ) {
    'use strict';
    var requestObject = {};
    requestObject.request_type = 'end_flashcard_game';
    requestObject.authenticator = auth;
    requestObject.game_session_id = gameSessionID;
    requestObject.game_time = gameTime;

    CommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.submitFlashcardAnswer = function ( auth, gameSessionID, questionID, answer, gameTime, callback ) {
    'use strict';
    var requestObject = {};
    requestObject.request_type = 'submit_flashcard_answer';
    requestObject.authenticator = auth;
    requestObject.game_session_id = gameSessionID;
    requestObject.question_id = questionID;
    requestObject.answer = answer;
    requestObject.game_time = gameTime;

    CommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.getHighScores = function ( gameID, startingRank, range, callback ) {
    'use strict';
    var requestObject = {};
    requestObject.request_type = 'get_high_scores';
    requestObject.game_id = gameID;
    requestObject.starting_rank = startingRank;
    requestObject.range = range;

    CommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.getMedia = function ( gameSessionID, mediaType, questionID, callback ) {
    'use strict';
    var requestObject = {};
    requestObject.gsi = gameSessionID;
    requestObject.mt = mediaType;
    requestObject.qid = questionID;

    CommunicationManager.get ( FCCommunicationManager.GET_MEDIA_URL, requestObject, callback );
};

FCCommunicationManager.error = function ( info ) {
    if(CommunicationManager.retryCount > 0) {
        $('#retryCount').text('Retry attempts: ' + CommunicationManager.retryCount);
    } else {
        $('#retryCount').empty();
    }
    $('#errorCode').text(info.status);
    $('#errorMessage').addClass('in activeTop');

    if( FCCommunicationManager.errorCallback != undefined ) {
        FCCommunicationManager.errorCallback();
    }
};

CommunicationManager.errorCallback = FCCommunicationManager.error;