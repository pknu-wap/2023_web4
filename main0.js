const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const multer = require('multer');
// 이미지를 저장할 디렉터리 및 파일 이름  설정
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (request, file, cb) {
    cb(null, file.fieldname + '-' + Math.round(Math.random() * 1E9));
  },
});
const upload = multer({ storage: storage });
const path = require('path');
const FileStore = require('session-file-store')(session)
const url = require('url');
const main = require('./lib/main');
const db = require('./lib/db');

const app = express()
const port = 3000

app.use(session({
  secret: 'a',	// 원하는 문자 입력
  resave: false,
  saveUninitialized: true,
  store:new FileStore(),
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/lib', express.static(__dirname + '/lib'));
app.use('/ckeditor', express.static(__dirname + '/ckeditor'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



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

//카테고리로 필터링
app.post('/category_process', (request, response) => {
  main.category_process(request, response);
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
app.post('/create_process', upload.single('question_image'), (request, response) => {
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

//아이디 찾기
app.get('/forgot', (request, response) => {
  main.forgot(request, response);
});

//아이디 찾기 프로세스
app.post('/forgot_process', (request, response) => {
  main.forgot_process(request, response);
});

//비밀번호 찾기
app.get('/forgot/password', (request, response) => {
  main.forgotpassword(request, response);
});

//비밀번호 찾기 프로세스
app.post('/forgot/password_process', (request, response) => {
  main.forgotpassword_process(request, response);
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
app.post('/register_process', upload.single('profile-image'), (request, response) => { 
  main.register_process(request, response);
});

//유저 프로필
app.get('/user/:user_id', (request, response) => {
  main.user(request, response);
});

//마이페이지
app.get('/mypage', (request, response) => {
  main.mypage(request, response);
});

//회원 탈퇴
app.post('/mypage_delete', (request, response) => {
  main.mypage_delete(request, response);
});

app.use((request, response) => {
  response.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});