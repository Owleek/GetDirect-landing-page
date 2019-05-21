const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const uglify = require("gulp-uglifyjs");
const del = require("del");
const prefixer = require("gulp-autoprefixer");
const rigger = require("gulp-rigger");
const сombineMQ = require("gulp-combine-mq");

const reload = browserSync.reload;

const path = {
	build: {
		html  : "build/",
		js    : "build/js/",
		style : "build/css/",
		images: "build/images/",
		fonts : "build/fonts/"
	},
	src: {
		html  : ["app/**/*.html", "!app/templates/*.html"],
		js    : "app/js/*.js",
		style : "app/style/**/*.*",
		images: "app/images/**/*.*",
		fonts : "app/fonts/**/*.*"
	},
	watch: {
		html  : 'app/**/*.html',
		js    : 'app/js/**/*.js',
		style : 'app/style/**/*.*',
		images: 'app/images/**/*.*',
		fonts : 'app/fonts/**/*.*'
	},
	clean: {
		all: "build/*",
		html  : "build/**/*.html",
		js    : "build/js/*",
		style : "build/css/**/*.css",
		images: "build/images/**/*.*",
		fonts : "build/fonts/**/*.*"
	}
};

const config = {
	server: {
		baseDir: "./build",
		directory: true
	},
	tunnel: false,
	// host: 'localhost',
	// port: 9000,
	logPrefix: "pioo",
	notify: false
}

gulp.task('html:build', function(){
	gulp.src(path.src.html)
	.pipe(rigger())
	.pipe(gulp.dest(path.build.html))
	.on('end', browserSync.reload);
	/*.pipe(reload({stream: true}));*/
});

gulp.task('js:build', function(){
	gulp.src(path.src.js)
	.pipe(rigger())
	.pipe(uglify())
	.pipe(gulp.dest(path.build.js))
	.pipe(reload({stream: true}));
});

gulp.task('style:build', function(){
	gulp.src(path.src.style)
	.pipe(sass(/*{outputStyle: 'expanded'}*/).on('error', sass.logError))
	.pipe(prefixer(["last 10 versions", "ie 11"]))
	.pipe(сombineMQ({
		beautify: true
	}))
	.pipe(gulp.dest(path.build.style))
	.pipe(reload({stream: true}));
});

gulp.task('image:build', function(){
	gulp.src(path.src.images)
	.pipe(gulp.dest(path.build.images))
	.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function(){
	gulp.src(path.src.fonts)
	.pipe(gulp.dest(path.build.fonts))
	.pipe(reload({stream: true}));
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'image:build',
	'fonts:build'
]);

gulp.task('watch', function(){
	gulp.watch([path.watch.html], function(){
		del(path.clean.html);
		gulp.run('html:build');
	});

	gulp.watch([path.watch.js], function(){
		del(path.clean.js);
		gulp.run('js:build');
	});

	gulp.watch([path.watch.style], function(){
		del(path.clean.style);
		gulp.run('style:build');
	});
	
	gulp.watch([path.watch.images], function(){
		del(path.clean.images);
		gulp.run('image:build');
	});

	gulp.watch([path.watch.fonts], function(){
		del(path.clean.fonts);
		gulp.run('fonts:build');
	});
});

gulp.task('clean', function(){
	del(path.clean.all);
});

gulp.task('webserver', function(){
	browserSync(config);
});

gulp.task('default', ['clean', 'build', 'webserver', 'watch']);