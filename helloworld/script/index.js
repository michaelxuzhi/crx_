let btn_l = document.querySelector('.btn_l');
let btn_r = document.querySelector('.btn_r');
btn_l.addEventListener('click', this.clickLeft);
btn_r.addEventListener('click', this.clickRight);

function prot_$(cmd) {
  this[`${cmd}`]();
}

function clickLeft(event) {
  //   console.log('点击了左边的按钮', event.target.innerText);
  prot_$(event.target.innerText);
}
function clickRight() {
  //   console.log('点击了右边的按钮', event.target.innerText);
  prot_$(event.target.innerText);
}

function full() {
  //   console.log('full被触发');
  //   window.alert('full被触发');
  //   window.postMessage(val, location.origin);
  let color = 'red';
  let script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // 向页面注入JavaScript代码.
  chrome.tabs.executeScript({
    code: script,
  });
  console.log(color);
}
function get() {
  console.log('get被触发');
}
