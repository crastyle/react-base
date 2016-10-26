var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var template = require('gulp-template');
var rename = require('gulp-rename');
var path = require('path');
var yargs = require('yargs');
import serve    from 'browser-sync';
import del      from 'del';
import webpackDevMiddelware from 'webpack-dev-middleware';
import webpachHotMiddelware from 'webpack-hot-middleware';
import autoRegister from './autoRegister'


const root = 'src';
// map of all paths
let paths = {
    // js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
 
    entry: [
        'babel-polyfill',
        path.join(__dirname,root,'app/app.js')
    ]
};
let resolveToPages = (glob = '') => {
    return path.join(root, 'app/components', glob); // app/pages/{glob}
};

gulp.task('page', () => {
    const cap = (val) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
    };
    const params = yargs.argv.name;
    let arrParams = params.split('');
    arrParams[0] = arrParams[0].toUpperCase();
    const name = arrParams.join('');
    const parentPath = yargs.argv.parent || '';
    const temp = path.join(__dirname, 'template', '**/*.**');
    const outPage = path.join(resolveToPages(), parentPath, name);
    const pagefile = path.join(resolveToPages(),'app.pages.js');
    autoRegister(name,pagefile);

    gulp.src(temp)
        .pipe(template({
            name: name,
            upCaseName: cap(name)
        }))
        .on('error', err => {
            console.log(err);
        })
        .pipe(rename((path) => {
            path.basename = path.basename.replace('components', name);
        }))
        .pipe(gulp.dest(outPage));
});

gulp.task('serve',() =>{
    const config = require('./webpack.config');
    config.entry.app = [
        // this modules required to make HRM working
        // it responsible for all this webpack magic
        'webpack-hot-middleware/client?reload=true',
        // application entry point
    ].concat(paths.entry);
    var compiler = webpack(config);
    let bs = serve.create();
    initBs(bs,compiler,config)
    bs.reload()
});

// use webpack.config.js to build modules
gulp.task('webpack',['clean'],(cb) =>{
    const config = require('./webpack.dist.config');
    config.entry.app = paths.entry;

    webpack(config,(err,stats) =>{
        if(err){
            throw new gutil.PluginError("webpack",err);
        }

        gutil.log("[webpack]",stats.toString({
            colors: colorsSupported,
            chunks: false,
            errorDetails: true
        }));

        cb();
    });
});

gulp.task('default',['serve']);