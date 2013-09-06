(function(window, $) {
    'use strict';

    var ScreenChangeEvent = function(screenID) {
        var event = $.Event('screenChange');
        event.screenID = screenID;
        return event;
    };

    window.ScreenChangeEvent = ScreenChangeEvent;
})(window, jQuery);