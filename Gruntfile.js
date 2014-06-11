module.exports = function (grunt) {

    var source_directory = 'src',
        target_directory = 'dist';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        coffee: {
            options: {
                bare: true
            },
            compile: {
                expand: true,
                cwd: source_directory,
                src: ['**/*.coffee'],
                dest: target_directory,
                ext: '.js'
            }
        },
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: source_directory,
                        src: ['**/*.{html,json,js,png}'],
                        dest: target_directory
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/fontawesome/fonts',
                        src: ['**'],
                        dest: target_directory + '/public/fonts'
                    },
                    {
                        src: ['bower_components/angular/angular.min.js'],
                        dest: target_directory + '/public/js/lib/angular.js'
                    },
                    {
                        src: ['bower_components/angular-animate/angular-animate.min.js'],
                        dest: target_directory + '/public/js/lib/angular-animate.js'
                    },
                    {
                        src: ['bower_components/lodash/dist/lodash.js'],
                        dest: target_directory + '/public/js/lib/lodash.js'
                    }
                ]
            }
        },
        sass: {
            dev: {
                files: {
                    'dist/public/css/style.css': source_directory + '/public/css/style.scss'
                }
            }
        },
        clean: {
            dist: ['dist']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', [
        'clean',
        'coffee',
        'copy',
        'sass'
    ]);
};
