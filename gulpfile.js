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
	htmlhint = require("gulp-htmlhint");

// --------------------------------------------------
// [Libraries]
// --------------------------------------------------

// Sass - Compile Sass files into CSS
gulp.task("sass", function () {
	gulp
		.src("./src/sass/**/*.scss")
		.pipe(changed("./dist/css/"))
		.pipe(sass({ outputStyle: "expanded" }))
		.on("error", sass.logError)
		.pipe(gulp.dest("./dist/css/"));
});

// Minify CSS
gulp.task("minify-css", function () {
	// Theme
	gulp
		.src(["./dist/css/index.css", "!./dist/css/index.min.css"])
		.pipe(
			cleanCSS({ debug: true }, function (details) {
				console.log(details.name + ": " + details.stats.originalSize);
				console.log(details.name + ": " + details.stats.minifiedSize);
			})
		)
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest("./dist/css/"));

	// RTL
	gulp
		.src(["./dist/css/index-rtl.css", "!./dist/css/index-rtl.min.css"])
		.pipe(
			cleanCSS({ debug: true }, function (details) {
				console.log(details.name + ": " + details.stats.originalSize);
				console.log(details.name + ": " + details.stats.minifiedSize);
			})
		)
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest("./dist/css/"));
});

// RTL CSS - Convert LTR CSS to RTL.
gulp.task("rtlcss", function () {
	gulp
		.src([
			"./dist/css/index.css",
			"!./dist/css/index.min.css",
			"!./dist/css/index-rtl.css",
			"!./dist/css/index-rtl.min.css",
		])
		.pipe(changed("./dist/css/"))
		.pipe(rtlcss())
		.pipe(rename({ suffix: "-rtl" }))
		.pipe(gulp.dest("./dist/css/"));
});

// Minify JS - Minifies JS
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

// Htmlhint - Validate HTML
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

// This handles watching and running tasks
gulp.task("watch", function () {
	gulp.watch("./src/sass/**/*.scss", ["sass"]);
	gulp.watch("./dist/css/layout.css", ["minify-css"]);
	gulp.watch("./dist/css/layout.css", ["rtlcss"]);
	gulp.watch("./src/js/**/*.js", ["uglify"]);
	gulp.watch("./dist/*.html", ["htmlhint"]);
});

// $ npm run gulp -> run all tasks
gulp.task("default", [
	"sass",
	"minify-css",
	"rtlcss",
	"uglify",
	"htmlhint",
	"watch",
]);
