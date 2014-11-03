module.exports = function(grunt) {

  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';


  var build_folder = '../build/',
      js_src_folders = ['js/*.js', 'js/**/*.js', '!js/libs/*.js'],
      sass_src_folders = 'style/style.scss',
      css_destination = build_folder+'/style'





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
      options: {
        jshintrc: 'js/.jshintrc'
      },
      src: {
        src: js_src_folders
      }
    },



    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      build: {
        src: js_src_folders,
        dest: build_folder+'js/<%= pkg.name %>.js'
      }
    },



    uglify: {
      options: {
        preserveComments: 'some'
      },
      build: {
        src: '<%= concat.build.dest %>',
        dest: build_folder+'js/<%= pkg.name %>.min.js'
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
        options: {
          map: true
        },
        src: build_folder+'style/<%= pkg.name %>.css'
      }
    },



    csslint: {
      options: {
        csslintrc: 'style/.csslintrc'
      },
      src: [build_folder+'style/<%= pkg.name %>.css']
    },



    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      build: {
        src: [build_folder+'style/<%= pkg.name %>.css'],
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
          build_folder+'style/<%= pkg.name %>.css',
          build_folder+'style/<%= pkg.name %>.min.css',
          build_folder+'js/<%= pkg.name %>.js',
          build_folder+'js/<%= pkg.name %>.min.js'
        ]
      }
    },



    csscomb: {
      options: {
        config: 'style/.csscomb.json'
      },
      build: {
        expand: true,
        cwd: build_folder+'style/',
        src: ['*.css', '!*.min.css'],
        dest: build_folder+'style/'
      }
    },



    // compile SASS files
    sass: {
      options: {
        outputStyle: 'expanded'
      },
      build: {
        options: {
          sassDir: 'style',
          cssDir: build_folder+'style',
          outputStyle: 'expanded'
        },
        files: {
          '<%= pkg.name %>.css': 'style.scss'
        }
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
      js: {
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
        files: [{expand: true, cwd: './', src: ['*.jade'], dest: build_folder, ext: '.html', flatten: true }]
      }
    },



    // watch file changes
    watch: {
      sass: {
        files: ['style/*.scss','style/**/*.scss'],
        tasks: ['sass:build']
      },
      jade: {
        files: ['*.jade'],
        tasks: ['jade:index']
      },
      img: {
        files: ['img/*.*', 'img/**/*.*'],
        tasks: ['copy:img']
      },
      js:{
        files: ['js/*.js', 'js/**/*.js'],
        tasks: ['copy:js']
      },
      fonts:
      {
        files: ['fonts/*.*'],
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
      'sass:build',
      'copy:img',
      'copy:js',
      'copy:fonts',
      'jade:index',
    ]);
  });

  grunt.registerTask('deploy', function() {
    grunt.task.run([
      'min',
      'cssmin'
    ]);
  });

};
