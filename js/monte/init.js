(function ($, window, document, undefined) {

    'use strict';


    window.monte = {


        tag: 'M O N T E',

        settings: {
            drupal_theme_path: '/sites/all/themes/arrowhead'
        },

        modules: {},



        init: function() {

            console.log(this.tag);

            // initialize all modules
            for (var module in this.modules) {
                this.modules[module].init();
            }


            // add smooth scroll
            this.utils.smooth_scroll();


            // konami /* play sound effect */
            var easter_egg = new Konami(this.utils.konami);

        },



        utils: {

            // recon to see if we're in Drupal-land
            drupal_test: function (tru_callback, false_callback) {
                if (typeof Drupal !== 'undefined') {
                    // You are here: Drupal
                    if (tru_callback) tru_callback();
                    return true;
                } else {
                    // vanilla env
                    if (false_callback) false_callback();
                    return false;
                }
            },

            smooth_scroll: function () {
                // smooth scroll - original source below
                // http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links
                $('a[href*=#]:not([href=#])').click(function() {
                    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                        if (target.length) {
                            $('html,body').animate({
                                scrollTop: target.offset().top
                            }, 1000);

                            return false;
                        }
                    }
                });
            },

            konami: function () {

                // file urls
                var mp3s = [
                    'misc/internet.mp3',
                    'misc/mario.mp3',
                    'misc/seinfeld.mp3'
                ];

                // change file paths are different for Drupal
                monte.utils.drupal_test(function () {
                    for (var i = 0; i < mp3s.length; i++) {
                        mp3s[i] = monte.settings.drupal_theme_path + mp3s[i];
                    }
                });

                // load Howler
                if (monte.sound === undefined) {
                    monte.sound = new Howl({
                        urls: [mp3s[Math.floor(Math.random() * 3)]]
                    }).play();
                } else {
                    // play new sound. stop other one
                    monte.sound.unload();
                    monte.sound = new Howl({
                        urls: [mp3s[Math.floor(Math.random() * 3)]]
                    }).play();
                }

            }
        }

    };



    // initialize the things
    $(document).ready(function () {
        $(document).foundation();
        monte.init();
    });

}($ || jQuery, window, window.document));
