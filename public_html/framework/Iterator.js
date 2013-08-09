
Iterator = function ( iterable )
{
    'use strict';
    /**@const*/
    this.data = iterable;
};

Iterator.prototype = {
    constructor: Iterator,
    index: -1,
    hasNext: function ( )
    {
        'use strict';
        return this.index < this.data.length - 1;
    },
    current: function ( )
    {
        'use strict';
        return this.data [ this.index ];
    },
    next: function ( )
    {
        'use strict';
        ++this.index;
        return this.current ( );
    }
};