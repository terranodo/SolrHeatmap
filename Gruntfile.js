module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.initConfig({
        'gh-pages': {
            options: {
                branch: 'gh-pages'
            },
            publish: {
                repo: 'https://github.com/terranodo/angular-search.git',
                message: 'Publish gh-pages (grunt cli)',
                src: ['index.html', 'index-dev.html', 'app/**', 'build/**', 'assets/**', 'config/**', 'LICENSE', 'API/*.json']
            },
            deploy: {
                options: {
                    user: {
                        name: 'ahennr',
                        email: 'henn@terrestris.de'
                    },
                    repo: 'https://' + process.env.GH_TOKEN + '@github.com/terranodo/angular-search.git',
                    message: 'Publish gh-pages (auto)' + getDeployMessage(),
                    silent: true
                },
                src: ['index.html', 'index-dev.html', 'app/**', 'build/**', 'assets/**', 'config/**', 'LICENSE', 'API/*.json']
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                // the files to concatenate
                src: ['app/**/*.js',
                    '!app/**/*.spec.js',
                    'assets/lib/ol3-ext/interaction/transforminteraction.js',
                    'assets/lib/ol3-ext/filter/filter.js',
                    'assets/lib/ol3-ext/filter/maskfilter.js',
                    'tmp/templates.js'
                ],
                // the location of the resulting JS file
                dest: 'build/hm-client.js'
            }
        },
        uglify: {
            options: {
              // the banner is inserted at the top of the output
              banner: '/*! Solr-Heatmap-Client created on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
              mangle: false
            },
            dist: {
                files: {
                    'build/hm-client.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        less: {
          development: {
            files: {
              'tmp/styles.css': 'app/components/**/*.less'
            }
          },
          production: {
            options: {
              plugins: [
                new (require('less-plugin-clean-css'))()
              ],
            },
            files: {
              'build/styles.min.css': 'app/components/**/*.less'
            }
          }
        },
        watch: {
          options: {
            livereload: true
          },
          build: {
            files: ['app/**/*'],
            tasks: ['deploy']
          }
        },
        html2js: {
            options: {
                base: 'app'
            },
            components: {
                src: ['app/**/*.tpl.html'],
                dest: 'tmp/templates.js'
            },
          }
    });

    // get a formatted commit message to review changes from the commit log
    // github will turn some of these into clickable links
    function getDeployMessage() {
        var ret = '\n\n';
        if (process.env.TRAVIS !== 'true') {
            ret += 'missing env vars for travis-ci';
            return ret;
        }
        ret += 'branch:       ' + process.env.TRAVIS_BRANCH + '\n';
        ret += 'SHA:          ' + process.env.TRAVIS_COMMIT + '\n';
        ret += 'range SHA:    ' + process.env.TRAVIS_COMMIT_RANGE + '\n';
        ret += 'build id:     ' + process.env.TRAVIS_BUILD_ID + '\n';
        ret += 'build number: ' + process.env.TRAVIS_BUILD_NUMBER + '\n';
        return ret;
    }

    grunt.registerTask('check-deploy', function() {
        // only deploy under these conditions
        if (process.env.TRAVIS === 'true' && process.env.TRAVIS_SECURE_ENV_VARS === 'true' && process.env.TRAVIS_PULL_REQUEST === 'false') {
            grunt.log.writeln('executing deployment');
            // queue deploy
            grunt.task.run('gh-pages:deploy');
        } else {
            grunt.log.writeln('skipped deployment');
        }
    });

    grunt.registerTask('css', ['less:development', 'less:production']);

    grunt.registerTask('buildjs', ['html2js', 'concat', 'uglify']);

    grunt.registerTask('publish', 'Publish from CLI', [
        'buildjs',
        'less:production',
        'gh-pages:publish'
    ]);

    grunt.registerTask('deploy', 'Publish from travis', [
        'buildjs',
        'css',
        'check-deploy'
    ]);

    grunt.registerTask('delta', ['deploy', 'watch'])

};
