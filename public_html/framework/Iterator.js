
Iterator = function (iterable) {
    'use strict';
    /**@private @const*/
    this.data = iterable;
    /**@private @const*/
    this.index = -1;
};

Iterator.prototype = {
    constructor: Iterator,
    hasNext: function ( ) {
        'use strict';
        return this.index < this.data.length - 1;
    },
    current: function ( ) {
        'use strict';
        return this.data [ this.index ];
    },
    next: function ( ) {
        'use strict';
        ++this.index;
        return this.current ( );
    }
};