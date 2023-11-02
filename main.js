var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); // qs가 querystring이라는 node js가 갖고 있는 모듈을 가져온다

function templateHTML(title) {
    return `
    <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="style.css">
            <title>Logiclab - ${title}</title>
            <script src="script.js"></script>
        </head>
        <body>
            <div class="container">
                <header>
                    <div class="header_logo">                       
                    <h1><a href="/">Logiclab</a></h1>                     
                    </div>

                    <nav class="header_menu">
                        <ul>
                            <li><a href="/makingquestions">문제만들기</a></li>
                            <li><a href="ranking">순위</a></li>
                        </ul>           
                    </nav>
                    <div class="header_member" onclick="redirectToNewPage('page1.html');">
                        <a href="#">로그인</a>
                    </div>
                </header>                     
             </div>
             <footer></footer>           
        </body>
        </html>
    `;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  console.log(queryData.id);
  
  if (pathname === '/') {
    if (queryData.id === undefined) {
      // Default content when no ID is provided
      var title = 'Logic Lab';
      var template = templateHTML(title) + `
      <div class="top-controls">
        <div class="select-form">
            <select>
                <option value="">전체</option>
                <option value="">수열</option>
                <option value="">디지털 숫자</option>
                <option value="">도형</option>
                <option value="">영어</option>
                <option value="">카드</option>
                <option value="">함수</option>
            </select>
        </div>
        <div class="search-form">
            <input type="text" placeholder="문제 검색" />
            <button>search</button>
        </div>
    </div>

    <div class="card-container">
      <div class="card" onclick="redirectToNewPage('page1.html');">
      <!-- 카드 반복을 위한 JavaScript 코드 -->
      <script>
          for (var i = 1; i <= 6; i++) {
          document.write(\`
              <div class="card" onclick="redirectToNewPage('page$\{i\}.html');">
              <img src="https://img.example.com/card$\{i\}.jpg" alt="카드 $\{i\}">
              <h2>카드 $\{i\}</h2>
              <p>카드 $\{i\} 설명</p>
              </div>
          \`);
          }
      </script>
      </div>
    </div>

  <div class="page">
      <ul class="pagination modal">
          <li><a href="#" class="first">처음 페이지</a></li>
          <li><a href="#" class="arrow lieft"><<<</a></li>
          <li><a href="#" class="active num">1</a></li>
          <li><a href="#" class="num">2</a></li>
          <li><a href="#" class="num">3</a></li>
          <li><a href="#" class="num">4</a></li>
          <li><a href="#" class="num">5</a></li>
          <li><a href="#" class="arrow right">>></a></li>
          <li><a href="#" class="last">마지막 페이지</a></li>
      </ul>
    </div>`; //이렇게 하면 data/questions.json 대신 data/{queryData.id}.json 파일을 읽게 됩니다.
      response.writeHead(200);
      response.end(template);
    } else {
      fs.readFile(`data/${queryData.id}.json`, 'utf-8', function (err, data) {
        if (err) {
          response.writeHead(404);
          response.end('Not Found');
          return;
        }
        // Parse JSON data
        var questionData = JSON.parse(data);
  
        // Use questionData to build the page content
        var title = 'Logic Lab';
        var template = templateHTML(title) + `
        <div class="top-controls">
            <div class="select-form">
                <select>
                    <option value="">전체</option>
                    <option value="">수열</option>
                    <option value="">디지털 숫자</option>
                    <option value="">도형</option>
                    <option value="">영어</option>
                    <option value="">카드</option>
                    <option value="">함수</option>
                </select>
            </div>
            <div class="search-form">
                <input type="text" placeholder="문제 검색" />
                <button>search</button>
            </div>
        </div>

        <div class="card-container">
            <div class="card" onclick="redirectToNewPage('page1.html');">
            <!-- 카드 반복을 위한 JavaScript 코드 -->
            <script>
                for (var i = 1; i <= 6; i++) {
                document.write(\`
                    <div class="card" onclick="redirectToNewPage('page$\{i\}.html');">
                    <img src="https://img.example.com/card$\{i\}.jpg" alt="카드 $\{i\}">
                    <h2>카드 $\{i\}</h2>
                    <p>카드 $\{i\} 설명</p>
                    </div>
                \`);
                }
            </script>
            </div>
        </div>

        <div class="page">
            <ul class="pagination modal">
                <li><a href="#" class="first">처음 페이지</a></li>
                <li><a href="#" class="arrow lieft"><<<</a></li>
                <li><a href="#" class="active num">1</a></li>
                <li><a href="#" class="num">2</a></li>
                <li><a href="#" class="num">3</a></li>
                <li><a href="#" class="num">4</a></li>
                <li><a href="#" class="num">5</a></li>
                <li><a href="#" class="arrow right">>></a></li>
                <li><a href="#" class="last">마지막 페이지</a></li>
            </ul>
        </div>`; //이렇게 하면 data/questions.json 대신 data/{queryData.id}.json 파일을 읽게 됩니다.
        response.writeHead(200);
        response.end(template);
      });
    }
  } else if (pathname === '/makingquestions') {
    fs.readFile('data/makingquestions', 'utf-8', function (err, description) {
        if (err) {
            // 파일을 찾을 수 없거나 읽을 수 없는 경우
            response.writeHead(500);
            response.end('Internal Server Error');
            return;
        }
        var title = '문제 만들기';
        var template = templateHTML(title) + `<div id="create-question-form">
            <h2><a href="/makingquestions">문제 만들기</a></h2>
            <form action="http://localhost:3000/makingquestions_process" method="post">                    
                <!-- 문제 폼 내용을 그대로 둡니다. -->
                
                <label for="question-title">문제 제목:</label>
                <input type="text" id="question-title" name="question_title" placeholder="제목"required />

                    <!-- 파일 업로드 입력 필드 추가 -->
                <label for="file-upload">첨부 파일:</label>
                <input type="file" id="file-upload" name="file_upload" accept=".pdf,.doc,.docx,.jpg,.png" />

                <label for="question-description">문제 설명:</label>
                <textarea id="question-description" name="question_description" rows="4" placeholder="본문" required></textarea>

                <label for="answer">정답 입력:</label>
                <input type="text" id="question-answer" name="question_answer" placeholder="정답" required />
        </div>

        <ul id="tag-list">
        </ul>

        <!-- 수정/삭제/확인 버튼 추가 -->
        <div id="action-buttons">
            <button type="submit" value="Submit">확인</button>
            <button type="button" id="edit-button">수정</button>
            <button type="button" id="delete-button">삭제</button>
        </div>`;
        
        response.writeHead(200);
        response.end(template);
    });
} else if (pathname === '/ranking') {
    fs.readFile('data/ranking', 'utf-8', function (err, description) {
        if (err) {
            // 파일을 찾을 수 없거나 읽을 수 없는 경우
            response.writeHead(500);
            response.end('Internal Server Error');
            return;
        }
        var title = '문제 만들기';
        var template = templateHTML(title) + `a
        
        
        
        
        
        


        `;
        
        response.writeHead(200);
        response.end(template);
    });
} else if (pathname === '/makingquestions_process') {
    let body = '';
    request.on('data', function (data) {
      body = body + data;
    });
  
    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.question_title;
      var description = post.question_description;
      var answer = post.question_answer;
  
      // 기존 데이터를 읽어옴
      fs.readFile('data/questions.json', 'utf8', function (err, data) {
        if (err) {
          console.error("파일 읽기 오류:", err);
          response.writeHead(500);
          response.end('Internal Server Error');
          return;
        }
  
        // 기존 데이터를 JSON 객체로 파싱
        var existingData = JSON.parse(data);

        // question_number를 1씩 증가
        var question_number = String(Object.keys(existingData).length + 1).padStart(4, '0');

        
        // 새로운 데이터를 추가
          existingData[question_number] = {
            title: title,
            description: description,
            answer: answer
          };
  
        // 데이터를 JSON 문자열로 변환
        var updatedData = JSON.stringify(existingData);
  
        // 업데이트된 데이터를 파일에 씀
        fs.writeFile('data/questions.json', updatedData, 'utf8', function (err) {
          if (err) {
            console.error("파일 쓰기 오류:", err);
            response.writeHead(500);
            response.end('Internal Server Error');
            return;
          }
        response.writeHead(302, { 'Location': '/' });
        response.end();
        });
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);