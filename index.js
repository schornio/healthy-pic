'use strict';
/* jslint node: true */

var http = require('http');
var express = require('express');
var app = express();

var check = require(__dirname + '/config.json');

var healthy = { };

function checkPerHttpRequest(item, config) {
  var request = http.request(config, function (response) {
    if(response.statusCode < 400) {
      healthy[item] = true;
    } else {
      healthy[item] = false;
    }
  });

  request.on('error', function () {
    healthy[item] = false;
  });

  request.end();
}

function doCheck () {
  for (var item in check) {
    if(!check.hasOwnProperty(item)) { continue; }

    healthy[item] = null;

    if(check[item].httpRequest) {
      checkPerHttpRequest(item, check[item].httpRequest);
    }
  }
}

setInterval(doCheck, process.env.TEST_INTERVAL || 60 * 1000);
doCheck();

app.get('/:item', function (request, response, next) {
  if(!request.params.item) {
    next();
    return;
  }

  if(healthy[request.params.item] === true) {
    response.sendFile(__dirname + '/static/green.png');
    return;
  }

  if(healthy[request.params.item] === null) {
    response.sendFile(__dirname + '/static/yellow.png');
    return;
  }

  if(healthy[request.params.item] === false) {
    response.sendFile(__dirname + '/static/red.png');
    return;
  }

  response.sendFile(__dirname + '/static/grey.png');
  return;
});

app.listen(process.env.PORT || 1337);
