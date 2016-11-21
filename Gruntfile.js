'use strict';

module.exports = function (grunt) {

	var path = require('path');

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	var modRewrite = require('connect-modrewrite');

	// Configurable paths for the application

	var baseDirectory = __dirname + '/app/front-end/';

	var appConfig = {
		root: baseDirectory,
		app: baseDirectory,
		dist: baseDirectory,
		appDirName: baseDirectory + 'assets'
	};

	grunt.initConfig({

		configuration: appConfig,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= configuration.app %>/**/*.html',
					'<%= configuration.app %>/scripts/**/*.js',
					'<%= configuration.app %>/compiled/css/**/*.css'
				]
			},

			less: {
				files: ['<%= configuration.app %>/styles/**/*.less'],
				tasks: ['less:dist']
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 3300,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					debug: false,
					open: true,
					middleware: function (connect) {
						return [
							modRewrite(['^[^\\.]*$ /index.html [L]']),
							connect.static('.tmp'),
							connect.static('../'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components'),
								connect.static('./node_modules')
							),
							connect.static(appConfig.app)
						];
					}
				}
			}
		},

		copy: {

			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%=configuration.app %>/assets/img',
						dest: '<%=configuration.dist %>/img',
						src: [
							'**/*.*'
						]
					},
					{
						expand: true,
						dot: true,
						cwd: '<%=configuration.app %>/assets/css',
						dest: '<%=configuration.dist %>/css',
						src: [
							'fonts/**/*.*'
						]
					},
					{
						expand: true,
						cwd: '<%=configuration.app %>',
						src: ['index.html'],
						dest: ''
					}
				]
			}
		},

		htmlmin: {
			build: {
				options: {
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= configuration.app %>/assets',
					dest: '<%= configuration.dist %>',
					src: ['views/**/*.html'], //'{index,404,browser,under-construction}.html',
				}]
			}
		},

		clean: {
			build: {
				options: {
					force: true
				},
				files: [{
					src: ['<%= configuration.dist %>', '<%= configuration.root %>/.tmp']
				}]
			},
			postBuildCleanUp: {
				options: {
					force: true
				},
				files: [{
					src: ['<%= configuration.root %>/.tmp']
				}]
			}
		},

		useminPrepare: {
			html: '<%=configuration.app%>/index.html',
			options: {
				dest: '<%=configuration.root%>'
			}
		},

		ngAnnotate: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat/assets/js',
					src: '*.js',
					dest: '.tmp/concat/assets/js'
				}]
			}
		},

		filerev: {
			dist: {
				src: [
					'<%= configuration.dist %>/js/{,*/}*.js',
					'<%= configuration.dist %>/css/{,*/}*.css'
				]
			}
		},

		usemin: {
			html: 'index.html',
			js: ['<%= configuration.dist %>/js/{,*/}*.js'],
			options: {
				assetsDirs: [
					'<%= configuration.dist%>',
					'<%= configuration.dist%>/img/',
					'<%= configuration.dist%>/js/',
					'<%= configuration.dist%>/views'
				]
			}
		},

		less: {
			dist: {
				options: {
					paths: ['<%= configuration.app%>/styles']
				},
				files: {
					'<%= configuration.appDirName%>/css/main.css': '<%= configuration.app%>/styles/_.less'
				}
			}
		},

		wiredep: {

			dist: {

				src: [
					'<%= configuration.app%>/index.html'
				]
			}
		}
	});

	grunt.registerTask('default', ['serve']);


	grunt.registerTask('serve', 'Compile then start a connect web server', function () {

		grunt.task.run([
			'connect:livereload',
			'wiredep:dist',
			'less:dist',
			'watch'
		]);

	});


	grunt.registerTask('build', [
		'clean:build',
		'wiredep:dist',
		'less:dist',
		'useminPrepare',
		'copy:dist',
		'htmlmin:build',
		'concat:generated',
		'ngAnnotate',
		'cssmin:generated',
		'uglify:generated',
		//'filerev',
		'usemin',
		'clean:postBuildCleanUp'
	]);


};