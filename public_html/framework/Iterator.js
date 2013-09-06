(function(window) {
    'use strict';

    var Iterator = function(iterable) {
        this.data = iterable;
        this.index = -1;
    };

    Iterator.prototype = {
        constructor: Iterator,
        hasNext: function( ) {
            return this.index < this.data.length - 1;
        },
        current: function( ) {
            return this.data [ this.index ];
        },
        next: function( ) {
            ++this.index;
            return this.current( );
        }
    };
    window.Iterator = Iterator;
})(window);