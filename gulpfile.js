// --------------------------------------------------
// [Gulpfile]
// --------------------------------------------------

"use strict";

var gulp = require("gulp"),
	sass = require("gulp-sass"),
	changed = require("gulp-changed"),
	cleanCSS = require("gulp-clean-css"),
	rtlcss = require("gulp-rtlcss"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify"),
	pump = require("pump"),
	htmlhint = require("gulp-htmlhint"),
	autoprefixer = require("gulp-autoprefixer");

// --------------------------------------------------
// [Libraries]
// --------------------------------------------------

// Sass, autoprefixer, minify
gulp.task("sass", function () {
	gulp
		.src("./src/sass/**/*.scss")
		.pipe(changed("./dist/css/"))
		.pipe(sass({ outputStyle: "expanded" }))
		.on("error", sass.logError)
		.pipe(autoprefixer({ cascade: false }))
		.pipe(
			cleanCSS({ debug: true }, function (details) {
				console.log(details.name + ": " + details.stats.originalSize);
				console.log(details.name + ": " + details.stats.minifiedSize);
			})
		)
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest("./dist/css/"));
});

// Minify JS
gulp.task("uglify", function (cb) {
	pump(
		[
			gulp.src(["./src/js/**/*.js", "!./src/js/**/*.min.js"]),
			uglify(),
			rename({ suffix: ".min" }),
			gulp.dest("./dist/js/"),
		],
		cb
	);
});

// Validate HTML
gulp.task("htmlhint", function () {
	gulp
		.src("./HTML/*.html")
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
		.pipe(htmlhint.failReporter({ suppress: true }));
});

// --------------------------------------------------
// [Gulp Task - Watch]
// --------------------------------------------------

// Watch files for changes
gulp.task("watch", function () {
	gulp.watch("./src/sass/**/*.scss", ["sass"]);
	gulp.watch("./src/js/**/*.js", ["uglify"]);
	gulp.watch("./dist/*.html", ["htmlhint"]);
});

// $ npm run gulp -> run all tasks
gulp.task("default", ["sass", "uglify", "htmlhint", "watch"]);
