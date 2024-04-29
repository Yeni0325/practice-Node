import { odd, even } from './var.mjs';

function checkOddOrEven(num){
  if(num % 2){
    return odd;
  } else {
    return even;
  }
}

export default checkOddOrEven;