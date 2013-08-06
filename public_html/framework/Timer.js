
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
        this.startTime = new Date ( );
    },
    stop: function ( )
    {
        this.running = false;
        this.stopTime = new Date ( );
    },
    reset: function ( )
    {
        var time = new Date ( );
        this.startTime = time;
        this.stopTime = time;
    },
    getElapsedMs: function ( )
    {
        if ( this.running )
        {
            return new Date - this.startTime;
        }

        return this.stopTime - this.startTime;
    },
    getElapsedSec: function ( )
    {
        return Math.floor ( this.getElapsedMs ( ) / 1000 );
    }
};
