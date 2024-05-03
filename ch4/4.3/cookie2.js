const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

// req.headers.cookie의 초기 문자열을 객체로 변환시켜주는 함수
const parseCookie = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

http.createServer(async (req, res) => {
  const cookies = parseCookie(req.headers.cookie); // { mycookie : 'test' }
  // 주소가 /login으로 시작하는 경우
  if(req.url.startsWith('/login')){
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    // 쿠키 유효 시간을 현재시간 + 5분으로 설정
    expires.setMinutes(expires.getMinutes() + 5);
    res.writeHead(302, { // 302 : 리다이렉션
      Location : '/' ,
      'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; path=/`, // Expires : 쿠키 만료기간(안 넣을 경우 세션쿠키(브라우저 종료 시 사라지는 쿠키)가 됨) 
    });
    res.end();
    // name 이라는 쿠기가 있는 경우 (쿠키가 있냐 없냐에 따라 분기 처리가 가능)
  } else if (cookies.name){
    res.writeHead(200, { 'Content-Type' : 'text/plain; charset=utf-8' });
    res.end(`${cookies.name}님 안녕하세요`);
  } else {
    try {
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type' : 'text/html; charset=utf-8' });
      res.end(err.message);
    }
  }
})
  .listen(8084, () => {
    console.log('8084번 포트에서 서버 대기 중입니다!');
  });