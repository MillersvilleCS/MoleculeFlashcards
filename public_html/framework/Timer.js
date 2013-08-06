
Timer = function ( )
{

};

Timer.prototype = {
    constructor: Timer,
    startTime: 0,
    stopTime: 0,
    running: false,
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
