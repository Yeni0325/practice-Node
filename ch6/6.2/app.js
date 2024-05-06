const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

const app = express();

app.set('port', process.env.PORT || 3000); // 서버에 변수를 심음(전역변수)
// port라는 변수를 3000으로 넣음

app.use(
  // 로깅 미들웨어
  morgan('dev'),
  // 정적 파일 제공
  express.static(path.join(__dirname, 'public')), // app.use('요청 경로', express.static('실제 경로'));
  // 쿠키 파서
  cookieParser('yeeunpassword'),
  // JSON 요청 본문 파싱
  express.json(),
  // URL 인코딩된 데이터 파싱
  express.urlencoded({ extended: true }),
  // 세션 관리
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: 'connect.sid',
  })
);

app.use((req, res, next) => {
  console.log('1 요청에 실행하고싶어요');
  res.locals.data = '데이터 넣기';
  next();
});

// app.use('/about', (req, res, next) => {
//   console.log('about에서만 실행되고 싶어요');
//   next();
// });

app.get('/', (req, res, next) => {
  console.log(res.locals.data); // 데이터 받기
  // 하나의 라우터안에 여러개의 send는 불가능! 에러발생 (1요청, 1응답)
  // res.send('Hello, Express');
  // res.json({ hello : 'yeeun' });

  /* 쿠키 미들웨어 start */
  // req.cookies;       // { mycooke : 'test' }
  // req.signedCookies; // 암호화된 쿠키
  // // 'set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; path=/`
  // res.cookie('name', encodeURIComponent(name), {
  //   expires: new Date(),
  //   httpOnly: true,
  //   path: '/',
  // });

  // // 쿠키 삭제
  // res.clearCookie('name', encodeURIComponent(name), {
  //   httpOnly: true,
  //   path: '/',
  // });
  /* 쿠키 미들웨어 end */

  res.sendFile(path.join(__dirname, '/index.html'));
  if (true) {
    next('route');
  } else {
    next();
  }
}, (req, res) => {
  console.log('실행되나요?');
});

app.get('/', (req, res) => {
  console.log('실행되지롱');
});

app.get('/category/Javascript', (req, res) => {
  res.send(`hello Javascript`);
});

app.get('/category/:name', (req, res) => {
  res.send(`hello ${req.params.name}`); // 와일드카드는 보통 다른 미들웨어, 라우터들보다 아래에 위치해야함
});

app.get('/about', (req, res) => {
  res.send('hello express');
});

app.use((req, res, next) => {
  // 404처리 미들웨어(라우터 모두 검색했는데 안떴으므로)
  res.status(200).send('404지롱');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(200).send('에러났지롱. 근데 안알려주지롱');
});

app.listen(app.get('port'), () => {
  console.log('익스프레스 서버 실행');
});
