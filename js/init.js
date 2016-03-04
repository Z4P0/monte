var $ = require('jquery');
var foundation = require('foundation');
var cheet = require('cheet');

// initialize the things
$(document).ready(function () {

  var $body = $('html,body');

  // say hi
  $(document).foundation();

  /**
   * smooth scroll to a section of the page, original source below:
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

  // konami
  cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () { alert('Voilà!'); });
});
