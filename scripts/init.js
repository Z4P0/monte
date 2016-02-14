var Monte = require('./monte');
var $ = require('jquery');
var foundation = require('foundation');

// initialize the things
$(document).ready(function () {

  var $body = $('html,body');

  // say hi
  var monte = new Monte();
  if (console !== undefined) console.log(monte.tag);

  $(document).foundation();
  monte.init();

  /**
   * smooth scroll to a section of the page
   * @return false
   *
   * smooth scroll - original source below
   * http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links
  */
  $('a[data-smooth-scroll]').on('click.smooth_scroll', function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $body.animate({
          scrollTop: target.offset().top
        }, 1000);

        return false;
      }
    }
  });
});

