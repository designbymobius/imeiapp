module.exports = function(grunt) {
  
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		dbcredentials: grunt.file.readJSON('dbcredentials.json'),
		
		buildDirectory: "svelte",
		srcDirectory: "src",
		prodDirectory: "prod",
		
		uglify: {
			
			core_scripts: {
				files: {
					'<%= srcDirectory %>/js/min/core.min.js': ['<%= srcDirectory %>/js/offline.min.js','<%= srcDirectory %>/js/pubsub.js', '<%= srcDirectory %>/js/sha1.js', '<%= srcDirectory %>/js/behavior.js', '<%= srcDirectory %>/js/app-init.js']
				}
			}
		},

		cssmin: {
			minify: {
				src: '<%= srcDirectory %>/css/base.css',
				dest: '<%= srcDirectory %>/css/min/base.min.css'
			}
		},

		htmlbuild: {

	        svelte: {
	            src: '<%= srcDirectory %>/index.html',
	            dest: '<%= buildDirectory %>/index.html',
	            options: {
	                scripts: {
	                    core: '<%= srcDirectory %>/js/min/core.min.js'
	                },
	                styles: {
	                    base: '<%= srcDirectory %>/css/min/base.min.css'
	                },
	                collapseWhitespace: true
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
              tasks: ['prepCSS', 'build'],
            },
            
            html: {
              files: ['<%= srcDirectory %>/index.html'], 
              tasks: ['build'],
            },
            
            htaccess: {
              files: ['<%= srcDirectory %>/.htaccess'], 
              tasks: ['prepHTACCESS'],
            },

        }, 

        'ftp-deploy': {
			
			production: {
				
				auth: {
				  host: 's122241.gridserver.com',
				  port: 21,
				  authKey: 'mobius'
				},

				src: '<%= prodDirectory %>',
				dest: '/domains/imeiapp.mizbeach.com/html'
			}
		},

        copy: {

			htaccess: {
			    files: [ 
			    	{ expand: true, flatten: true, src: ['<%= srcDirectory %>/.htaccess'], dest: '<%= buildDirectory %>/'} 
			    ]
			},

			php: { 
				
				files: [
					{ expand: true, flatten: true, src: ['<%= srcDirectory %>/*.php'], dest: '<%= buildDirectory %>/', }
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
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-cssmin'); 
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-html-build');
		grunt.loadNpmTasks('grunt-ftp-deploy');
		grunt.loadNpmTasks('grunt-manifest');

	// Register Tasks
		grunt.registerTask('prepJS', ['uglify']);
		grunt.registerTask('prepCSS', ['cssmin']);
		grunt.registerTask('prepPHP', ['copy:php']);
		grunt.registerTask('prepHTML', ['htmlbuild']);
		grunt.registerTask('prepManifest', ['manifest']);
		grunt.registerTask('prepHTACCESS', ['copy:htaccess']);
		grunt.registerTask('deploy', ['ftp-deploy:production']);
		grunt.registerTask('build', ['prepManifest', 'prepCSS', 'prepJS', 'prepHTML', 'prepHTACCESS', 'prepPHP', 'copy:production']);
};