module.exports = function(grunt) {

  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';


  var build_folder = '../build/',
      js_src_folders = ['js/*.js', 'js/**/*.js', '!js/libs/*.js'];




  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),


    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',


    clean: [build_folder],


    jshint: {
      options: {jshintrc: 'js/.jshintrc'},
      src: {src: js_src_folders }
    },



    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      build: {
        src: js_src_folders,
        dest: build_folder+'js/main.js'
      }
    },



    uglify: {
      options: {preserveComments: 'none'},
      build: {
        src: '<%= concat.build.dest %>',
        dest: build_folder+'js/main.min.js'
      }
    },



    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      build: {
        options: {map: true },
        src: build_folder+'style/style.css'
      }
    },



    csslint: {
      options: {csslintrc: 'style/.csslintrc'},
      src: [build_folder+'style/style.css']
    },



    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      build: {
        src: [build_folder+'style/style.css'],
        dest: build_folder+'style/style.min.css'
      },
      deploy: {
        src: [build_folder+'style/style.css'],
        dest: build_folder+'style/<%= pkg.name %>.min.css'
      }
    },



    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: [
          build_folder+'style/style.css',
          build_folder+'style/<%= pkg.name %>.min.css',
          build_folder+'js/main.js',
          build_folder+'js/main.min.js'
        ]
      },
      deploy: {
        src: [
          build_folder+'style/<%= pkg.name %>.css',
          build_folder+'style/<%= pkg.name %>.min.css',
          build_folder+'js/<%= pkg.name %>.js',
          build_folder+'js/<%= pkg.name %>.min.js'
        ]
      }
    },



    csscomb: {
      options: {config: 'style/.csscomb.json'},
      build: {
        expand: true,
        cwd: build_folder+'style/',
        src: ['*.css', '!*.min.css'],
        dest: build_folder+'style/'
      }
    },



    // compile SASS files
    sass: {
      options: {outputStyle: 'expanded'},
      build: {
        files: {'../build/style/style.css': 'style/style.scss'}
      }
    },




    // copy files (font, img, js)
    copy: {
      fonts: {
        files: [{expand: true, cwd: 'style/fonts', src:['**'], dest: build_folder+'style/fonts'}]
      },
      img: {
        files : [{expand: true, cwd: 'img', src: ['**'], dest: build_folder+'img'}]
      },
      js_libs: {
        files : [{expand: true, cwd: 'js/libs', src: ['**'], dest: build_folder+'js/libs'}]
      }
    },



    // compile jade files
    jade: {
      index: {
        options: {
          compileDebug: false,
          pretty: true,
        },
        files: [{expand: true, cwd: './', src: ['*.jade', 'html/*.jade', '!_*.jade', '!html/_*.jade'], dest: build_folder, ext: '.html', flatten: true }]
      }
    },



    // watch file changes
    watch: {
      sass: {
        files: ['style/*.scss','style/**/*.scss'],
        tasks: ['build_css']
      },
      jade: {
        files: ['*.jade', 'html/*.jade'],
        tasks: ['jade:index']
      },
      img: {
        files: ['img/*.*', 'img/**/*.*'],
        tasks: ['copy:img']
      },
      js: {
        files: js_src_folders,
        tasks: ['build_js']
      },
      fonts: {
        files: ['style/fonts/*.*'],
        tasks: ['copy:fonts']
      }
    },



    // htmlmin: {                                     // Task
    //   dist: {                                      // Target
    //     options: {                                 // Target options
    //       removeComments: true,
    //       collapseWhitespace: true
    //     },
    //     files: {                                   // Dictionary of files
    //       'dist/index.html': 'src/index.html',     // 'destination': 'source'
    //       'dist/contact.html': 'src/contact.html'
    //     }
    //   },
    //   dev: {                                       // Another target
    //     files: {
    //       'dist/index.html': 'src/index.html',
    //       'dist/contact.html': 'src/contact.html'
    //     }
    //   }
    // },




  });



  // Load the plugins
  // ===================================
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);




  // Default task(s)
  // ===================================
  grunt.registerTask('default', ['debug']);

  grunt.registerTask('debug', function() {
    grunt.task.run([
      'build_css',
      'build_js',
      'copy:img',
      'copy:js_libs',
      'copy:fonts',
      'jade:index',
    ]);
  });

  grunt.registerTask('deploy', function() {
    grunt.task.run([
      'min',
      // 'cssmin',
      'sass:build',
      'csscomb:build',
      'csslint:src',
      'autoprefixer:build',
      'cssmin:build'
      // 'usebanner'
    ]);

  });






  grunt.registerTask('build_js', function() {
    grunt.task.run([
      // 'jshint:src',
      'concat:build',
      'uglify:build'
    ]);
  });









  grunt.registerTask('build_css', function() {
    grunt.task.run([
      'sass:build',
      'csscomb:build',
      'csslint:src',
      'autoprefixer:build',
      'cssmin:build'
    ]);

  });


  grunt.registerTask('deploy_css', function() {
    grunt.task.run([
      'sass:build',
      'csscomb:build',
      'csslint:src',
      'autoprefixer:build'
    ]);

  });


};
