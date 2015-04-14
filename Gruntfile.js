/*jshint node:true*/
module.exports = function(grunt) {

"use strict";

var banner;

banner = "/*\n" +
	" * Date Validator v<%= pkg.version %>\n" +
	" *\n" +
	" * <%= pkg.homepage %>\n" +
	" *\n" +
	" * Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
	" * Released under the <%= _.pluck(pkg.licenses, 'type').join(', ') %> license\n" +
	" */\n";

grunt.initConfig({
	pkg: grunt.file.readJSON("package.json"),
	concat: {
		// used to copy to dist folder
		dist: {
			options: {
				banner: banner
			},
			files: {
				"dist/date-validator.js": [ "src/date-validator.js" ]
			}
		}
	},
	uglify: {
		options: {
			preserveComments: false,
			banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
				"<%= grunt.template.today('m/d/yyyy') %>\n" +
				" * <%= pkg.homepage %>\n" +
				" * Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
				" Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n"
		},
		dist: {
			files: {
				"dist/date-validator.min.js": "dist/date-validator.js"
			}
		}
	},
	compress: {
		dist: {
			options: {
				mode: "zip",
				level: 1,
				archive: "dist/<%= pkg.name %>-<%= pkg.version %>.zip",
				pretty: true
			},
			src: [
				"dist/*.js",
				"Gruntfile.js",
				"lib/*.*",
				"package.json",
				"README.md",
				"src/*.*",
				"test/**/*.*"
			]
		}
	},
	qunit: {
		files: "test/index.html"
	},
	jshint: {
		options: {
			jshintrc: true
		},
		core: {
			src: "src/*.js"
		},
		test: {
			src: "test/*.js"
		},
		grunt: {
			src: "Gruntfile.js"
		}
	},
	watch: {
		options: {
			atBegin: true
		},
		src: {
			files: "<%= jshint.core.src %>",
			tasks: [
				"concat"
			]
		}
	},
	jscs: {
		all: [ "<%= jshint.core.src %>", "<%= jshint.test.src %>", "<%= jshint.grunt.src %>" ]
	},
	replace: {
		dist: {
			src: "dist/*.min.js",
			overwrite: true,
			replacements: [
				{
					from: "./date-validator",
					to: "./date-validator.min"
				}
			]
		}
	}
});

grunt.loadNpmTasks("grunt-contrib-jshint");
grunt.loadNpmTasks("grunt-contrib-qunit");
grunt.loadNpmTasks("grunt-contrib-uglify");
grunt.loadNpmTasks("grunt-contrib-concat");
grunt.loadNpmTasks("grunt-contrib-compress");
grunt.loadNpmTasks("grunt-contrib-watch");
grunt.loadNpmTasks("grunt-jscs");
grunt.loadNpmTasks("grunt-text-replace");

grunt.registerTask("default", [ "concat", "jscs", "jshint", "qunit" ]);
grunt.registerTask("release", [ "default", "uglify", "replace", "compress" ]);
grunt.registerTask("start", [ "concat", "watch" ]);

};
