FCCommunicationManager = function () {
    'use strict';
    FCCommunicationManager.apply (this, arguments);
};

FCCommunicationManager.prototype = Object.create (CommunicationManager.prototype);
FCCommunicationManager.prototype.constructor = FCCommunicationManager;

FCCommunicationManager.REQUEST_HANDLER_URL = 'http://exscitech.gcl.cis.udel.edu/exscitech_sam/request_handler.php';
FCCommunicationManager.GET_MEDIA_URL = 'http://exscitech.gcl.cis.udel.edu/exscitech_sam/get_media.php';
FCCommunicationManager.MEDIA_PDB = 0;
FCCommunicationManager.MEDIA_IMAGE = 1;

FCCommunicationManager.login = function ( email, password , callback) {
    'use strict';
    /* Tested */
    email = email.toLowerCase ();
    var passwordHash = hex_md5 (password + email);

    var requestObject = {};
    requestObject.request_type = 'login';
    requestObject.email = email;
    requestObject.hash = passwordHash;

    FCCommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.availableGames = function ( auth, callback ) {
    'use strict';
    /* FCCommunicationManager */
    var requestObject = {};
    requestObject.request_type = 'get_avail_flashcard_games';
    requestObject.auth = auth;

    FCCommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.loadFlashcardGame = function ( auth, gameID, callback ) {
    'use strict';
    /* Tested - Ours isn't on there yet I guess */
    var requestObject = {};
    requestObject.request_type = 'load_flashcard_game';
    requestObject.auth = auth;
    requestObject.game_id = gameID;

    FCCommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.endFlashcardGame = function ( auth, gameSessionID, callback ) {
    'use strict';
    var requestObject = {};
    requestObject.request_type = 'end_flashcard_game';
    requestObject.auth = auth;
    requestObject.game_session_id = gameSessionID;

    FCCommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.submitFlashcardAnswer = function ( auth, gameSessionID, questionID, answer, gameTime, callback ) {
    'use strict';
    var requestObject = {};
    requestObject.request_type = 'submit_flashcard_answer';
    requestObject.auth = auth;
    requestObject.game_session_id = gameSessionID;
    requestObject.question_id = questionID;
    requestObject.answer = answer;
    requestObject.game_time = gameTime;

    FCCommunicationManager.post ( FCCommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
};

FCCommunicationManager.getMedia = function ( gameSessionID, mediaType, questionID, callback ) {
    'use strict';
    /* Tested - Pulled back a PDB + other info Sam talked about */
    var requestObject = {};
    requestObject.gsi = gameSessionID;
    requestObject.mt = mediaType;
    requestObject.qid = questionID;

    FCCommunicationManager.get ( FCCommunicationManager.GET_MEDIA_URL, requestObject, callback );
};