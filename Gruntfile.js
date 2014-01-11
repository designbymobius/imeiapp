module.exports = function(grunt) {
  
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		
		buildDirectory: "svelte",
		srcDirectory: "src",
		
		uglify: {
			
			core_scripts: {
				files: {
					'<%= buildDirectory %>/js/core.min.js': ['<%= srcDirectory %>/js/pubsub.js', '<%= srcDirectory %>/js/sha1.js', '<%= srcDirectory %>/js/behavior.js', '<%= srcDirectory %>/js/app-init.js']
				}
			}
		},

		cssmin: {
			minify: {
				src: '<%= srcDirectory %>/css/base.css',
				dest: '<%= buildDirectory %>/css/base.min.css'
			}
		},

		htmlbuild: {

	        svelte: {
	            src: '<%= srcDirectory %>/index.html',
	            dest: '<%= buildDirectory %>/index.html',
	            options: {
	                scripts: {
	                    core: ['<%= srcDirectory %>/js/offline.min.js','<%= buildDirectory %>/js/core.min.js']
	                },
	                styles: {
	                    base: '<%= buildDirectory %>/css/base.min.css'
	                },
	                collapseWhitespace: true
	            }
	        }
	    },

		manifest: {

			generate: {
				
				options: {
					basePath:"<%= srcDirectory %>/",
					fallback: ["/ index.html"],
					network: ["*", "server-check.php", "process-transaction.php", "confirm-transaction.php"],	
					preferOnline: true,
			        timestamp: true,
			        verbose: false,
				},
				src: ['index.html'],
				dest: '<%= srcDirectory %>/manifest.appcache'
			}
		},

		watch: {

            php: {
              files: ['<%= srcDirectory %>/*.php'], 
              tasks: ['copy:php'],
            },

            js: {
              files: ['<%= srcDirectory %>/js/*.js'], 
              tasks: ['prepJS', 'build'],
            },
            
            css: {
              files: ['<%= srcDirectory %>/css/base.css'], 
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
			
			svelte: {
				
				auth: {
				  host: 's122241.gridserver.com',
				  port: 21,
				  authKey: 'mobius'
				},

				src: '<%= buildDirectory %>',
				dest: '/domains/designbymobi.us/html/imeiapp',
				exclusions: ['<%= buildDirectory %>/css', '<%= buildDirectory %>/js']
			}
		},

        copy: {

			htaccess: {
			    files: [ 
			    	{ expand: true, flatten: true, src: ['<%= srcDirectory %>/.htaccess'], dest: '<%= buildDirectory %>/'} 
			    ]
			},

			manifest: {
			    files: [ 
			    	{ expand: true, flatten: true, src: ['<%= srcDirectory %>/manifest.appcache'], dest: '<%= buildDirectory %>/'} 
			    ]
			},

			php: { 
				
				files: [
					{ expand: true, flatten: true, src: ['<%= srcDirectory %>/*.php'], dest: '<%= buildDirectory %>/', }
				],

				options: {

					processContent: function(content, srcpath){

						// required variables
							var srcRootDir = grunt.template.process("<%= srcDirectory %>");

						// utils.php
							if (srcpath == srcRootDir + "/utils.php"){								

								// user name
								content = content.replace("mobius", "db122241_mobius");
								
								// pass
								content = content.replace("dimmy2", "faB0lous");

								// db
								content = content.replace("\"imeidb", "\"db122241_imeiapp");
								
								// host
								content = content.replace("localhost", "internal-db.s122241.gridserver.com");
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
		grunt.registerTask('prepHTACCESS', ['copy:htaccess']);
		grunt.registerTask('deploySvelte', ['ftp-deploy:svelte']);
		grunt.registerTask('build', ['htmlbuild', 'prepManifest']);
		grunt.registerTask('prepManifest', ['manifest', 'copy:manifest']);
};