module.exports = function(grunt) {

    'use strict';
    grunt.util.linefeed = '\n';  // Force use of Unix newlines

    // project directory layout
    var project = {
        build_dir: '../build',
        images_dir: 'images',
        jade_dir: 'html',
        sass_dir: 'style',
        sass_assets: 'style/assets',
        js_dir: 'js',
        js_libs_dir: 'js/vendor'
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
                stripBanners: false
            },
            build: {
                src: [
                    '!<%= project.js_dir %>/<%= project.js_libs_dir %>',
                    '<%= project.js_dir %>/*.js'
                ],
                dest: '<%= project.build_dir %>/<%= project.js_dir %>/<%= pkg.name %>.js'
            }
        },

        // 2. minify
        uglify: {
            options: {
                preserveComments: 'none'
            },
            build: {
                src: '<%= concat.build.dest %>',
                dest: '<%= project.build_dir %>/<%= project.js_dir %>/<%= pkg.name %>.min.js'
            }
        },




        // CSS
        // ----------------------------------------
        // 1. build
        sass: {
            options: {
                outputStyle: 'expanded'
            },
            build: {
                files: {
                    '<%= project.build_dir %>/<%= project.sass_dir %>/<%= pkg.name %>.css':
                        '<%= project.sass_dir %>/<%= pkg.name %>.scss'
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
                    map: true
                },
                src: '<%= project.build_dir %>/<%= project.sass_dir %>/<%= pkg.name %>.css'
            }
        },

        // 3. comb
        csscomb: {
            options: {
                config: 'style/.csscomb.json'
            },
            build: {
                // expand: true,
                // cwd: build_folder+'style/',
                src: ['<%= project.build_dir %>/<%= project.sass_dir %>/<%= pkg.name %>.css'],
                dest: '<%= project.build_dir %>/<%= project.sass_dir %>/<%= pkg.name %>.css'
            }
        },


        // 4. lint
        csslint: {
            options: {
                csslintrc: 'style/.csslintrc'
            },
            build: ['<%= autoprefixer.build.src %>']
        },

        // 5. minify
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                noAdvanced: true
            },
            build: {
                src: ['<%= project.build_dir %>/<%= project.sass_dir %>/<%= pkg.name %>.css'],
                dest: '<%= project.build_dir %>/<%= project.sass_dir %>/<%= pkg.name %>.min.css'
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
                        cwd: './',
                        src: [
                            '*.jade',
                            '<%= project.jade_dir %>/*.jade',
                        ],
                        dest: '<%= project.build_dir %>',
                        ext: '.html',
                        flatten: true
                    }
                ]
            }
        },



        // Utils
        // ----------------------------------------
        // 1. copy files (font, img, js)
        copy: {
            style_assets: {
                files: [{
                    expand: true,
                    src:['<%= project.sass_assets %>/**'],
                    dest: '<%= project.build_dir %>'
                }]
            },
            images: {
                files : [{
                    expand: true,
                    src: ['<%= project.images_dir %>/**'],
                    dest: '<%= project.build_dir %>'
                }]
            },
            js_libs: {
                files : [{
                    expand: true,
                    src: ['<%= project.js_libs_dir %>/**'],
                    dest: '<%= project.build_dir %>'
                }]
            }
        },

        // 2. banners
        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>'
            },
            build: {
                src: [
                    '<%= project.build_dir %>/<%= project.sass_dir %>/<%= pkg.name %>.css',
                    '<%= project.build_dir %>/<%= project.sass_dir %>/<%= pkg.name %>.min.css',
                    '<%= project.build_dir %>/<%= project.js_dir %>/<%= pkg.name %>.js',
                    '<%= project.build_dir %>/<%= project.js_dir %>/<%= pkg.name %>.min.js'
                ]
            }
        },

        // watch file changes
        watch: {
            sass: {
                files: ['style/*.scss','style/**/*.scss'],
                tasks: ['sass:build', 'autoprefixer:build']
            },
            jade: {
                files: [ '*.jade', 'html/*.jade'],
                tasks: ['jade:build']
            },
            images: {
                files: ['images/*.*', 'images/**/*.*'],
                tasks: ['copy:images']
            },
            js: {
                files: '<%= concat.build.src %>',
                tasks: ['concat:build']
            },
            style_assets: {
                files: ['style/assets/*.*', 'style/assets/**/*.*'],
                tasks: ['copy:style_assets']
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
    grunt.registerTask('build', function() {
        grunt.task.run([
            'sass:build',       // build css
            'autoprefixer:build',
            'copy:style_assets',// copy fonts/pngs
            'concat:build',     // build js
            'copy:js_libs',     // copy js/ibs
            'jade:build',       // build html
            'copy:images',      // copy images
        ]);
    });

    grunt.registerTask('deploy', function() {
        // minify everything
        grunt.task.run([
            'build',
            'csscomb:build',
            'csslint:build',
            'cssmin:build',
            'uglify:build',
            'usebanner'
        ]);
    });

};
