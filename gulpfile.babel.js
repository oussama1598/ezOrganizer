'use strict'

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import runSequence from 'run-sequence'
import del from 'del'

const plugins = gulpLoadPlugins()

const paths = {
  dist: 'dist',
  src: {
    scripts: [
      'app/**/!(*.spec|*.integration).js'
    ],
    json: [
      'app/**/*.json'
    ]
  }
}

gulp.task('clean:dist', () => del(
  [`${paths.dist}/!(.git*|Procfile)**`],
  {
    dot: true
  })
)

gulp.task('copy:server', () => {
  return gulp.src([
    'package.json'
  ], {
    cwdbase: true
  })
    .pipe(gulp.dest(paths.dist))
})

gulp.task('transpile:server', () => {
  return gulp.src(paths.src.scripts.concat(paths.src.json))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(`${paths.dist}/app`))
})

gulp.task('build', cb => {
  runSequence(
    'clean:dist',
    'transpile:server',
    'copy:server',
    cb
  )
})
