// uxebu postprocessor, this is specific to the uxebu.com website

var appConfig   = require('../appConfig');
var appUtil   = require('../appUtil');
var exec  = require('child_process').exec;
var path = require('path');

appUtil.statusLog('Post processor\t' + 'Copying licensed content');

var cmd = 'cp -r ' + path.join(__dirname, '../../', 'uxebu.com-data') + ' ' + appConfig.releaseDir + '/static/data';

exec(cmd,
    function (err, stdout, stderr) {
        if (err !== null) {
            console.log('Error copying (' + cmd + ') static files: ' + err);
        }else{
            console.log('Copied files from post processor');
        }
    }
);