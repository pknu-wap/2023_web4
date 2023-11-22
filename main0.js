const http = require('http');
const url = require('url');
const express = require('express');
//const multer = require('multer');
const main = require('./lib/main');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

if (pathname === '/') {
    if (queryData.id === undefined) { 
        main.home(request, response);
    } else {
        main.home1(request, response);
    }
} else if (pathname === '/checkAnswer'){
    main.checkAnswer(request, response);
} else if (pathname === '/solution') {
    main.solution(request, response);
} else if (pathname === '/create') {
    main.create(request, response);
} else if (pathname === '/create_process') {
    main.create_process(request, response);
} else if (pathname === '/update') {
    main.update(request, response);
} else if (pathname === '/update_process') {
    main.update_process(request, response);
} else if(pathname === '/delete_process'){
    main.delete_process(request, response);
} else if (pathname === '/ranking') {
    main.ranking(request, response);
} else if (pathname === '/login') {
    main.login(request, response);
} else if (pathname === '/signup') {
    main.signup(request, response);
} else {
    response.writeHead(404);
    response.end('Not found');
}
});
app.listen(3000);