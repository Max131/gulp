import gulp from 'gulp'
//common
import concat from 'gulp-concat' //join files
//HTML
import htmlmin from 'gulp-htmlmin' //minify html
//CSS
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
const cssPlugins = [
	autoprefixer(), //prefix vendor 
	cssnano() //minify css
]
//Clean css
import purgecss from 'gulp-purgecss'
//JS
import babel from 'gulp-babel' //transpile
import terser from 'gulp-terser' //minify js
//PUG
import pug from 'gulp-pug'
const production = false
//SASS
import dsass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dsass) 
//Cache bust, append string to avoid cache
import cacheBust from 'gulp-cache-bust'
//Optimize images
import imagemin from 'gulp-imagemin'
//Browser sync
import { init as server, stream, reload } from 'browser-sync'
//Gulp plumber, prevent crashes on error
import plumber from 'gulp-plumber'
//Live server 
import gls from 'gulp-live-server'

gulp.task('html', () => {
		return gulp
			.src('./src/**/*.html')
			.pipe(plumber())
			.pipe(htmlmin({
				collapseWhitespace: true,
				removeComments: true
			}))
			.pipe(cacheBust({
				type: 'timestamp'
			}))
			.pipe(gulp.dest('./public'))
			.pipe(stream()) //reload browsersyn on changes
	}
)

gulp.task('css', () => {
		return gulp
			.src('./src/css/*.css')
			.pipe(plumber())
			.pipe(concat('styles.min.css'))
			.pipe(postcss(cssPlugins))
			.pipe(gulp.dest('./public/css'))
			.pipe(stream()) //reload browsersyn on changes
	}
)

gulp.task('js', () => {
		return gulp
			.src('./src/js/*.js')
			.pipe(plumber())
			.pipe(babel({
				presets: ['@babel/env']
			}))
			.pipe(concat('main.min.js'))
			.pipe(terser())
			.pipe(gulp.dest('./public/js'))
			.pipe(stream()) //reload browsersyn on changes
	}
)

gulp.task('pug', () => {
	return gulp
			.src('src/views/pages/*pug')
			.pipe(plumber())
			.pipe(pug({
				pretty: production? false: true
			}))
			.pipe(cacheBust({
				type: 'timestamp'
			}))
			.pipe(gulp.dest('./public'))
			.pipe(stream()) //reload browsersyn on changes
})

gulp.task('sass', () => {
	return gulp
			.src('src/sass/styles.scss')
			.pipe(plumber())
			.pipe(sass({
				outputStyle: 'expanded'
			}))
			.pipe(gulp.dest('./public/css'))
			.pipe(stream()) //reload browsersyn on changes
})

gulp.task('purgecss', () => {
	return gulp
			.src('./public/css/styles.css')
			.pipe(plumber())
			.pipe(purgecss({
				content: ['./public/**/*.html']
			}))
			.pipe(gulp.dest('./public/css'))
})

gulp.task('imgmin', () => {
	return gulp
			.src('./src/images/**/*')
			.pipe(plumber())
			.pipe(imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.mozjpeg({quality: 80, progressive: true}),
				imagemin.optipng({optimizationLevel: 1})
			]))
			.pipe(gulp.dest('./public/images'))
})


gulp.task('default', () => {
//	gulp.watch('./src/*.html', gulp.parallel('html')).on('change', reload)
//	gulp.watch('./src/*.css', gulp.parallel('css')).on('change', reload)
	gulp.series('pug', 'sass', 'js')
	gulp.watch('./src/views/**/*.pug', gulp.parallel('pug')).on('change', reload)
	gulp.watch('./src/sass/**/*.scss', gulp.parallel('sass')).on('change', reload)
	gulp.watch('./src/js/*.js', gulp.parallel('js')).on('change', reload)
	server({
		server: './public'
	})
})

gulp.task('live', () => {
	console.log('Hello Live');
	gulp.series('pug', 'sass', 'js')
	gulp.watch('./src/views/**/*.pug', gulp.parallel('pug')).on('change', reload)
	gulp.watch('./src/sass/**/*.scss', gulp.parallel('sass')).on('change', reload)
	gulp.watch('./src/js/*.js', gulp.parallel('js')).on('change', reload)
	const server = gls.static('public', 3000) // = gls.static('public', 3000)
	server.start();
	gulp.watch('./public/**/*', file => {
		server.notify.apply(server, [file])
	})
})
