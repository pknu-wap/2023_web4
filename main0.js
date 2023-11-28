const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session)
const url = require('url');
const main = require('./lib/main');
const db = require('./lib/db');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'a',	// 원하는 문자 입력
  resave: false,
  saveUninitialized: true,
  store:new FileStore(),
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  const queryData = url.parse(request.url, true).query;
  //메인페이지
  if (queryData.id === undefined) {
    main.home(request, response);
  }
  //문제 보기 
  else {
    main.home1(request, response);
  }
});

//답 확인 프로세스
app.post('/checkAnswer', (request, response) => {
  main.checkAnswer(request, response);
});

//풀이쓰기
app.get('/solution', (request, response) => {
  main.solution(request, response);
});

//풀이쓰기 프로세스
app.post('/solution_process', (request, response) => {
  main.solution_process(request, response);
});

//글쓰기
app.get('/create', (request, response) => {
  main.create(request, response);
});

//글쓰기 프로세스
app.post('/create_process', (request, response) => {
  main.create_process(request, response);
});

//업데이트
app.get('/update', (request, response) => {
  main.update(request, response);
});

//업데이트 프로세스
app.post('/update_process', (request, response) => {
  main.update_process(request, response);
});

//삭제 프로세스
app.post('/delete_process', (request, response) => {
  main.delete_process(request, response);
});

//랭킹
app.get('/ranking', (request, response) => {
  main.ranking(request, response);
});

//로그인
app.get('/login', (request, response) => {
  main.login(request, response);
});

//로그인 프로세스
app.post('/login_process', (request, response) => {
  main.login_process(request, response);
});

// 로그아웃
app.get('/logout', (request, response) => {
  main.logout(request, response);
});

// 회원가입 화면
app.get('/register', (request, response) => {
  main.register(request, response);
});

// 회원가입 프로세스
app.post('/register_process', (request, response) => { 
  main.register_process(request, response);
});
//마이페이지
app.get('/mypage', (request, response) => {
  main.mypage(request, response);
});

app.use((request, response) => {
  response.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});