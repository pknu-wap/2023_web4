const url = require('url');
const qs = require('querystring'); // qs가 querystring이라는 node js가 갖고 있는 모듈을 가져온다
const template = require('./template');
const db = require('./db');
exports.home = function(request, response){11
    db.query(`SELECT * FROM question`, function(err, questions){
        var title = ``;
        var body0 = `
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
        `;
        var list = template.list0(questions); //topics에 들어있는 값은 객체로 들어있다
        var body1 = ``;
        var body2 = ``;
        var html = template.HTML(title, body0, list, body1, body2);
        //console.log(topics);
        response.writeHead(200);
        response.end(html);
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
        var title = "-" + question[0].title;
        var body0 = question[0].user_nickname + `<p></p>` + question[0].title + `<p></p>` + question[0].description + `<p></p>` + question[0].image + `<p></p>` + question[0].answer + `<p></p>` + question[0].category + `<p></p>` + question[0].created + `<p></p>` + question[0].solution;
        var list = ``; //template.list(topics); //topics에 들어있는 값은 객체로 들어있다
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
        var body2 = `
          <p>      
          <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>
          </p>
        `;
        var html = template.HTML(title, body0, list, body1, body2);
        response.writeHead(200);
        response.end(html);
        })
      })
}
exports.checkAnswer = function(request, response) {
  let body = '';

  // 데이터를 수동으로 읽음
  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', () => {
    // form-urlencoded 형식으로 된 데이터를 객체로 변환
    const formData = qs.parse(body);

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
  });
}
exports.solution = function(request, response){
  db.query(`SELECT * FROM question`, function(err, questions){
    var title = ``;
    var body0 = `body1`;
    var list = ``;
    var body1 = questions[0].title;
    var body2 = ``;
    var html = template.HTML(title, body0, list, body1, body2);
    response.writeHead(200);
    response.end(html);
  })
}
exports.create = function(request, response){//db.query(`SELECT * FROM topic`, function(err, topics){
    var title = "-문제 만들기";
    var body0 = `
    <h2><a href="/create">문제 만들기</a></h2>
    <form action="/create_process" method="post">                    

        <label for="question_user_nickname">닉네임:</label>
        <input type="text" id="question_user_nickname" name="question_user_nickname" placeholder="question_user_nickname"required />

        <label for="question_title">제목:</label>
        <input type="text" id="question_title" name="question_title" placeholder="question_title"required />

        <label for="question_description">내용:</label>
        <textarea id="question_description" name="question_description" rows="5" placeholder="question_description" required></textarea>

        <label for="question_image">첨부 파일:</label>
        <input type="file" id="question_image" name="question_image" accept=".pdf,.jpg,.png" />

        <label for="question_answer">정답:</label>
        <input type="text" id="question_answer" name="question_answer" placeholder="question_answer" required />
        
        <label for="question_category">카테고리:</label>
        <input type="text" id="question_category" name="question_category" placeholder="question_category" required />

        <ul id="tag-list"></ul>

        <button type="submit" value="Submit">확인</button>
    </form>
    `;
    var list = ``;
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(title, body0, list, body1, body2);
    response.writeHead(200);
    response.end(html);
}
exports.create_process = function(request, response){
    let body = '';
  request.on('data', function (data) {
    body = body + data;
  });

  request.on('end', function(){
    var post = qs.parse(body);

    db.query(`
    INSERT INTO question (user_nickname, title, description, image, answer, category, created)
    VALUES (?, ?, ?, ?, ?, ?, NOW());
      `, //topic
      [post.question_user_nickname, post.question_title, post.question_description, post.question_image, post.question_answer, post.question_category, post.question_created], 
      function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${result.insertId}`}); //node js에 추가된 행에 대한 아이디 값으로 이동동
        response.end();
      }
    )
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
        <label for="question_image">첨부 파일:</label>
        <input type="file" id="question_image" name="question_image" accept=".pdf,.jpg,.png" value="${question[0].image}"/>
        </p>
        <p>
        <label for="question_answer">정답:</label>
        <input type="text" id="question_answer" name="question_answer" placeholder="question_answer" value="${question[0].answer}"required />
        </p>
        <p>
        <label for="question_category">카테고리:</label>
        <input type="text" id="question_category" name="question_category" placeholder="question_category" value="${question[0].category}"required />
        </p>
        <p>
          <input type="submit">
        </p>
        </form>
      `;
      var body2 = ``;
      var html = template.HTML(title, body0, list, body1, body2);
      response.writeHead(200);
      response.end(html);
      });
    });
}
exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data){
      body += data;
    }); //topic
    request.on('end', function(){
        var post = qs.parse(body);
        db.query('UPDATE question SET title=?, description=?, image=?, answer=?, category=? WHERE id=?', [post.question_title, post.question_description, post.question_image, post.question_answer, post.question_category, post.id], function(error, result){
          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();
        })
    });
}
exports.delete_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query('DELETE FROM question WHERE id = ?', [post.id], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        });
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
              <td><a href="/user/${encodeURIComponent(user.nickname)}">${user.nickname}</a></td>
              <td>${user.correct_answers}</td>
              <td>${user.correct_answers}</td>
          </tr>
      `).join('');
  
      return rows;
    }
      
        var title = '-랭킹';
        var body0 = `
        <!DOCTYPE html>
            <html>
            <head>
                <title>사용자 랭킹</title>
                <style>
                    body {
                        background-color: #f4f4f4;
                        font-family: 'Arial', sans-serif;
                        text-align: center;
                        margin: 0;
                        padding: 0;
                    }
    
                    h1 {
                        color: #333;
                        padding: 20px 0;
                        font-size: 32px;
                    }
    
                    .container {
                        width: 80%;
                        margin: 0 auto;
                    }
    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        background-color: #fff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                    }
    
                    th, td {
                        padding: 15px;
                        text-align: center;
                    }
    
                    th {
                        background-color: #333;
                        color: #fff;
                        font-weight: bold;
                    }
    
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
    
                    tr:hover {
                        background-color: #e0e0e0;
                    }
                    a {
                        text-decoration: none;
                        color: #333; /* 사용자 닉네임에 대한 링크 색상 */
                    }
                    
                    a:hover {
                        color: #ff6600; /* 사용자 닉네임에 대한 링크 호버 시 색상 */
                    }
                </style>
            </head>
            <body>
                <h1>사용자 랭킹</h1>
                <div class="container">
                    <table>
                        <tr>
                            <th>순위</th>
                            <th>닉네임</th>
                            <th>맞춘 문제 수</th>
                            <th>만든 문제수</th>
                        </tr>
                        ${tableRows}
                    </table>
                </div>
            </body>
            </html>
        `;
        var list = '';
        var body1 = ``;
        var body2 = ``;
        var html = template.HTML(title, body0, list, body1, body2);        
        response.writeHead(200);
        response.end(html);
      })
}
exports.login = function(request, response){
    var title = '-로그인';
    var body0 = `
      <header>
        <h2>Login</h2>
        <style>
        header{
          display:flex;
          justify-content: center;
      }
      form{
          padding:10px;
      }
      .input-box{
          position:relative;
          margin:10px 0;
      }
      .input-box > input{
          background:transparent;
          border:none;
          border-bottom: solid 1px #ccc;
          padding:20px 0px 5px 0px;
          font-size:14pt;
          width:100%;
      }
      input::placeholder{
          color:transparent;
      }
      input:placeholder-shown + label{
          color:#aaa;
          font-size:14pt;
          top:15px;

      }
      input:focus + label, label{
          color:#8aa1a1;
          font-size:10pt;
          pointer-events: none;
          position: absolute;
          left:0px;
          top:0px;
          transition: all 0.2s ease ;
          -webkit-transition: all 0.2s ease;
          -moz-transition: all 0.2s ease;
          -o-transition: all 0.2s ease;
      }

      input:focus, input:not(:placeholder-shown){
          border-bottom: solid 1px #8aa1a1;
          outline:none;
      }
      input[type=submit]{
          background-color: #000000;
          border:none;
          color:white;
          border-radius: 5px;
          width:100%;
          height:35px;
          font-size: 14pt;
          margin-top:100px;
      }
      #forgot{
          text-align: right;
          font-size:12pt;
          color:rgb(164, 164, 164);
          margin:10px 0px;
          display: inline-block; /* 요소를 가로로 정렬합니다. */
          margin-right: 20px; /* 각 요소 사이의 간격을 조절합니다. */
      }
        </style>
      </header>

      <form action="" method="POST">
        <div class="input-box">
            <input id="username" type="text" name="username" placeholder="아이디">
            <label for="username">아이디</label>
        </div>

        <div class="input-box">
            <input id="password" type="password" name="password" placeholder="비밀번호">
            <label for="password">비밀번호</label>
        </div>
        <div id="forgot">아이디 찾기</div>
        <div id="forgot">비밀번호 찾기</div>
        <div id="forgot">회원가입</div>
        <input type="submit" value="로그인">
      </form>
    `;
    var list = ``;
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(title, body0, list, body1, body2);        
    response.writeHead(200);
    response.end(html);
}
exports.signup = function(request, response){
    var title = '-회원가입';
    var body0 = `
      <!-- 프로필 이미지 -->
      <div>
        <h3 class="join_title">
            <label for="profile-image">프로필 이미지 업로드</label>
        </h3>
        
        <span class="box int_name">
            <!-- 기본 이미지 -->
            <img id="profile-preview" src="https://picpac.kr/common/img/default_profile.png" alt="프로필 이미지" width="100">
            
            <!-- 이미지 업로드 버튼 -->
            <input type="file" id="profile-image" accept="image/*">
        </span>
        <span class="error_next_box"></span>
      </div>   
                
      <!-- wrapper -->
      <div id="wrapper">

        <!-- content-->
        <div id="content">
          <!-- ID -->
          <div>
            <h3 class="join_title">
                <label for="id">아이디</label>
            </h3>
            
            <span class="box int_id">
              <input type="text" id="id" class="int" maxlength="20">
            </span>
                                
            <span class="error_next_box"></span>
          </div>

          <!-- PW1 -->
          <div>
              <h3 class="join_title"><label for="pswd1">비밀번호</label></h3>
              <span class="box int_pass">
                  <input type="text" id="pswd1" class="int" maxlength="20">                     
              </span>
              <span class="error_next_box"></span>
          </div>

          <!-- PW2 -->
          <div>
            <h3 class="join_title"><label for="pswd2">비밀번호 재확인</label></h3>
            <span class="box int_pass_check">
                <input type="text" id="pswd2" class="int" maxlength="20">                      
            </span>
            <span class="error_next_box"></span>
          </div>

          <!-- NAME -->
          <div>
            <h3 class="join_title"><label for="name">닉네임</label></h3>
            <span class="box int_name">
              <input type="text" id="name" class="int" maxlength="20">
            </span>
            <span class="error_next_box"></span>
          </div>

          <!-- BIRTH -->
          <div>
              <h3 class="join_title"><label for="yy">생년월일</label></h3>

              <div id="bir_wrap">
                  <!-- BIRTH_YY -->
                  <div id="bir_yy">
                      <span class="box">
                          <input type="text" id="yy" class="int" maxlength="4" placeholder="년(4자)">
                      </span>
                  </div>

                        <!-- BIRTH_MM -->
                        <div id="bir_mm">
                            <span class="box">
                                <select id="mm" class="sel">
                                    <option>월</option>
                                    <option value="01">1</option>
                                    <option value="02">2</option>
                                    <option value="03">3</option>
                                    <option value="04">4</option>
                                    <option value="05">5</option>
                                    <option value="06">6</option>
                                    <option value="07">7</option>
                                    <option value="08">8</option>
                                    <option value="09">9</option>                                    
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </span>
                        </div>

                        <!-- BIRTH_DD -->
                        <div id="bir_dd">
                            <span class="box">
                                <input type="text" id="dd" class="int" maxlength="2" placeholder="일">
                            </span>
                        </div>

                    </div>
                    <span class="error_next_box"></span>    
                </div>
                <div>
                    <h3 class="join_title"><label for="question">비밀번호 찾기 질문/</label></h3>
                        <span class="box">
                            <select id="q" class="sel">
                                <option>질문</option>
                                <option value="01">이메일 주소는?</option>
                                <option value="02">나의 보물 1호는?</option>
                                <option value="03">좋아하는 색깔은?</option>
                                <option value="04">좋아하는 음식은?</option>
                                <option value="05">기억에 남는 추억의 장소는?</option>

                            </select>
                        </span>
                </div>
                <div>
                    <h3 class="join_title"><label for="answer">답변</label></h3>
                    <span class="box int_name">
                        <input type="text" id="answer" class="int" maxlength="20">
                    </span>
                    <span class="error_next_box"></span>
                </div>
                <!-- JOIN BTN-->
                <div class="btn_area">
                    <button type="button" id="btnJoin">
                        <span>가입하기</span>
                    </button>
                </div>
            </div> 
        </div>
    `;
    var list = ``;
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(title, body0, list, body1, body2);        
    response.writeHead(200);
    response.end(html);
}