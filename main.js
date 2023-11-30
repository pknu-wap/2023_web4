const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
// 이미지를 저장할 디렉터리 및 파일 이름 설정
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (request, file, cb) {
    cb(null, file.fieldname + '-' + Math.round(Math.random() * 1E9));
  },
});
const upload = multer({ storage: storage });
const path = require('path');
const url = require('url');
const fs = require('fs');
const template = require('./template');
const db = require('./db');
var authCheck = require('./authCheck.js');

// 정적 파일 제공
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: false }));

exports.home = function(request, response){ 
    db.query(`SELECT * FROM question`, function(err, questions){
      // db.query 함수를 사용하여 데이터베이스에서 카테고리 목록을 가져옴
      db.query('SELECT * FROM category', function(err, categories) {
        if (err) {
            throw err;
        }
      // categories를 사용하여 <select> 요소를 동적으로 생성
      var categoryOptions = categories.map(category => {
          return `<option value="${category.category}">${category.category}</option>`;
      }).join('');
        var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                    fs.readFileSync('./lib/style/home.css', 'utf8');
        var title = ``;
        var header = `
          <li><a href="/create">문제만들기</a></li>
          <li><a href="/ranking">랭킹</a></li>
          ${authCheck.statusUI(request, response)}
        `;
        var body0 = `
        <form method="post" action="/category_process">
          <div class="top-controls">
            <div class="select-form">
              <select id="categoryFilter" name="category">
                <option value="">전체</option>
                  ${categoryOptions}
              </select>
              <button type="submit">적용</button>
            </div>
          </div>     
        </form>   
        `;
        var list = template.list0(questions); //topics에 들어있는 값은 객체로 들어있다
        var body1 = ``;
        var body2 = ``;
        var html = template.HTML(style, title, header, body0, list, body1, body2);
        response.send(html);
    })
  })
}
exports.category_process = function(request, response){
  // request 객체에서 POST 데이터를 가져옴
  const selectedCategory = request.body.category;
  
  // 카테고리가 선택되었을 때
  let query = 'SELECT * FROM question';

  // 카테고리가 선택된 경우, 해당 카테고리에 속하는 문제만 가져오도록 쿼리 수정
  if (selectedCategory) {
      query += ` WHERE category = '${selectedCategory}'`;
  }

  db.query(query, function(err, questions){
    // db.query 함수를 사용하여 데이터베이스에서 카테고리 목록을 가져옴
    db.query('SELECT * FROM category', function(err, categories) {
      if (err) {
          throw err;
      }
    // categories를 사용하여 <select> 요소를 동적으로 생성
    var categoryOptions = categories.map(category => {
        return `<option value="${category.category}">${category.category}</option>`;
    }).join('');
    var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                fs.readFileSync('./lib/style/home.css', 'utf8');
    var title = ``;
    var header = `
      <li><a href="/create">문제만들기</a></li>
      <li><a href="/ranking">랭킹</a></li>
      ${authCheck.statusUI(request, response)}
    `;
    var body0 = `
    <form method="post" action="/category_process">
      <div class="top-controls">
        <div class="select-form">
          <select id="categoryFilter" name="category">
            <option value="">전체</option>
              ${categoryOptions}
          </select>
          <button type="submit">적용</button>
        </div>
      </div>     
    </form>
    `;
    var list = template.list0(questions);
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(style, title, header, body0, list, body1, body2);
    response.send(html);
    })
  })
}
exports.home1 = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM question`, function(error, questions){
        if(error){
          throw error;  
        }
        db.query(`SELECT * FROM question WHERE id = ?`, [queryData.id], function(error2, question){
          if(error2){
            throw error2;
          }
          db.query(`SELECT * FROM solution WHERE question_id = ?`, [queryData.id], function(error2, solutions) {
            if (error2) {
              throw error2;
            }
        var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                    fs.readFileSync('./lib/style/home1.css', 'utf8');
        var header = `
          <li><a href="/create">문제만들기</a></li>
          <li><a href="/ranking">랭킹</a></li>
          ${authCheck.statusUI(request, response)}
        `;          
        var title = "-" + question[0].title;
        var body0 = `
        <div class="containe">
        <p id="user_id">글쓴이 : ${question[0].user_id}</p>
        <p style="font-size: 12px; color: #999;">문제 생성일 : ${question[0].created}</p>
        <h1 id="question_title">제목 : ${question[0].title}</h1>
        <p id="question_description">${question[0].description}</p>
        <img id="question_image" src="/uploads/${question[0].image}" alt="Question Image">
        <p id="question_answer">답변 : ${question[0].answer}</p>
        <p id="question_category">카테고리 : ${question[0].category}</p>
        `;
        var list = ``; 
        // 가정: 현재 사용자의 user_id
        const currentUserID = `${request.session.nickname}`;

        // 로그인한 사용자의 풀이가 있는지 확인
        const userSolution = solutions.find(solution => solution.user_id === currentUserID);

        if (userSolution) {
          // 풀이 표시
          var solutionList = '';
          for (var i = 0; i < solutions.length; i++) {
            solutionList += `<p>${solutions[i].user_id}의 풀이: ${solutions[i].description}</p>`;
          }
          var body1 = solutionList; 
        } else {
          var body1 = `  
          <p>      
          <form action="/checkAnswer" method="post">
                <input type="hidden" name="questionId" value="${queryData.id}">
                <label for="userAnswer">정답을 입력하세요:</label>
                <input type="text" id="userAnswer" name="userAnswer" required>
                <button type="submit">제출</button>
            </form>
          </p>
          `;
        }
        var body2 = `
          <p>      
          <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>
          </p>
        `;
        var html = template.HTML(style, title, header, body0, list, body1, body2);
        response.send(html);
        });
      })
    });
}
exports.checkAnswer = function(request, response) {
  // 로그인 안되어있으면 로그인 페이지로 이동시킴
  if (!authCheck.isOwner(request, response)) {  
    const alertScript = "<script>alert('로그인이 필요합니다'); window.location.href = '/';</script>";
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(alertScript);
    return false;
  }
    const formData = request.body;
    const questionId = formData.questionId;
    const userAnswer = formData.userAnswer;

    // 데이터베이스에서 정답을 가져옴
    db.query('SELECT answer FROM question WHERE id = ?', [questionId], function(error, results) {
      if (error) {
        // 에러 처리
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      if (results.length === 0) {
        // 질문이 없을 경우
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Question not found' }));
        return;
      }
    
      const correctAnswer = results[0].answer;
      if (String(correctAnswer).toLowerCase() === String(userAnswer).toLowerCase()) {
        // 정답인 경우 풀이를 작성할 수 있는 페이지로 이동
        response.writeHead(302, {Location: `/solution?id=${questionId}`}); 
        response.end();
      } else {
          // 틀린 경우
        const alertScript = "<script>alert('틀렸습니다'); window.location.href = '/';</script>";
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(alertScript);
      }      
    });
}
exports.solution = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM question`, function(error, questions){
        if(error){
          throw error;  
        }
        db.query(`SELECT * FROM question WHERE id = ?`, [queryData.id], function(error2, question){
          if(error2){
            throw error2;
          }
        var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                    fs.readFileSync('./lib/style/solution.css', 'utf8');
        var header = `
          <li><a href="/create">문제만들기</a></li>
          <li><a href="/ranking">랭킹</a></li>
          ${authCheck.statusUI(request, response)}
          `;         
        var title = "-" + question[0].title;
        //var body0 = question[0].user_id + `<p></p>` + question[0].title + `<p></p>` + question[0].description + `<p></p>` + question[0].image + `<p></p>` + question[0].answer + `<p></p>` + question[0].category + `<p></p>` + question[0].created;
        var body0 = `
          <div class="containe">
            <p id="user_id">글쓴이 : ${question[0].user_id}</p>
            <p style="font-size: 12px; color: #999;">문제 생성일 : ${question[0].created}</p>
            <h1 id="question_title">제목 : ${question[0].title}</h1>
            <p id="question_description">${question[0].description}</p>
            <img id="question_image" src="/uploads/${question[0].image}" alt="Question Image">
            <p id="question_answer">답변 : ${question[0].answer}</p>
            <p id="question_category">카테고리 : ${question[0].category}</p>
          </div>
        `;
        var list = ``; 
        var body1 = `  
          <p>      
          <form action="/solution_process" method="post">
            <input type="hidden" name="solution_question_id" value="${queryData.id}">

            <label for="solution_user_nickname"></label>
            <input type="hidden" id="solution_user_nickname" name="solution_user_nickname" value="${request.session.nickname}" required />

            <label for="solution">풀이를 입력하세요:</label>        
            <textarea id="solution_description" name="solution_description" rows="5" placeholder="내용을 입력하시오" required></textarea>
            <button type="submit">제출</button>
            </form>
            <script src="/lib/ckeditor/ckeditor.js"></script>
            <script>
            CKEDITOR.replace( 'solution_description' );
            </script>
          </p>
          `;
    var body2 = ``;
    var html = template.HTML(style, title, header, body0, list, body1, body2);
    response.send(html);
    })
  })
}
exports.solution_process = function(request, response) { 
  // 로그인 안되어있으면 로그인 페이지로 이동시킴
  if (!authCheck.isOwner(request, response)) {  
    const alertScript = "<script>alert('로그인이 필요합니다'); window.location.href = '/';</script>";
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(alertScript);
    return false;
  }
    var post = request.body; // post 데이터 파싱

    // 풀이 데이터를 데이터베이스에 저장
    db.query(`
    INSERT INTO solution (question_id, user_id, description, created) VALUES (?, ?, ?, NOW());
  `,
  [post.solution_question_id, post.solution_user_nickname, post.solution_description],
  function(error, result) {
    if (error) {
      console.error(error);
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.end('Internal Server Error');
      return;
    }
    response.writeHead(302, {Location: `/`});
    response.end();
  });
}
exports.create = function(request, response){
  db.query('SELECT category FROM category', function(err, categories) {
    if (err) {
        throw err;
    }
    var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                fs.readFileSync('./lib/style/create.css', 'utf8');
    var title = "-문제 만들기";
    var header = `
      <li><a href="/create">문제만들기</a></li>
      <li><a href="/ranking">랭킹</a></li>
      ${authCheck.statusUI(request, response)}
    `; 
    var body0 = `
      <form action="/create_process" method="post" enctype="multipart/form-data">                  

        <label for="question_user_id"></label>
        <input type="hidden" id="question_user_id" name="question_user_id" placeholder="question_user_id" value="${request.session.nickname}"required />

        <label for="question_title">제목:</label>
        <input type="text" id="question_title" name="question_title" placeholder="question_title"required />

        <label for="question_description">내용:</label>
        <textarea id="question_description" name="question_description" rows="5" placeholder="question_description" required></textarea>

        <label for="question_image">첨부 파일:</label>
        <input type="file" id="question_image" name="question_image" accept=".pdf,.jpg,.png" />

        <label for="question_answer">정답:</label>
        <input type="text" id="question_answer" name="question_answer" placeholder="question_answer" required />

        <label for="question_category">카테고리:</label>
        <select id="question_category" name="question_category" required>
          <option value="">카테고리 선택</option>
          ${categories.map(category => `<option value="${category.category}">${category.category}</option>`).join('')}
        </select>

        <ul id="tag-list"></ul>

        <button type="submit" value="Submit">확인</button>
    </form>
    <script src="/lib/ckeditor/ckeditor.js"></script>
    <script>
    CKEDITOR.replace( 'question_description' );
    </script>
    `;
    var list = ``;
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(style, title, header, body0, list, body1, body2);
    response.send(html);
  })
}
exports.create_process = function(request, response){
  // 로그인 안되어있으면 로그인 페이지로 이동시킴
  if (!authCheck.isOwner(request, response)) {  
    const alertScript = "<script>alert('로그인이 필요합니다'); window.location.href = '/';</script>";
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(alertScript);
    return false;
  }
  const post = request.body;
  upload.single('question_image')(request, response, function (err) {
    // 프로필 이미지 업로드 체크
  const imagePathInDB = request.file ? request.file.filename : ''; 
  if (!request.file) {
    // 이미지가 선택되지 않은 경우 처리
    const alertScript = "<script>alert('프로필 사진이 필요합니다.'); window.location.href = '/';</script>";
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(alertScript);
    return false;
  }

  db.query(`
    INSERT INTO question (user_id, title, description, image, answer, category, created)
    VALUES (?, ?, ?, ?, ?, ?, NOW());
  `, 
  [post.question_user_id, post.question_title, post.question_description, imagePathInDB, post.question_answer, post.question_category, post.question_created], 
  function(error, result){
    if(error){
      console.error('Database Error:', error);
      response.status(500).send('데이터베이스 오류');
      return;
    }
    response.writeHead(302, { Location: `/?id=${result.insertId}` });
    response.end();
    });
  });
}
exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM question', function(error, questions){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM question WHERE id=?`,[queryData.id], function(error2, question){
          if(error2){
            throw error2;
          }
          db.query('SELECT category FROM category', function(err, categories) {
            if (err) {
                throw err;
            }
          var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                      fs.readFileSync('./lib/style/update.css', 'utf8');
          var header = `
            <li><a href="/create">문제만들기</a></li>
            <li><a href=/ranking">랭킹</a></li>
            ${authCheck.statusUI(request, response)}
          `; 
          var title = "-문제 수정";
          var body0 = ``;
          var list = ``;
          var body1 = `
            <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${question[0].id}">
            <label for="question_title">제목:</label>
            <input type="text" id="question_title" name="question_title" placeholder="question_title" value="${question[0].title}"required />
            <p>
            <label for="question_description">내용:</label>
            <textarea id="question_description" name="question_description" rows="5" placeholder="question_description" value="${question[0].description}"required></textarea>
            </p>
            <p>
            <label for="question_answer">정답:</label>
            <input type="text" id="question_answer" name="question_answer" placeholder="question_answer" value="${question[0].answer}"required />
            </p>
            <p>
            <label for="question_category">카테고리:</label>
            <select id="question_category" name="question_category" required>
              <option value="">카테고리 선택</option>
              ${categories.map(category => `<option value="${category.category}">${category.category}</option>`).join('')}
            </select>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            <script src="/lib/ckeditor/ckeditor.js"></script>
            <script>
            CKEDITOR.replace( 'question_description' );
            </script>
          `;
          var body2 = ``;
          var html = template.HTML(style, title, header, body0, list, body1, body2);
          response.send(html);
      })
    });
  });
}
exports.update_process = function(request, response) {
  db.query(`SELECT * FROM question WHERE id=?`, [request.body.id], function(error2, question) {
    if (error2) {
      throw error2;
    }

    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    if (`${request.session.nickname}` === `${question[0].user_id}`) {
      if (!authCheck.isOwner(request, response)) {
        const alertScript = "<script>alert('로그인이 필요합니다'); window.location.href = '/';</script>";
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(alertScript);
        return false;
      }
      
      // post 변수 정의
      var post = request.body;

      // question 업데이트
      db.query('UPDATE question SET title=?, description=?,  answer=?, category=? WHERE id=?', 
        [post.question_title, post.question_description, post.question_answer, post.question_category, post.id], 
        function(error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, { Location: `/?id=${post.id}` });
          response.end();
        }
      );
    } else {
      const alertScript = "<script>alert('글쓴이만 수정할 수 있습니다.'); window.location.href = '/';</script>";
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
      return false;
    }
  });
}
exports.delete_process = function(request, response){
  db.query(`SELECT * FROM question WHERE id=?`, [request.body.id], function(error2, question) {
    if (error2) {
      throw error2;
    }

    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    if (`${request.session.nickname}` === `${question[0].user_id}`) {
      if (!authCheck.isOwner(request, response)) {
        const alertScript = "<script>alert('로그인이 필요합니다.'); window.location.href = '/';</script>";
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(alertScript);
        return false;
      }
    var post = request.body;
      db.query('DELETE FROM question WHERE id = ?', [post.id], function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    } else {
      const alertScript = "<script>alert('글쓴이만 삭제할 수 있습니다.'); window.location.href = '/';</script>";
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
      return false;
    }
  });
}
exports.ranking = function(request, response){
  db.query(`SELECT * FROM user ORDER BY correct_answers DESC`, function(err, users){
    const tableRows = generateTableRows(users);

    function generateTableRows(users) {
      // 사용자 목록(users)을 순회하며 각 사용자에 대한 HTML을 생성
      const rows = users.map((user, index) => `
          <tr>
              <td>${index + 1}</td>
              <td><a href="/user/${encodeURIComponent(user.user_id)}">${user.user_id}</a></td>
              <td>${user.correct_answers}</td>
              <td>${user.created_questions}</td>
          </tr>
      `).join('');
  
      return rows;
    }
    var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                fs.readFileSync('./lib/style/ranking.css', 'utf8');
    var header = `
      <li><a href="/create">문제만들기</a></li>
      <li><a href="/ranking">랭킹</a></li>
      ${authCheck.statusUI(request, response)}
    `; 
    var title = '-랭킹';
    var body0 = `
            <h1><a href="/ranking">사용자 랭킹</a></h1>
            <div class="container">
                <table>
                    <tr>
                        <th>순위</th>
                        <th>아이디</th>
                        <th>맞춘 문제 수</th>
                        <th>만든 문제수</th>
                    </tr>
                    ${tableRows}
                </table>
            </div>
    `;
    var list = '';
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(style, title, header, body0, list, body1, body2);    
    response.send(html);
  })
}
exports.login = function(request, response){
    var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                fs.readFileSync('./lib/style/login.css', 'utf8');
    var header = `
      <li><a href="/create">문제만들기</a></li>
      <li><a href="/ranking">랭킹</a></li>
      ${authCheck.statusUI(request, response)}
    `;             
    var title = '-로그인';
    var body0 = `
      <a href="login"><h2>로그인</h2></a>
      <form action="/login_process" method="post">
      <p><input class="login" type="text" name="username" placeholder="아이디"></p>
      <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>
      <p><input class="btn" type="submit" value="로그인"></p>
      </form>            
      <p><a href="/forgot">아이디 찾기</a>  |  <a href="/forgot/password">비밀번호 찾기</a></p>  
      <p><a href="/register">회원가입</a></p> 
    `;
    var list = ``;
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(style, title, header, body0, list, body1, body2);     
    response.send(html);
}
exports.forgot = function(request, response){
  var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
              fs.readFileSync('./lib/style/login.css', 'utf8');
  var header = `
    <li><a href="/create">문제만들기</a></li>
    <li><a href="/ranking">랭킹</a></li>
    ${authCheck.statusUI(request, response)}
  `;             
  var title = '-아이디 찾기';
  var body0 = `
    <a href="login"><h2>로그인</h2></a>
    <form action="/forgot_process" method="post">
    <p><input class="login" type="text" name="nickname" placeholder="닉네임"></p>
    <p><input class="login" type="date" name="birth" placeholder="생년월일"></p>
    <p><input class="btn" type="submit" value="아이디 찾기"></p>
    </form>            
    <p><a href="/forgot/password">비밀번호 찾기</a></p>  
    <p><a href="/register">회원가입</a></p> 
  `;
  var list = ``;
  var body1 = ``;
  var body2 = ``;
  var html = template.HTML(style, title, header, body0, list, body1, body2);     
  response.send(html);
}
exports.forgot_process = function(request, response){
  const nickname = request.body.nickname;
  const birth = request.body.birth;

  // user 테이블에서 닉네임과 생일을 기반으로 user_id 조회
  db.query('SELECT user_id FROM user WHERE nickname = ? AND birth = ?', [nickname, birth], function(error, user) {
    if (error) {
      throw error;
    }

    if (user.length > 0) {
      const userId = user[0].user_id;

      const alertScript = `<script>alert('찾은 아이디: ${userId}'); window.location.href = '/';</script>`;
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
    } else {
      // 사용자가 존재하지 않을 경우에 대한 처리
      const alertScript = `<script>alert('해당 아이디가 없습니다.'); window.location.href = '/';</script>`;
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
    }
  });
}
exports.forgotpassword = function(request, response){
  var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
              fs.readFileSync('./lib/style/login.css', 'utf8');
  var header = `
    <li><a href="/create">문제만들기</a></li>
    <li><a href="/ranking">랭킹</a></li>
    ${authCheck.statusUI(request, response)}
  `;             
  var title = '-비밀번호 찾기';
  var body0 = `
    <a href="login"><h2>로그인</h2></a>
    <form action="/forgot/password_process" method="post">
    <p><input class="login" type="text" name="user_id" placeholder="아이디"></p>
    <p>
        <label for="security_question">비밀번호 찾는 질문</label>
        <select id="security_question" name="q_pw" required>
            <option value="" disabled selected>질문을 선택하세요</option>
            <option value="email">이메일 주소는?</option>
            <option value="treasure">나의 보물 1호는?</option>
            <option value="color">좋아하는 색깔은?</option>
            <option value="food">좋아하는 음식은?</option>
            <option value="memory_place">기억에 남는 추억의 장소는?</option>
        </select>
      </p>
      <p><input class="login" type="text" name="a_pw" placeholder="비밀번호 찾는 대답"></p>
      <p><input class="btn" type="submit" value="비밀번호 찾기"></p>
    </form>
    <p><a href="/forgot">야이디 찾기</a></p>  
    <p><a href="/register">회원가입</a></p> 
  `;
  var list = ``;
  var body1 = ``;
  var body2 = ``;
  var html = template.HTML(style, title, header, body0, list, body1, body2);     
  response.send(html);
}
exports.forgotpassword_process = function(request, response){
  const user_id = request.body.user_id;
  const q_pw = request.body.q_pw;
  const a_pw = request.body.a_pw;

  // user 테이블에서 닉네임과 생일을 기반으로 user_id 조회
  db.query('SELECT password FROM user WHERE user_id = ? AND q_pw = ? AND a_pw = ?', [user_id, q_pw, a_pw], function(error, user) {
    if (error) {
      throw error;
    }

    if (user.length > 0) {
      const userPassword = user[0].password;

      const alertScript = `<script>alert('찾은 비밀번호: ${userPassword}'); window.location.href = '/';</script>`;
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
    } else {
      // 사용자가 존재하지 않을 경우에 대한 처리
      const alertScript = `<script>alert('해당 아이디가 없습니다.'); window.location.href = '/';</script>`;
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
    }
  });
}
exports.login_process = function(request, response){
  var username = request.body.username;
    var password = request.body.pwd;
    if (username && password) {             // id와 pw가 입력되었는지 확인
        
        db.query('SELECT * FROM user WHERE user_id = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                request.session.is_logined = true;      // 세션 정보 갱신
                request.session.nickname = username;
                request.session.save(function () {
                    response.redirect(`/`);
                });
            } else {              
                response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                document.location.href="/login";</script>`);    
            }            
        });

    } else {
        response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="/auth/login";</script>`);    
    }
}
exports.logout = function(request, response){
  request.session.destroy(function (err) {
    response.redirect('/');
});
}
exports.register = function(request, response){
  var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
              fs.readFileSync('./lib/style/register.css', 'utf8');
  var header = `
    <li><a href="/create">문제만들기</a></li>
    <li><a href="/ranking">랭킹</a></li>
    ${authCheck.statusUI(request, response)}
  `; 
  var title = '-회원가입';
  var body0 = `
    <h2><a href="register">회원가입</a></h2>
    <form action="/register_process" method="post" enctype="multipart/form-data">
    <div>
        <h3 class="join_title">
            <label for="profile-image">프로필 이미지 업로드</label>
        </h3>
        <span class="box int_name">
            <!-- 기본 이미지 -->
            <img id="profile-preview" src="https://picpac.kr/common/img/default_profile.png" alt="프로필 이미지" width="100">
            
            <!-- 이미지 업로드 버튼 -->
            <label for="question_image">첨부 파일:</label>
            <input type="file" id="profile-image" name="profile-image" accept=".pdf,.jpg,.png" />
        </span>
        <span class="error_next_box"></span>
    </div>
    <p><input class="login" type="text" name="user_id" placeholder="아이디"></p>
    <p><input class="login" type="password" name="password" placeholder="비밀번호"></p>    
    <p><input class="login" type="password" name="password1" placeholder="비밀번호 재확인"></p>
    <p><input class="login" type="text" name="nickname" placeholder="닉네임"></p>
    <p>
        <label for="birth">생년월일</label>
        <input class="login" type="date" name="birth" id="birth" placeholder="YYYY-MM-DD">
    </p>
    <p>
        <label for="security_question">비밀번호 찾기 질문</label>
        <select id="security_question" name="q_pw" required>
            <option value="" disabled selected>질문을 선택하세요</option>
            <option value="email">이메일 주소는?</option>
            <option value="treasure">나의 보물 1호는?</option>
            <option value="color">좋아하는 색깔은?</option>
            <option value="food">좋아하는 음식은?</option>
            <option value="memory_place">기억에 남는 추억의 장소는?</option>
        </select>
    </p>
    <p>
        <label for="answer">질문에 대한 답변</label>
        <input class="login" type="text" name="a_pw" id="answer" required>
    </p>

    <p><input class="btn" type="submit" value="가입하기"></p>
    </form>            
    <p><a href="/login">로그인화면으로 돌아가기</a></p>
  `;
  var list = ``;
  var body1 = ``;
  var body2 = ``;
  var html = template.HTML(style, title, header, body0, list, body1, body2);       
  response.send(html);
}
exports.register_process = function(request, response){
  var user_id = request.body.user_id;
  var password = request.body.password;    
  var password1 = request.body.password1;
  var nickname = request.body.nickname;
  //var image = request.body.profile-image;
  var birth = request.body.birth; 
  var q_pw = request.body.q_pw; 
  var a_pw = request.body.a_pw; 
  
  upload.single('profile-image')(request, response, function (err) {
    // 프로필 이미지 업로드 체크
  const profileImagePathInDB = request.file ? request.file.filename : ''; 
  


  if (user_id && password && password1) {
      
      db.query('SELECT * FROM user WHERE user_id = ?', [user_id], function(error, results, fields) { 
          if (error) throw error;
          if (results.length <= 0 && password == password1) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
            if (!request.file) {
              // 이미지가 선택되지 않은 경우 처리
              const alertScript = "<script>alert('프로필 사진이 필요합니다.'); window.location.href = '/';</script>";
              response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
              response.end(alertScript);
              return false;
            }
              db.query(
                  'INSERT INTO user (user_id, password, nickname, image, birth, q_pw, a_pw, created) VALUES(?,?,?,?,?,?,?,NOW())', 
                  [user_id, password, nickname, profileImagePathInDB, birth, q_pw, a_pw],
                  function (error, data) {
                      if (error) throw error;
                      response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                      document.location.href="/";</script>`);
                  }
              );
          } else if (password != password1) {                     
            // 비밀번호가 올바르게 입력되지 않은 경우 
            const alertScript = `<script>alert('입력된 비밀번호가 서로 다릅니다.'); window.location.href = '/';</script>`;
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            response.end(alertScript);  
          }
          else {                                                 
            // DB에 같은 이름의 회원아이디가 있는 경우
            const alertScript = `<script>alert('이미 존재하는 아이디 입니다.'); window.location.href = '/';</script>`;
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            response.end(alertScript);   
          }            
      });

  } else {        
    // 입력되지 않은 정보가 있는 경우
      const alertScript = `<script>alert('입력되지 않은 정보가 있습니다.'); window.location.href = '/';</script>`;
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
  }
  });
}
exports.user = function(request, response){ 
  const userId = request.params.user_id;
  db.query('SELECT * FROM user WHERE user_id = ?', [userId], function(error, user) {
    if (error) {
      throw error;
    }

    // user가 정의되지 않았거나 길이가 0인 경우를 처리
    if (!user || user.length === 0) {
      const alertScript = "<script>alert('사용자를 찾을 수 없습니다.'); window.location.href = '/';</script>";
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
      return;
    }

    var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                fs.readFileSync('./lib/style/mypage.css', 'utf8'); 
    var header = `
      <li><a href="/create">문제만들기</a></li>
      <li><a href="/ranking">랭킹</a></li>
      ${authCheck.statusUI(request, response)}
    `; 
    var title = `-${userId}의 프로필`;

    // solution 테이블에서 해당 user_id로 푼 문제들을 조회
    db.query('SELECT * FROM solution WHERE user_id = ?', [userId], function(error, solutions) {
      if (error) {
        throw error;
      }

      var solvedProblemLinks = '';
      // 각각의 풀이에 대한 HTML을 생성
      for (var i = 0; i < solutions.length; i++) {
        // 여기에서 각 풀이에 대한 HTML을 생성하여 solvedProblemLinks에 추가
        solvedProblemLinks += `<li><a href="/?id=${solutions[i].question_id}">${solutions[i].question_id}번 문제</a></li>`;
      }

      // solution 테이블에서 해당 user_id로 만든 문제들을 조회
      db.query('SELECT * FROM  question WHERE user_id = ?', [userId], function(error, questions) {
        if (error) {
          throw error;
        }

        var createdProblemLinks = '';
        // 각각의 풀이에 대한 HTML을 생성
        for (var i = 0; i < questions.length; i++) {
          // 여기에서 각 풀이에 대한 HTML을 생성하여 createdProblemLinks에 추가
          createdProblemLinks += `<li><a href="/?id=${questions[i].id}">${questions[i].id}번 문제</a></li>`;
        }

        var body0 = `
        <div class="container">
          <div class="profile-container">
            <div class="profile-box">
            <img class="profile-image" src="/uploads/${user[0].image}" alt="프로필 사진"></img>
              <div class="profile-info">
                  <h2>아이디 : ${user[0].user_id}</h2>
                  <h2>닉네임 : ${user[0].nickname}</h2>
              </div>
            </div>

            <div class="profile-buttons">
                  <form action="mypage_delete" method="post">
                    <input type="hidden" name="id" value="${userId}">
                    <button type="submit">회원탈퇴</button>
                  </form> 
            </div>

          </div>

          <div class="divider"></div>

          <div class="problems-section">

            <div class="problem-type-box">맞은 문제</div>
            <div class="problems-list">
              <div class="problem-box">
                <ul>
                  ${solvedProblemLinks}
                </ul>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="problems-section">

            <div class="problem-type-box">내가 만든 문제</div>
            <div class="problems-list">
              <div class="problem-box">
                <ul>
                  ${createdProblemLinks}
                </ul>
              </div>
            </div>
          </div>

          <div class="divider"></div>
        </div>
        `;
        var list = ``;
        var body1 = ``;
        var body2 = ``;
        var html = template.HTML(style, title, header, body0, list, body1, body2);
        response.send(html);
      });
    });
  });
}
exports.mypage = function(request, response){ 
  db.query('SELECT * FROM user WHERE user_id = ?', `${request.session.nickname}`, function(error, user) {
    if (error) {
      throw error;
    }

    // user가 정의되지 않았거나 길이가 0인 경우를 처리
    if (!user || user.length === 0) {
      const alertScript = "<script>alert('사용자를 찾을 수 없습니다.'); window.location.href = '/';</script>";
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(alertScript);
      return;
    }

    var style = fs.readFileSync('./lib/style/main.css', 'utf8') +
                fs.readFileSync('./lib/style/mypage.css', 'utf8'); 
    var header = `
      <li><a href="/create">문제만들기</a></li>
      <li><a href="/ranking">랭킹</a></li>
      ${authCheck.statusUI(request, response)}
    `; 
    var title = `-${request.session.nickname}의 프로필`;

    // solution 테이블에서 해당 user_id로 푼 문제들을 조회
    db.query('SELECT * FROM solution WHERE user_id = ?', `${request.session.nickname}`, function(error, solutions) {
      if (error) {
        throw error;
      }

      var solvedProblemLinks = '';
      // 각각의 풀이에 대한 HTML을 생성
      for (var i = 0; i < solutions.length; i++) {
        // 여기에서 각 풀이에 대한 HTML을 생성하여 solvedProblemLinks에 추가
        solvedProblemLinks += `<li><a href="/?id=${solutions[i].question_id}">${solutions[i].question_id}번 문제</a></li>`;
      }

      // solution 테이블에서 해당 user_id로 만든 문제들을 조회
      db.query('SELECT * FROM  question WHERE user_id = ?', `${request.session.nickname}`, function(error, questions) {
        if (error) {
          throw error;
        }

        var createdProblemLinks = '';
        // 각각의 풀이에 대한 HTML을 생성
        for (var i = 0; i < questions.length; i++) {
          // 여기에서 각 풀이에 대한 HTML을 생성하여 createdProblemLinks에 추가
          createdProblemLinks += `<li><a href="/?id=${questions[i].id}">${questions[i].id}번 문제</a></li>`;
        }

        var body0 = `
        <div class="container">
          <div class="profile-container">
            <div class="profile-box">
            <img class="profile-image" src="/uploads/${user[0].image}" alt="프로필 사진"></img>
              <div class="profile-info">
                  <h2>아이디 : ${user[0].user_id}</h2>
                  <h2>닉네임 : ${user[0].nickname}</h2>
              </div>
            </div>

            <div class="profile-buttons">
                  <form action="mypage_delete" method="post">
                    <input type="hidden" name="id" value="${request.session.nickname}">
                    <button type="submit">회원탈퇴</button>
                  </form> 
            </div>

          </div>

          <div class="divider"></div>

          <div class="problems-section">

            <div class="problem-type-box">맞은 문제</div>
            <div class="problems-list">
              <div class="problem-box">
                <ul>
                  ${solvedProblemLinks}
                </ul>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="problems-section">

            <div class="problem-type-box">내가 만든 문제</div>
            <div class="problems-list">
              <div class="problem-box">
                <ul>
                  ${createdProblemLinks}
                </ul>
              </div>
            </div>
          </div>

          <div class="divider"></div>
        </div>
        `;
        var list = ``;
        var body1 = ``;
        var body2 = ``;
        var html = template.HTML(style, title, header, body0, list, body1, body2);
        response.send(html);
      });
    });
  });
}
exports.mypage_delete = function(request, response){
  const userId = request.body.id;

  // 로그인 안되어있으면 로그인 페이지로 이동시킴
  if (!authCheck.isOwner(request, response)) {
    const alertScript = "<script>alert('로그인이 필요합니다'); window.location.href = '/';</script>";
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(alertScript);
    return false;
  }

  db.query('DELETE FROM user WHERE user_id = ?', [userId], function(error, result){
    if (error){
      throw error;
    }
    response.writeHead(302, {Location: `/`});
    response.end();
  });
}