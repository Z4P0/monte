(function (window, document, undefined) {
    'use strict';

    window.mtn = {
        init: function() {
            console.log('hello from: main.js');
        }
    };

    window.onload = mtn.init;

}(window, window.document));
