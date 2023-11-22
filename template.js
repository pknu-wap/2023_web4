var template = {
  HTML:function (title, body0, list, body1, body2) {
    return`
      <!DOCTYPE html>
      <html lang="ko">
      <head>    
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Logic Lab${title}</title>
        <style>
        
      
      a {
          text-decoration: underbar;
          color: #000;
      }
      ul{
          list-style: none;
      }
      
      .container {
          padding: 0 20px;
          margin: 0 auto;
          min-width: 1160px;
      }
      
      header {
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          box-sizing: border-box;
          border-bottom: 1px solid #ccc;
      }
      
      /*로고*/
      .header_logo {
          width: 20%;
          font-size: 30px;
          font-weight: 700;
          text-transform: uppercase;
      }
      
      /*네비게이션*/
      .header_menu {
          width: 60%;
          text-align: center;
      }
      
      .header_menu li {
          display: inline-block;
      }
      
      .header_menu li a { 
          padding: 13px 30px;
          margin: 0 5px;
          transition: background-color 0.3s;
      }
      
      .header_menu li:hover {
          background-color: #f1f1f1;
          border-radius: 5px;
      }
      
      
      
      /*셀렉터, 검색*/
      .select-form, .search-form {
          margin-top: 20px; /* 위 여백 설정 (원하는 여백 크기로 조정) */
          
          display: inline-block; /* 요소를 나란히 표시 */
          vertical-align: middle; /* 수직 가운데 정렬 */
          margin-right: 10px; /* 요소 간격 조절 */
      }
      
          
      /* 셀렉트 박스 스타일 */
      .select-form select {
          padding: 10px;
          border: 1px solid #ccc;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          font-size: 14px;
          width: 150px; /* 셀렉트 박스의 너비 조정 (원하는 크기로 설정) */
      }
      
      /* 검색 폼 스타일 */
      
      .search-form input[type="text"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 200px; /* 검색 입력 필드 너비 조정 (원하는 크기로 설정) */
          font-size: 14px;
      }
      .search-form button {
              padding: 10px 20px;
              background-color: rgb(0, 0, 0);
              color: #fff;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
      }
      
    

        </style>
      </head>
      <body>
          <div class="container">
              <header>
                <div class="header_logo">                       
                <h1><a href="/">Logiclab</a></h1>                     
                </div>

                <nav class="header_menu">
                    <ul>
                        <li><a href="/create">문제만들기</a></li>
                        <li><a href="ranking">랭킹</a></li>
                        <li><a href="login">로그인</a></li>
                        <li><a href="signup">회원가입</a></li>
                    </ul>           
                </nav>
              </header>                     
          </div>
        ${body0}
        ${list}
        ${body1}
        ${body2}
        <script>
          <!-- 처음 페이지의 a = 1; -->
          <!-- button을 (페이지를 넘어 가는 다음)숫자를 클릭했을 떄 list가 갱신되게 한다-->
          <!-- -->
        </script>
      </body>
      </html>
    `;
  }, list0:function(questions) { //topics
    var list = '<ul>';
    var i = 0;
    while(i < questions.length) {
      list += `<li><a href="/?id=${questions[i].id}">${questions[i].title}</a> ${questions[i].user_nickname}<p>${questions[i].description}</p></li>`;
      i += 1;
    }
    list += '</ul>';/*var list = `<ol><li><a href="/?id=!!!">!!!</a></li>; !!!자리에 database에서 가져온 data를 담는다 filelist에서 바꾸기*/
    return list;
  }
}
module.exports = template;