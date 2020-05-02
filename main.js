'use strict';

var express = require('express');
var server = express();
var logger = require('morgan');

server.use(logger('dev'));

server.use(express.static(__dirname+'/public'));

server.listen(8080, function(){
    console.log('Server file sudah berjalan bos!');
});