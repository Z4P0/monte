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
        demos:function(){
          return grunt.file.expand('modules/**/demo/*.jade').map(function(a){
            return a.split('/').pop().replace(/.jade/g, '.html')
          }).filter(function(a){
            return a.match(/-demo.html/g)});
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

    // clear output directories
    clean: {
      debug: {
        cwd: '../',
        src: ['../build/debug'],
        force: true
      },
      deploy: {
        cwd: '../',
        src: ['../build/deploy'],
        force: true
      }
    },

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
      debug_modules: {
        options: {
          cssDir: '../build/debug/style/modules',
          outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
          images: '../build/debug/img',
          environment: 'development'
        }
      },
      // deploy: {
      //   options: {
      //     sassDir: 'style',
      //     cssDir: '../build/deploy/style',
      //     outputStyle: 'compressed',
      //     noLineComments: true,
      //     force: true,
      //     relativeAssets: true,
      //     images: '../build/deploy/img',
      //     environment: 'production'
      //   }
      // },
      // deploy_modules: {
      //   options: {
      //     cssDir: '../build/deploy/style',
      //     outputStyle: 'compressed',
      //     noLineComments: true,
      //     force: true,
      //     relativeAssets: true,
      //     images: '../build/deploy/img',
      //     environment: 'production'
      //   }
      // },
      // docs:{
      //   options:{
      //     sassDir: 'docs/style',
      //     cssDir: '../docs/style',
      //     outputStyle: 'compressed',
      //     noLineComments: true,
      //     force: true,
      //     relativeAssets: true,
      //     images: '../docs/img',
      //     environment: 'production'
      //   }
      // }
    },


    // copy files (font, img, js)
    copy: {
      font: {
        files: [{expand: true, cwd: 'style/fonts', src:['**'], dest: '../build/debug/style/fonts'}]
      },
      img: {
        files : [{expand: true, cwd: 'img', src: ['**'], dest: '../build/debug/img'}]
      },
      // module_img: {
      //   files: [{expand: true, src: ['**']}]
      // },
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
      },
      debug_modules : {
       // go through every module folder
        files : function() {
          var module, array = [];

          // copy all imgs
          grunt.file.expand('modules/**/img/').forEach(function(path) {
            module = path.split('/')[2];
            array.push({expand: true, cwd: path, src: ['**'], dest: '../build/debug/img/'+module+'/'});
          });

          // copy all js
          grunt.file.expand('modules/**/js/').forEach(function(path) {
            module = path.split('/')[2];
            array.push({expand: true, cwd: path, src: ['**'], dest: '../build/debug/js/modules/'});
          });
          return array;
        }
      },
      deploy : {
        files : function() {
          var module, array = [];

          array.push({expand: true, cwd: 'style/fonts', src:['**'], dest: '../build/deploy/style/fonts'});
          array.push({expand: true, cwd: 'img', src: ['**'], dest: '../build/deploy/img'});
          array.push({expand: true, cwd: 'js', src: ['**'], dest: '../build/deploy/js'});

          // copy imgs // JS is handled elsewhere
          grunt.file.expand('modules/**/img/').forEach(function(path) {
            module = path.split('/')[2];
            array.push({expand: true, cwd: path, src: ['**'], dest: '../build/deploy/img/'+module+'/'});
          });

          return array;
        }
      },
      // docs : {
      //   files: [
      //     {expand: true, cwd: 'docs/img', src: ['**'], dest: '../docs/img'},
      //     {expand: true, cwd: 'docs/js', src: ['**'], dest: '../docs/js'}
      //   ]
      // }
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
      debug_pages: {
        options: jadedebug,
        files: [{expand: true, cwd: 'pages', src: '*.jade', dest: '../build/debug', ext: '.html', flatten: true}]
      },
      // deploy_pages: {
      //   options: jadedeploy,
      //   files: [{expand: true, cwd: 'pages', src: '*.jade', dest: '../build/deploy', ext: '.html', flatten: true}]
      // },
      // deploy: {
      //   options: jadedeploy,
      //   files: [
      //     {expand: true, cwd: './', src: ['*.jade'], dest: '../build/deploy', ext: '.html', flatten: true },
      //     {expand: true, cwd: 'modules', src: '**/demo/*.jade', dest: '../build/deploy', ext: '.html', flatten: true }
      //   ]
      // },
      // docs: {
      //   options: jadedebug,
      //   files:[{expand:true, cwd:'docs/', src:['html/*.jade'], dest:'../docs', ext:'.html', flatten:true}]
      // }
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
        files: ['modules/**/demo/*.jade','modules/**/html/*.jade','modules/**/data/*.json'],
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
      // docs: {
      //   files: ['docs/**/*.*'],
      //   tasks: ['docs']
      // },
      pages: {
        files: ['pages/*.jade'],
        tasks: ['pages']
      }
    }

  });




  // Load the plugins
  // ===================================
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-yui-compressor');




  // Default task(s)
  // ===================================
  grunt.registerTask('default', ['debug']);

  grunt.registerTask('debug', function() {
    grunt.task.run([
      'clean:debug',
      'compass:build',
      'css',
      'copy:font',
      'copy:debug_modules',
      'copy:js',
      'js',
      'jade:debug_pages',
      'jade:modules',
      'jade:index',
      // 'docs'
    ]);
  });

  // grunt.registerTask('deploy', function() {
  //   grunt.task.run([
  //     'clean:deploy',
  //     'compass:deploy',
  //     'compass:deploy_modules',
  //     'copy:deploy',
  //     'jade:deploy_pages',
  //     'jade:deploy',
  //     'docs'
  //   ]);
  // });

  // // compile stuff in 'docs'
  // grunt.registerTask('docs', 'update docs/ folder', function() {
  //   grunt.task.run([
  //     'compass:docs',
  //     'copy:docs',
  //     'jade:docs'
  //   ]);
  // });


  // ----------------------------
  // can be module specfic, ex. grunt html:article-view


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


  // compile JADE files in modules
  grunt.registerTask('html', function(module) {
    module = module || '**';
    var env = grunt.option('deploy') ? 'deploy' : 'debug';
    var modules = [];

    // for each file in 'modules/**/demo/'
    grunt.file.expand('modules/'+module+'/demo/').forEach(function(path){
      mod = path.split('/')[2];
      modules.push(
        {expand:true,
        cwd: path,
        src: ['*.jade'],
        dest: '../build/'+ env,
        ext: '.html',
        flatten: true}
      )
    });

    grunt.config('jade.modules.files', modules);
    grunt.task.run('jade:modules');
  });


  // compile JADE files in pages/
  grunt.registerTask('pages', function() {
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';

    grunt.task.run([
      'jade:'+mode+'_pages'
    ]);
  });

  // copy assets from modules
  grunt.registerTask('assets', 'copy assets from modules', function(module) {
    module = module || '**';
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';

    grunt.file.expand('modules/'+module+'/img').forEach(function(path) {
      mod = path.split('/')[1];
      grunt.registerTask(path, function() {
        // configure
        grunt.config('copy:module_img.files.cwd', path);
        grunt.config('copy:module_img.files.dest', '../build/debug/img/'+mod+'/');

        // run
        grunt.task.run('copy:module_img');
      })
      grunt.task.run(path);
    });
  });


  // ----------------------------
  // watch a specfic module

  // grunt.registerTask('w', function(module) {
  //   module = module || '**';

  //       // check html
  //   var watch_html = ['modules/'+module+'/html/*.jade', 'modules/'+module+'/html/*.json'],
  //       // check js
  //       watch_js = ['modules/'+module+'/js/*.js'],
  //       // check style
  //       watch_style = ['modules/'+module+'/style/*.scss'],
  //       // check imgs
  //       watch_imgs = ['modules/'+module+'/img/*.*'];

  //   var html_task = ['html:'+module],
  //       js_task = ['js:'+module],
  //       style_task = ['css:'+module],
  //       img_task = ['assets:'+module];

  //   // unfinished
  // });
};
