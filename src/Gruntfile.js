module.exports = function(grunt) {

  var jadedebug = {
    compileDebug: false,
    pretty: true,

    data:{
      partial: function(templatePath, dataObj){
        var template = grunt.file.read(templatePath);

        if(typeof(dataObj) === String){
          dataObj = grunt.file.readJSON(dataObj);
        }

        if(templatePath.match(/.jade/g)){
          return require('grunt-contrib-jade/node_modules/jade').compile(template, {filename: templatePath, pretty: true})(dataObj);
        }else{
          return template;
        }
      },
      data: function(path){
        return grunt.file.readJSON(path);
      },
      locals:{
        getConfigFile:function(path){
          return grunt.file.readJSON(path);
        },
        data: function(path){
          return jadedebug.data.data(path);
        },
        partial: function(templatePath, dataObj){
          return jadedebug.data.partial(templatePath, dataObj);
        }

      }
    }
  }


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // compile SASS files
    compass: {
      build: {
        options: {
          sassDir: 'style',
          cssDir: '../build/debug/style',
          outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
          images: '../build/debug/img',
          environment: 'development'
        }
      },
      modules: {
        options: {
          cssDir: '../build/debug/style/modules',
          outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
          images: '../build/debug/img',
          environment: 'development'
        }
      }
    },


    // copy files (font, img, js)
    copy: {
      font: {
        files: [{expand: true, cwd: 'style/fonts', src:['**'], dest: '../build/debug/style/fonts'}]
      },
      img: {
        files : [{expand: true, cwd: 'img', src: ['**'], dest: '../build/debug/img'}]
      },
      js: {
        files : [{expand: true, cwd: 'js', src: ['**'], dest: '../build/debug/js'}]
      },
      module_js: {
        files: [{expand: true, cwd: 'modules', src: ['**/js/*.js'], dest: '../build/debug/js/modules/'}]
        // go through every module folder
        // files : function() {
        //   var module, array = [];

        //   // copy all js
        //   grunt.file.expand('modules/**/js').forEach(function(path) {
        //     module = path.split('/')[1];
        //     array.push({expand: true, cwd: path, src: ['**'], dest: '../build/debug/js/modules/'});
        //   });
        //   return array;
        // }
      }
    },


    // compile jade files
    jade: {
      index: {
        options: jadedebug,
        files: [{expand: true, cwd: './', src: ['*.jade'], dest: '../build/debug', ext: '.html', flatten: true }]
      },
      modules: {
        options: jadedebug,
        files: [
          {expand: true, cwd: 'modules', src: '**/demo/*.jade', dest: '../build/debug', ext: '.html', flatten: true }
        ]
      },
      pages: {
        options: jadedebug,
        files: [{expand: true, cwd: 'pages', src: '*.jade', dest: '../build/debug', ext: '.html', flatten: true}]
      }
    },


    // watch file changes
    watch: {
      base_sass: {
        files: ['style/*.scss','style/**/*.scss'],
        tasks: ['compass:build']
      },
      module_sass: {
        files: ['modules/**/style/*.scss'],
        tasks: ['css']
      },
      base_jade: {
        files: ['html/*.jade','*.jade'],
        tasks: ['jade:index']
      },
      module_jade: {
        files: ['modules/**/html/*.jade','modules/**/data/*.json'],
        tasks: ['html']
      },
      base_img: {
        files: ['img/*.*'],
        tasks: ['copy:img']
      },
      module_img: {
        files: ['modules/**/img/*.*'],
        tasks: ['assets']
      },
      base_js:{
        files: ['js/*.js', 'js/**/*.js'],
        tasks: ['copy:js']
      },
      module_js:{
        files: ['modules/**/js/*.js'],
        tasks: ['js']
      },
      pages: {
        files: ['pages/*.jade'],
        tasks: ['pages']
      }
    },

    // yui compression
    min: {
      dist: {
        src: ['../build/debug/js/main.js', '../build/debug/js/modules/*.js'],
        dest: '../build/debug/js/main.min.js'
      }
    },
    cssmin: {
      dist: {
        src: ['../build/debug/style/style.css', '../build/debug/style/modules/*.css'],
        dest: '../build/debug/style/style.min.css'
      }
    }

  });



  // Load the plugins
  // ===================================
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-yui-compressor');




  // Default task(s)
  // ===================================
  grunt.registerTask('default', ['debug']);

  grunt.registerTask('debug', function() {
    grunt.task.run([
      'compass:build',
      'css',
      'copy:font',
      'copy:js',
      'js',
      'jade:pages',
      'jade:modules',
      'jade:index',
      'min',
      'cssmin',
    ]);
  });


  // compile SCSS changes
  grunt.registerTask('css', function(module) {
    module = module || '**';
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';

    // go through every module, or the one passed
    grunt.file.expand('modules/'+module+'/style').forEach(function(path) {
      grunt.registerTask(path, function() {
        // set the sassDir for each module
        grunt.config('compass.'+mode+'_modules.options.sassDir', path);
        grunt.task.run('compass:'+mode+'_modules');
      });

      // run it
      grunt.task.run(path);
    });
  });


  // copy module JS
  grunt.registerTask('js', function(module) {
    module = module || '**';
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';
    var modules = [];

    // go through every module, or the one passed
    grunt.file.expand('modules/'+module+'/js').forEach(function(path) {
      mod = path.split('/')[1];
      modules.push({
        expand: true,
        cwd: path,
        src: ['*.js'],
        dest: '../build/'+mode+'/js/modules'
      });
    });

    grunt.config('copy.module_js.files', modules);
    grunt.task.run('copy:module_js');
  });


};
