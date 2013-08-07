
Timer = function ( )
{
    this.startTime = 0,
    this.stopTime = 0,
    this.running = false;
};

Timer.prototype = {
    constructor: Timer,
    start: function ( )
    {
        this.running = true;
        this.startTime = Date.now ( );
    },
    stop: function ( )
    {
        this.running = false;
        this.stopTime = Date.now ( );
    },
    reset: function ( )
    {
        var time = Date.now ( );
        this.startTime = time;
        this.stopTime = time;
    },
    getElapsedMs: function ( )
    {
        if ( this.running )
        {
            return Date.now ( ) - this.startTime;
        }

        return this.stopTime - this.startTime;
    },
    getElapsedSec: function ( )
    {
        return Math.floor ( this.getElapsedMs ( ) / 1000 );
    }

};

Timer.getDigitalRep = function ( seconds )
{
    var minutes = Math.floor ( seconds / 60 );
    seconds = seconds - minutes * 60;

    var digitalRep = undefined;
    if ( seconds < 10 )
    {
        digitalRep = minutes + ':0' + seconds;
    }
    else
    {
        digitalRep = minutes + ':' + seconds;
    }

    return digitalRep;
};
