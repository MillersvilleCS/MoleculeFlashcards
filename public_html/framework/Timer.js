Timer = function() {
    this.startTime = 0;
    this.stopTime = 0;
    this.totalTime = 0;
    this.running = false;
};

Timer.prototype = {
    constructor: Timer,
    start: function() {
        'use strict';
        this.running = true;
        this.startTime = Date.now( );
    },
    stop: function() {
        'use strict';
        this.running = false;
        this.stopTime = Date.now();
        this.totalTime += this.stopTime - this.startTime;
    },
    reset: function() {
        'use strict';
        var time = Date.now();
        this.startTime = time;
        this.stopTime = time;
        this.totalTime = 0;
    },
    getElapsedMs: function() {
        'use strict';
        if(this.running) {
            return Date.now() - this.startTime + this.totalTime;
        }

        return this.totalTime;
    },
    getElapsedSec: function() {
        'use strict';
        return Math.floor(this.getElapsedMs() / 1000);
    }

};

Timer.getDigitalRep = function(seconds) {
    'use strict';
    var minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    var digitalRep = undefined;
    if(seconds < 10) {
        digitalRep = minutes + ':0' + seconds;
    } else {
        digitalRep = minutes + ':' + seconds;
    }

    return digitalRep;
};