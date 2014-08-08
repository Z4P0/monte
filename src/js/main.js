'use strict';
var mtn = mtn || {};


mtn.main = {
  init: function() {
    console.log('hello from: main.js');
  }
};


window.onload = mtn.main.init;
