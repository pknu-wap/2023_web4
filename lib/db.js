const mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost', // MySQL 서버 호스트
    user: 'root',   // MySQL 사용자 이름
    password: 'woa*252', // MySQL 사용자 비밀번호
    database: 'logiclab', // 사용할 데이터베이스 이름
  }); //opentutorials에 있는 table수정하기 (중요!!)
  db.connect();
  module.exports = db;