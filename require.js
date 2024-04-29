console.log('require가 가장 위에 오지 않아도 됩니다.');

module.exports = '저를 찾아보세요.';

require("./var"); // 굳이 require 값을 변수에 담지 않아도 됨. 실행만 하고 싶을 경우 이처럼 작성 가능!

console.log('require.cache입니다.');
console.log(require.cache);
console.log('require.main입니다.');
console.log(require.main === module);
console.log(require.main.filename);
