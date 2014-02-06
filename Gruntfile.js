module.exports = function(grunt) {
  
	grunt.initConfig({
		
		// REQUIRED VARIABLES

		pkg: grunt.file.readJSON('package.json'),
		ftpcredentials: grunt.file.readJSON('.ftppass'),
		dbcredentials: grunt.file.readJSON('dbcredentials.json'),

		buildDirectory: "svelte",
		debugDirectory: "debug",
		prodDirectory: "prod",
		srcDirectory: "src",

		coreJS: [
			'<%= srcDirectory %>/js/offline.min.js',
			'<%= srcDirectory %>/js/pubsub.js', 
			'<%= srcDirectory %>/js/sha1.js', 
			'<%= srcDirectory %>/js/behavior.js', 
			'<%= srcDirectory %>/js/app-init.js'
		],

		coreCSS: [
			'<%= srcDirectory %>/css/base.css'
		],

		// TASK CONFIGURATIONS

		jshint: {

			options: {

				'-W030': true,
				'-W033': true,
				devel: true,
				browser: true,
				loopfunc: true,
				lastsemic: true,
				ignores: ['<%= srcDirectory %>/js/offline.min.js','<%= srcDirectory %>/js/sha1.js']
			},

			beforeconcat: '<%= coreJS %>'
		},
		
		uglify: {
			
			core_scripts: {
				files: {
					'<%= srcDirectory %>/js/min/core.min.js': '<%= coreJS %>'
				}
			}
		},

		cssmin: {
			minify: {
				src: '<%= coreCSS %>',
				dest: '<%= srcDirectory %>/css/min/base.min.css'
			}
		},

		htmlbuild: {

	        svelte: {
	            src: '<%= srcDirectory %>/index.html',
	            dest: '<%= buildDirectory %>/index.html',
	            options: {
	                scripts: {
	                    core: '<%= srcDirectory %>/js/min/core.min.js',
	                },
	                styles: {
	                    base: '<%= srcDirectory %>/css/min/base.min.css',
	                },
	                collapseWhitespace: true
	            }
	        },

	        debug: {
	            src: '<%= srcDirectory %>/index.html',
	            dest: '<%= debugDirectory %>/index.html',
	            options: {
	                scripts: {
	                    core: '<%= coreJS %>',
	                },
	                styles: {
	                    base: '<%= coreCSS %>',
	                }
	            }
	        }
	    },

		manifest: {

			generate: {
				
				options: {
					basePath:"<%= buildDirectory %>/",
					fallback: ["/ index.html"],
					network: ["*", "server-check.php", "process-transaction.php", "confirm-transaction.php"],	
					preferOnline: true,
			        timestamp: true,
			        verbose: false,
				},
				src: ['index.html'],
				dest: '<%= buildDirectory %>/manifest.appcache'
			}
		},

		watch: {

            php: {
              files: ['<%= srcDirectory %>/*.php'], 
              tasks: ['copy:php', 'copy:production'],
            },

            js: {
              files: ['<%= srcDirectory %>/js/*.js'], 
              tasks: ['prepJS', 'build'],
            },
            
            css: {
              files: ['<%= srcDirectory %>/css/*.css'], 
              tasks: ['cssmin', 'build'],
            },
            
            html: {
              files: ['<%= srcDirectory %>/index.html'], 
              tasks: ['build'],
            },
            
            htaccess: {
              files: ['<%= srcDirectory %>/.htaccess'], 
              tasks: ['copy:htaccess'],
            },

        }, 

        'ftp-deploy': {
			
			production: {
				
				auth: {
				  authKey: 'mobius',
				  host: '<%= ftpcredentials.mobius.host %>',
				  port: '<%= ftpcredentials.mobius.port %>'
				},

				src: '<%= prodDirectory %>',
				dest: '<%= ftpcredentials.mobius.path %>'
			}
		},

        copy: {

			htaccess: {
			    files: [ 
			    	{ expand: true, flatten: true, src: ['<%= srcDirectory %>/.htaccess'], dest: '<%= buildDirectory %>/'}, 
			    	{ expand: true, flatten: true, src: ['<%= srcDirectory %>/.htaccess'], dest: '<%= debugDirectory %>/'} 
			    ],
			},

			manifest: {
			    files: [ 
			    	{ expand: true, flatten: true, src: ['<%= buildDirectory %>/manifest.appcache'], dest: '<%= debugDirectory %>/'}
			    ],
			},

			php: { 
				
				files: [
					{ expand: true, flatten: true, src: ['<%= srcDirectory %>/*.php'], dest: '<%= buildDirectory %>/', },
					{ expand: true, flatten: true, src: ['<%= srcDirectory %>/*.php'], dest: '<%= debugDirectory %>/', }
				],

				options: {

					processContent: function(content, srcpath){

						// process template
							content = grunt.template.process(content);
							
						return content;
					},
				}
			},

			production: {

				files: [
					{ expand: true, flatten: true, src: ['<%= buildDirectory %>/*.*'], dest: '<%= prodDirectory %>/', },
					{ expand: true, flatten: true, src: ['<%= buildDirectory %>/.*'], dest: '<%= prodDirectory %>/', }
				],

				options: {

					processContent: function(content, srcpath){						

						// required variables
							var buildRootDir = grunt.template.process("<%= buildDirectory %>");

						// utils.php
							if (srcpath == buildRootDir + "/utils.php"){

								var dbcredentials = grunt.config.get("dbcredentials"),
									prodDB = dbcredentials.production,
									svelteDB = dbcredentials.svelte;

								// user name
								content = content.replace( svelteDB.user, prodDB.user);
								
								// pass
								content = content.replace( svelteDB.password, prodDB.password);

								// db
								content = content.replace( svelteDB.database, prodDB.database);
								
								// host
								content = content.replace( svelteDB.host, prodDB.host);
							}

						return content;
					},
				}
			}
        }
	});

	// Load plugins
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-cssmin'); 
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-html-build');
		grunt.loadNpmTasks('grunt-ftp-deploy');
		grunt.loadNpmTasks('grunt-manifest');

	// Register Tasks
		grunt.registerTask('prepJS', ['jshint:beforeconcat','uglify']);
		grunt.registerTask('copyForBuild', ['copy:htaccess', 'copy:php', 'copy:production', 'copy:manifest']);		
		
		grunt.registerTask('build', ['manifest', 'htmlbuild', 'copyForBuild']);
		grunt.registerTask('deploy', ['ftp-deploy:production']);
};