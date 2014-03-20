typescriptify
========================

## Information

<table>
<tr> 
<td>Package</td><td>typescriptify</td>
</tr>
<tr>
<td>Description</td>
<td>Typescript transform for Browserify</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Usage

    $ npm install typescriptify
    $ browserify -t typescriptify main.ts > bundle.js

## Usage with `gulp-browserify`

    var gulp        = require('gulp');
    var browserify  = require('gulp-browserify');
    var rename      = require('gulp-rename');

    gulp.task('default', function () {
      return gulp
        .src('app/main.ts')
        .pipe(browserify({
            transform:  ['typescriptify'],
            extensions: ['.ts'],
        }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('dist'));
    });
