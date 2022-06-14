import gulp from 'gulp'

import pug from 'gulp-pug'

import stylus from 'gulp-stylus'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

import cacheBust from 'gulp-cache-bust'
import imagemin from 'gulp-imagemin'

import {init as server, stream, reload} from 'browser-sync'
import plumber from 'gulp-plumber'
import del from 'del'

const isProduction = Boolean(process.env.PRODUCTION)
const cssPlugins = isProduction ? [autoprefixer(), cssnano()] : [autoprefixer()]

import babel from 'gulp-babel'
import terser from 'gulp-terser'

gulp.task('html', () => {
	return gulp
		.src('src/views/**.pug')
		.pipe(plumber())
		.pipe(pug({
			pretty: isProduction ? false : true
		}))
		.pipe(cacheBust({
			type: 'timestamp'
		}))
		.pipe(gulp.dest('./public'))
		.pipe(stream())
})

gulp.task('css', () => {
	return gulp
		.src('src/css/style.styl')
		.pipe(plumber())
		.pipe(stylus({
			"include css": true
		}))
		.pipe(postcss(cssPlugins))
		.pipe(gulp.dest('./public'))
		.pipe(stream())
})

gulp.task('js', () => {
	return gulp
		.src('./src/js/*.js')
		.pipe(plumber())
		.pipe(gulp.dest('./public/js'))
		.pipe(stream())
})

gulp.task('js:prod', () => {
	return gulp
		.src('./src/js/*.js')
		.pipe(plumber())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(terser())
		.pipe(gulp.dest('./public/js'))
		.pipe(stream())
})

gulp.task('optimizeimages', () => {
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

gulp.task('cpimages', () => {
	return gulp
		.src('./src/images/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('./public/images'))
		.pipe(stream())
})

gulp.task('watch', () => {
	gulp.watch(['./src/pages/**/*.pug', './src/templates/**/*.pug'], gulp.series('html')).on('change', reload)
	gulp.watch('./src/css/**/*.styl', gulp.series('css')).on('change', reload)
	gulp.watch('./src/js/*.js', gulp.series('js')).on('change', reload)
	gulp.watch('./src/images/**/*', gulp.series('cpimages'))
	server({
		server: './public',
		ghostMode: false,
		notify: false,
	})
})

gulp.task('clean', (end) => {
	del('public')
	end()
})

gulp.task('build', gulp.series('html', 'css', isProduction ? 'js:prod' : 'js', isProduction ? 'optimizeimages' : 'cpimages'))
gulp.task('default', gulp.series('build', 'watch'))
