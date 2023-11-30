var template = {
    HTML:function (style, title, header, body0, list, body1, body2) {
      return`
        <!DOCTYPE html>
        <html lang="ko">
        <head>    
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Logic Lab${title}</title>
          <style>
          ${style}     
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
                        ${header}
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
    }, list0:function(questions) { 
      var list = '<div class="card-container">';
      var i = 0;
      while(i < questions.length) {
          list += `<div class="card">
              <a href="/?id=${questions[i].id}">
                <img src="/uploads/${questions[i].image}" alt="카드 ${i+1}">
                <h2>${questions[i].title}</h2>
                
              </a>
          </div>`;
          i += 1;
      }
      list += '</div>';
      return list;
    },
  }
  module.exports = template;