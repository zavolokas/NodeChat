var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var jsFiles = ['**/*.js'];

gulp.task('serve',function(){
    var option = {
        script: 'bin/www',
        delayTime: 1,
        env: {
            'PORT': 3000
        },
        watch: jsFiles
    };
    
    return nodemon(option)
        .on('restart', function(ev){
            console.log('Restarting...');
        });
});