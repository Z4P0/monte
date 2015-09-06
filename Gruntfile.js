module.exports = function(grunt) {

    'use strict';
    grunt.util.linefeed = '\n';  // Force use of Unix newlines

    // project directory layout
    // ============================================================
    var project = {

        // configuration
        // ----------------------------------------
        images_dir: 'images/',
        jade_dir: './',
        js_files: [
            'js/monte/init.js',
        ],
        js_vendor_files: [
            'bower_components/modernizr/modernizr.js',
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/foundation/js/foundation.min.js',
            'bower_components/greensock/src/minified/TweenMax.min.js',
            'bower_components/howler/howler.min.js',
            'bower_components/konami-js/konami.js',
        ],
        misc_dir: 'misc/',
        sass_dir: 'scss/',
        sass_filename: 'style.scss',

        // build output
        // ----------------------------------------
        output: {
            folder:                 './',
            css_folder:                 'css/',
            css_filename:                   'style.css',
            css_filename_minified:          'style.min.css',
            js_folder:                  'js/',
            js_filename:                    'main.js',
            js_filename_minified:           'main.min.js',
            js_vendor_filename:             'vendors.js',
            js_vendor_filename_minified:    'vendors.min.js',
            js_master_filename:             'scripts.js',
            js_master_filename_minified:    'scripts.min.js'
        },

        deploy: {
            folder:                 '../deploy',
        }
    };





    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        project: project,

        banner: '/*!\n' +
                ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
                ' */\n',


        // JS
        // ----------------------------------------
        // 1. concat
        concat: {
            options: {
                stripBanners: false,
                sourceMap: true
            },
            build: {
                src: '<%= project.js_files %>',
                dest: '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename %>'
            },
            vendors: {
                src: '<%= project.js_vendor_files %>',
                dest: '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_vendor_filename %>'
            },
            deploy: {
                src: [
                    '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_vendor_filename %>',
                    '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename %>'
                ],
                dest: '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_master_filename %>'
            }
        },

        // 2. minify
        uglify: {
            options: {
                preserveComments: 'none'
            },
            deploy: {
                src: '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_master_filename %>',
                dest: '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_master_filename_minified %>'
            }
        },




        // CSS
        // ----------------------------------------
        // 1. build
        sass: {
            options: {
                outputStyle: 'expanded',
                sourceMap: true
            },
            build: {
                files: {
                    '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>':
                        '<%= project.sass_dir %><%= project.sass_filename %>'
                }
            }
        },

        // 2. autoprefix
        autoprefixer: {
            options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24',
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            build: {
                options: {
                    map: false
                },
                src:'<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>'
            }
        },

        // 3. comb
        csscomb: {
            options: {
                config: '<%= project.sass_dir %>.csscomb.json'
            },
            build: {
                src: ['<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>'],
                dest: '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>'
            }
        },


        // 4. lint
        csslint: {
            options: {
                csslintrc: '<%= project.sass_dir %>.csslintrc'
            },
            build: ['<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>']
        },

        // 5. minify
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                noAdvanced: true
            },
            build: {
                src: ['<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>'],
                dest: '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename_minified %>'
            }
        },



        // HTML
        // ----------------------------------------
        // 1. compile
        jade: {
            build: {
                options: {
                    compileDebug: false,
                    pretty: true,
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= project.jade_dir %>',
                        src: [
                            '*.jade'
                        ],
                        dest: '<%= project.output.folder %>',
                        ext: '.html',
                        flatten: true
                    }
                ]
            }
        },



        // Utils
        // ----------------------------------------
        // 1. copy files - only used for deployment
        copy: {
            css: {
                files : [{
                    expand: true,
                    src: [
                        '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>',
                        '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename_minified %>'
                    ],
                    dest: '<%= project.deploy.folder %>'
                }]
            },
            images: {
                files : [{
                    expand: true,
                    src: ['<%= project.images_dir %>**', 'favicon.ico', 'apple-touch-icon.png'],
                    dest: '<%= project.deploy.folder %>'
                }]
            },
            html: {
                files : [{
                    expand: true,
                    src: ['<%= project.output.folder %>*.html'],
                    dest: '<%= project.deploy.folder %>'
                }]
            },
            js: {
                files : [{
                    expand: true,
                    src: [
                        // custom scripts
                        '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename %>',
                        // vendor scripts
                        '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_vendor_filename %>',
                        // combined scripts
                        '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_master_filename %>',
                        // minified
                        '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename_minified %>',
                        '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_vendor_filename_minified %>',
                        '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_master_filename_minified %>',
                    ],
                    dest: '<%= project.deploy.folder %>'
                }]
            },
            misc: {
                files : [{
                    expand: true,
                    src: ['<%= project.misc_dir %>**'],
                    dest: '<%= project.deploy.folder %>'
                }]
            },
        },

        // 2. banners
        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>'
            },
            build: {
                src: [
                    '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>',
                    '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename_minified %>',
                    '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename %>',
                    '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename_minified %>'
                ]
            }
        },

        // watch file changes
        watch: {
            sass: {
                files: ['<%= project.sass_dir %>*.scss','<%= project.sass_dir %>**/*.scss'],
                tasks: ['sass:build', 'autoprefixer:build']
            },
            jade: {
                files: [ '<%= project.jade_dir %>*.jade', '<%= project.jade_dir %>**/*.jade'],
                tasks: ['jade:build']
            },
            images: {
                files: ['<%= project.images_dir %>*.*', '<%= project.images_dir %>**/*.*'],
                tasks: ['copy:images']
            },
            js: {
                files: '<%= project.js_files %>',
                tasks: ['concat:build']
            }
        }

    });



    // Load the plugins
    // ===================================
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('time-grunt')(grunt);



    // Default task(s)
    // ===================================
    grunt.registerTask('default', ['deploy', 'watch']);
    // ----------------------------------------
    grunt.registerTask('deploy', function() {
        grunt.task.run([
            'build',
            'minify',
        ]);
    });

    grunt.registerTask('build', function() {
        grunt.task.run([
            // build css
            'sass',
            'autoprefixer',
            'csscomb',
            'csslint',
            // build js
            'concat:build',
            'concat:vendors',
            // build html
            'jade',
        ]);
    });

    grunt.registerTask('minify', function() {
        grunt.task.run([
            // minify css
            'cssmin',
            // our js + vendor js
            'concat:deploy',
            // minify result
            'uglify',
        ]);
    });

    grunt.registerTask('export', function() {

        var target = grunt.option('target');
        if (target) {
            // adjust our project settings
            var new_settings = project;
                new_settings.deploy.folder = target;
            grunt.config.set('project', new_settings);
        }

        // build + output to a directory
        // default: ../../../demo
        grunt.task.run([
            'deploy',
            // banner
            'usebanner',
            'copy',
        ]);
    });

};
