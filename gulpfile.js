'use strict';
var async = require('async');
var gulp = require('gulp');
var packageJson = require("./package.json");
var pug = require('gulp-pug');
const zip = require('gulp-zip');

var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
// var babel = require('gulp-babel');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gulpIf = require('gulp-if');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var spritesmith = require('gulp.spritesmith');

var iconfont = require('gulp-iconfont');
var iconfontCSS = require('gulp-iconfont-css');
var runTimestamp = Math.round(Date.now()/1000);

var del = require('del');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var environments = require('gulp-environments');

var development = environments.development;
var production = environments.production;
var meta = {
			views:      'source/views',
			styles:     'source/sass',
			imgs:       'source/images',
			js:         'source/js',
			font:       'source/fonts',
			src:        'source',
			public:     'public'
		};
gulp.task('compile:views', function buildHTML() {
	return gulp.src([meta.views + '/*.pug', '!' + meta.views + '/bk_*.pug', '!' + meta.views + '/demo.pug'])
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest(meta.public))
	.pipe(browserSync.reload({ 
		stream: true
	}));
});

gulp.task('compile:sass', function() {
	return gulp.src([meta.styles + '/**/*.scss']) 
		.pipe(sourcemaps.init())
		.pipe(sass(
			{includePaths: ['./node_modules/foundation-sites/scss']}
		).on('error', sass.logError)) 
		.pipe(sourcemaps.write())
		.pipe(autoprefixer({browsers: ['last 2 versions', 'ie >= 9', 'Android >= 2.3', 'ios >= 7']})) 
		.pipe(gulp.dest(meta.public + '/css')) 
		.pipe(browserSync.reload({ // Reloading with Browser Sync
			stream: true
		}));
})

gulp.task('compile:compass', function() {
	return gulp.src([meta.styles + '/*.scss'])
		.pipe(compass({
			css: meta.public + '/css',
						sass: meta.styles,
						// image: 'html/images',
			import_path: ['./node_modules/foundation-sites/scss'],
			sourcemap: true
		}))
		.pipe(production(autoprefixer({browsers: ['last 2 versions', 'ie >= 9', 'Android >= 2.3', 'ios >= 7']}))) 
		.pipe(production(cssnano())) // only minify file in production mode
		.pipe(gulp.dest(meta.public + '/css')) 
		.pipe(browserSync.reload({ 
			stream: true
		}));
});

gulp.task('compile:es6', function(){
	return browserify({entries: meta.js + '/main.es6.js', debug: true})
		.transform("babelify", { presets: ["es2015"] })
		.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(production(uglify()))// only minify file in production mode
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(meta.public + '/js'))
		.pipe(browserSync.reload({ 
			stream: true
		}));
});

gulp.task('minify:js', function() {
	return gulp.src([meta.js + '/libs/jquery-2.2.5.min.js', meta.js + '/libs/modernizr.custom.js', meta.js + '/libs/*.js', '!' + meta.js + '/libs/bk_*.js'])
		.pipe(concat('plugins.min.js'))
		.pipe(production(uglify()))// only minify file in production mode
		.pipe(gulp.dest(meta.public + '/js'));
});

gulp.task('minify:css', function() {
	return gulp.src([meta.src + '/css/libs/*.css'])
		.pipe(concat('plugins.min.css'))
		.pipe( production(cssnano()))// only minify file in production mode
		.pipe(gulp.dest(meta.public + '/css'));
});

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
	return gulp.src(meta.public + '/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest(meta.public));
});

// Optimizing Images 
gulp.task('minify:images', function() {
	return gulp.src(meta.imgs + '/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true,
		})))
		.pipe(gulp.dest(meta.public + '/images'))
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(meta.imgs + '/sprite/*.png').pipe(spritesmith({
		// retinaSrcFilter: 'app/images/sprite/*@2x.png',
		// retinaImgName: 'sprite@2x.png',
		imgName: 'sprite.png',
		padding: 10,
		imgOpts: {quality: 75},
		algorithm: 'left-right',
		cssName: '_sprite.css'
	}));
 
	spriteData.img.pipe(gulp.dest(meta.imgs));
	spriteData.css.pipe(gulp.dest(meta.styles));
 
});

gulp.task('iconfont', function(){
	var fontName = "myfont";
	return gulp.src(['source/images/icons/*.svg'])
		.pipe(iconfontCSS({
			fontName: fontName, 
			path: 'source/scss/templ/_icons.scss', 
			targetPath: '../scss/_fontface.scss', 
			cssClass: 'myIcon',
			fontPath: '../fonts/' 
		}))
		.pipe(iconfont({
			prependUnicode: false, // Recommended option 
			fontName: fontName, 
			formats: ['ttf', 'eot', 'woff'], 
			normalize: true,
			fontHeight: 1001,
			centerHorizontally: true,
			timestamp: runTimestamp // Recommended to get consistent builds when watching files
		}))
			.on('glyphs', function(glyphs, options) {
				// CSS templating, e.g.
				console.log(glyphs, options);
			})
		.pipe(gulp.dest(meta.font));
});

// Copying fonts 
gulp.task('copy:fonts', function() {
	return gulp.src(meta.font + '/**/*')
		.pipe(gulp.dest(meta.public + '/fonts'))
});

// copy multiple files and keep the folder structure
gulp.task('copy:asset', function() {
	return gulp.src([meta.font + '/**/*', meta.imgs + '/**/*'],  {base: './source/'})
		.pipe(gulp.dest(meta.public))
		.pipe(browserSync.reload({ 
			stream: true
		}));
});

gulp.task('zip', function() {
	// var date = new Date().toISOString().slice(0, 10);
	var date = new Date().toString().split(' ').splice(1,3).join('');

	return gulp.src(meta.public + '/**')
		.pipe(zip(packageJson.name + '-' + packageJson.version + ".zip"))
		.pipe(gulp.dest('./'))
})

// Cleaning 
gulp.task('clean', function() {
	return del.sync([meta.public]).then(function(cb) {
		return cache.clearAll(cb);
	});
});

gulp.task('clean:dist', function() {
	return del.sync(['public/**/*', '!public/images', '!public/images/**/*']);
});

// Start browserSync server
gulp.task('browserSync', function() {
	browserSync({
		// files: ["public/**/*.*"],
		port : 3200,
		server: {
			baseDir: meta.public
		}
	})
});

// Watchers
gulp.task('watch', function() {
	gulp.watch([meta.styles + '/**/*.scss'], ['compile:sass']);
	gulp.watch([meta.views + '/**/*.pug'], ['compile:views']);
	gulp.watch([meta.js + '/*.es6.js'], ['compile:es6']);
	gulp.watch([ meta.imgs + '/**/*.+(png|jpg|jpeg|gif|svg)'], ['copy:asset']);
});

gulp.task('default', function(callback) {
	runSequence('compile:views', 'compile:sass', 'compile:es6', 'copy:asset', ['browserSync'], 'watch',
		callback
	)
});

// commnad line: gulp build --env production
gulp.task('build', function() {
	runSequence('clean:dist', 'compile:views', 'compile:sass', 'compile:es6', 'minify:js', 'minify:css', 'minify:images', 'copy:fonts', ['browserSync'], 'watch')
});