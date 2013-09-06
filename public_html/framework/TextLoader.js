TextLoader = function( ) {

};

TextLoader.loadText = function(url, callback) {
    var textFile = $.ajax(url)
            .done(function() {
        callback(textFile.responseText);
    })
            .fail(function() {
        callback('ERROR');
    })
            .always(function() {
        //do nothing
    });
};
