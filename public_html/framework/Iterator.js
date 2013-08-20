Iterator = function (iterable) {
    'use strict';
    this.data = iterable;
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