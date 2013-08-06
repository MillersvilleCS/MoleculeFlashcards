TextLoader = function ( )
{
    
};

TextLoader.FILE_READY = 4;
TextLoader.FILE_FOUND = 200;

/*
 * Url to retrieve and another function to call on success. 
 * If there is an error, callback function gets 'ERROR'
 */
TextLoader.loadText = function ( url , callback )
{
    var textFile = $.ajax( url )
        .done(function() { callback( textFile.responseText ); })
        .fail(function() { callback( 'ERROR' ); })
        .always(function() {});
};