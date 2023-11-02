var http = require('http');
var fs = require('fs');
var url = require('url'); 
var qs = require('querystring'); // qs가 querystring이라는 node js가 갖고 있는 모듈을 가져온다
var template = require('./lib/template.js');
var mysql = require('mysql2');
mysql.createConnection({
    host: 'localhost', // MySQL 서버 호스트
    user: 'root',   // MySQL 사용자 이름
    password: '', // MySQL 사용자 비밀번호
    database: 'opentutorials', // 사용할 데이터베이스 이름
  });
  //opentutorials에 있는 table수정하기(중요!!)
  db.connect();


var app = http.createServer(function (request, response) { //첫번쨰인수(파라미터)인 함수를 소환 response, return으로 http.server불러옴
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  
  if(pathname === '/'){
    if(queryData.id === undefined) { 
      /*fs.readdir('./data', function(err, filelist) {
        var title = 'WEB';
        var description = 'The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.';
        var list = template.list(filelist); //filelist는 data directory에 있는 파일의 리스트 templatelist의 입력값으로 주면 filelist값을 받아서 list정보를 만들고 결과를 return한다.
        var html = template.HTML(title, list, 
          `<h2>${title}</h2>${description}`, 
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html); /*response.end(fs.readFileSync(__dirname + _url));
      })*/ 
        db.query('SELECT * FROM topic', function (error, topic) {
                if (error) {
                    console.log(error);
                }
            var title = 'WEB';
            var description = 'The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.';
            var list = template.list(topic); //filelist대신 database에서 topic를 가져온다.
            var html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`, 
            `<a href="/create">create</a>`);
            console.log(topic);
            response.writeHead(200);
            response.end(html);
        });
        //대괄호는 배열, 중괄호는 객체
    } else {
      /*fs.readdir('./data', function(err, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf-8', function (err, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(title, list, 
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a> 
           <a href="/update?id=${title}">update</a>
           <form action="delete_process" method="post">
           <input type="hidden" name="id" value="${title}">
           <input type="submit" value="delete">
           </form>`
          ); //delete를 querystring get 방식으로 구현하면 다른 사람이 삭제하는 문제가 발생 따라서 url로 하면 안 됨
        response.writeHead(200);
        response.end(html); //response.end(fs.readFileSync(__dirname + _url));
        });
      });*/
      db.query('SELECT * FROM topic', function (error, topic) {
                if (error) {
                    console.log(error);
                }
        db.query('SELECT * FROM topic WHERE id = ?', [queryData.id], function (error2, topic){
            if (error2) {
                console.log(error2);
            }
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topic); //filelist대신 database에서 topic를 가져온다.
            var html = template.HTML(title, list, 
            `<h2>${title}</h2>${queryData.id}`, 
            `<a href="/create">create</a> 
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <input type="submit" value="delete">
            </form>`);
            console.log(topic);
            response.writeHead(200);
            response.end(html);
        });
    });
    }
  } else if(pathname === '/create') {
    fs.readdir('./data', function(err, filelist) {
      var title = 'WEB';
      var list = template.list(filelist); //filelist는 data directory에 있는 파일의 리스트 templatelist의 입력값으로 주면 filelist값을 받아서 list정보를 만들고 결과를 return한다.
      var html = template.HTML(title, list, `
        <form action="http://localhost:3000/create_process" method="post">
	        <p><input type="text" name="title" placeholder="title"></p>
	        <p>
	          <textarea name="description" placeholder="description"></textarea>
	        </p>
	        <p>
	          <input type="submit">
          </p>
	      </form>
      `, ``);
      response.writeHead(200);
      response.end(html); /*response.end(fs.readFileSync(__dirname + _url));*/
    }) 
  } else if(pathname === '/create_process') {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {location: `/?id=${title}`});
          response.end();
        })
    });
  }else if(pathname === '/update'){
    fs.readdir('./data', function(error, filelist){
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if(pathname === '/update_process') {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){ //description 정보를 주고 우리가 받은 id값으로 들어간다
            response.writeHead(302, {location: `/?id=${title}`});
            response.end();
          })
        }) 
    });
  } else if(pathname === '/delete_process') {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`, function(error){
          response.writeHead(302, {location: `/`});
          response.end();
        })
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);