TextLoader = function ( )
{
    
};

TextLoader.FILE_READY = 4;
TextLoader.FILE_FOUND = 200;

TextLoader.loadText = function ( url )
{
    /*
    var textFile;
    
    if ( window.XMLHttpRequest )
    {
        textFile = new XMLHttpRequest ( );
    }
    textFile.onreadystatechange = function ( )
    {
        if ( textFile.readyState === TextLoader.FILE_READY && 
                textFile.status === TextLoader.FILE_FOUND )
        {
           allText = textFile.responseText;
           lines = textFile.responseText.split ( '\n' );
           console.log('These are split correctly! Shows them weird in console, good to parse!');
           console.log(lines);
        }    
    };
    textFile.open( "GET", url, true );
    textFile.setRequestHeader( "Content-Type", "text/plain" );
    textFile.send( null );
    */
    var textFile = $.ajax( url )
        .done(function() { console.log(textFile.responseText); })
        .fail(function() { alert("error"); })
        .always(function() { alert("complete"); });
};