(function ($, window, document, undefined) {

  'use strict';


  window.monte = {


    tag: 'M O N T E',



    init: function() {

      console.log(this.tag);

      // add smooth scroll
      this.utils.smooth_scroll();

      // konami /* play sound effect */
      var easter_egg = new Konami(this.utils.konami);

    },



    utils: {


      smooth_scroll: function () {
        // smooth scroll - original source below
        // http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links
        $('a[data-smooth-scroll])').click(function() {
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
