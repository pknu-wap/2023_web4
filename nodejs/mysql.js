const mysql = require('mysql2');

// MySQL 서버 연결 구성
const connection = mysql.createConnection({
  host: 'localhost', // MySQL 서버 호스트
  user: 'root',   // MySQL 사용자 이름
  password: 'woa*252', // MySQL 사용자 비밀번호
  database: 'opentutorials', // 사용할 데이터베이스 이름
});
//opentutorials에 있는 table수정하기(중요!!)

// MySQL 서버에 연결
connection.connect((err) => {
  if (err) {
    console.error('MySQL에 연결 중 오류 발생:', err);
    return;
  }
  console.log('MySQL에 연결되었습니다.');

  // 이곳에 데이터베이스 작업을 수행하는 코드를 작성할 수 있습니다. 
});

connection.query('SELECT * FROM topic', function (error, results) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

// 연결을 종료합니다.
connection.end((endErr) => {
    if (endErr) {
      console.error('MySQL 연결 종료 중 오류 발생:', endErr);
      return;
    }
    console.log('MySQL 연결이 종료되었습니다.');
  });