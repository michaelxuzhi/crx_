/*
 * 获取json格式的at数据
 * 20211221
 */
// 全局获取元素方法，get方法比query的性能好
function $(ele_ID) {
  let first_char = ele_ID[0];
  let real_str = ele_ID.slice(1);
  switch (first_char) {
    case '#':
      //   console.log(real_str);
      return document.getElementById(`${real_str}`);
    case '.':
      return document.getElementsByClassName(`${real_str}`);
    default:
      return document.getElementsByTagName(`${ele_ID}`);
  }
}

// 全局声明区域
let at_list_ul = $('#at_list_ul'); // content内容的at_list_ul，at列表
let search_input = $('#search_input'); // 搜索输入框
let search_btn = $('#search_btn'); // 重置按钮
let at_num = $('#at_num'); // 指令数量
let at_name = $('#at_name'); // 指令名称
let at_desc = $('#at_desc'); // 指令描述
// 指令用法
let at_short = $('#at_short');
let at_params_short = $('#at_params_short');
let at_short_common = $('#at_short_common');
let at_params_common = $('#at_params_common');
let at_long = $('#at_long');
let at_params_long = $('#at_params_long');
let at_child_params_list_ul = $('#at_child_params_list_ul');
// copy按钮
let at_btn_copy_short = $('#btn_copy_short');
let at_btn_copy_long = $('#btn_copy_long');
// reset按钮
let reset_btn = $('#btn_reset');
// 发送请求，获取json格式数据
function requestJSON() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    // console.log(xhr.readyState);
    if (xhr.readyState === 4 && this.status === 200) {
      let atObj = JSON.parse(xhr.responseText);
      //   return atObj;
      getAtNum(atObj);
      renderAtList(atObj);
    } else {
      console.log('请求失败');
    }
  };
  // xhr.open('GET', './scripts/data/data_.json', true);
  xhr.open('GET', '../data/data_.json', true);
  xhr.send();
}
// 获取指令数量
function getAtNum(atObj) {
  let atNum = 0;
  for (const key in atObj) {
    if (Object.hasOwnProperty.call(atObj, key)) {
      let detail = atObj[key]['detail'];
      atNum += Object.keys(detail).length;
    }
  }
  //   return atNum;
  renderAtNum(atNum);
}

// 指令数量渲染
function renderAtNum(num) {
  at_num.innerHTML = num;
}

// 指令列表渲染
function renderAtList(atObj) {
  Object.values(atObj).forEach(item => {
    Object.values(item.detail).forEach(ele => {
      at_list_ul.innerHTML += `<li class="list" data-name="${ele.name}" data-parentName="${item.parentName}" data-index="${item.parentName}${ele.name}${ele.desc}" style="visibility: visible;">${ele.name}</li>`;
    });
  });
  listenerAt(atObj);
}

// 指令处理函数，给指令的原型上附加属性
function listenerAt(atObj) {
  let at_li_list = $('.list');
  //   console.log(at_li_list);
  for (const item of at_li_list) {
    // 每个at指令携带信息
    let at_parentName = item.getAttribute('data-parentName');
    let at_name = item.getAttribute('data-name');
    let ctx = atObj[at_parentName]['detail'][at_name];
    item.ctx = ctx;
    item.addEventListener('click', renderAtInfo);
  }
}

// 指令信息渲染
function renderAtInfo(e) {
  let at_target = e.target.ctx;
  at_name.innerText = at_target.name;
  at_desc.innerText = at_target.desc;
  // 指令信息：父级模块名，指令名
  //   let atParentName = e.target.ctx.parentName; // 旧的，ctx中没有parentName
  let atParentName = e.target.getAttribute('data-parentName'); // 新的
  let atAt = e.target.ctx.name;
  resetParams();
  function _init() {
    // 渲染短指令
    // 如果不是at根目录下的，需要字符串拼接
    let atStr_short = atParentName !== 'at' ? `at.${atParentName}.${atAt}` : `at.${atAt}`;
    at_short.innerText = atStr_short;
    // 渲染短指令common
    let atStr_short_common =
      atParentName !== 'at'
        ? `at.ff('${atParentName}/${atAt}','参数')`
        : `at.ff('${atAt}','参数')`;
    at_short_common.innerText = atStr_short_common;
    // 渲染长指令
    let atStr_long =
      atParentName !== 'at'
        ? `['at','${atParentName}/${atAt}','参数']`
        : `['at','${atAt}','参数']`;
    at_long.innerText = atStr_long;
  }
  _init();
}

function eventListener() {
  search_btn.addEventListener('click', resetSearchInput);
  at_btn_copy_short.addEventListener('click', copyShort);
  //   at_btn_copy_long.addEventListener('click', copyLong);
  reset_btn.addEventListener('click', resetParams);
}

// 指令参数重置方法
function resetParams(e) {
  // 指令参数重置
  // 以通配符的方式，获取所有id以paramsInput为开头的input节点
  let params_inputs = document.querySelectorAll("input[id^='paramsInput']");
  if (params_inputs.length == 0) return;
  params_inputs.forEach(function(item) {
    // 将每个paramsInput的value清空，并重调用onInput方法，更新已经输入的指令参数
    item.value = '';
    item.oninput();
  });
  at_params_short.innerText = '(参数)';
  at_params_long.innerText = '(参数)';
  at_params_long.style.display = 'inline-block';
}

// 搜索功能全局添加style标签
function addGlobalStyle() {
  // 用来CSS控制的style插入;
  let atSearchItemStyle = document.getElementsByTagName('style');
  if (atSearchItemStyle.length === 0) {
    atSearchItemStyle = document.createElement('style');
    document.querySelector('head').appendChild(atSearchItemStyle);
  }
  return atSearchItemStyle;
}

// 搜索框筛选功能的实现
function searchAt(e) {
  let atSearchItemStyle = addGlobalStyle();
  search_input.addEventListener('input', function() {
    let val = this.value.trim().toLowerCase();
    if (val !== '') {
      atSearchItemStyle.innerHTML =
        '.list:not([data-index*="' + this.value + '"]) { display: none; } ';
    } else {
      atSearchItemStyle.innerHTML = '';
    }
  });
}

// 搜索区域重置按钮
function resetSearchInput(e) {
  let atSearchItemStyle = addGlobalStyle()[0];
  search_input.value = '';
  atSearchItemStyle.innerHTML = '';
  // 指令详情的重置
  // 先清空本身
  at_child_list_ul.innerHTML = '';
  // 清空子模块下内容：指令名称+指令描述+指令参数
  at_name.innerText = '{示例指令名称}';
  at_desc.innerText = '{示例指令描述}';
  at_child_params_list_ul.innerHTML = '';
  // 清空长、短指令内容
  at_short.innerText = 'at.{模块}{.指令名}';
  at_short_common.innerText = 'at.ff({模块}/{指令名},参数)';
  at_long.innerText = '{prot_$}';
  // 清空指令参数内容
  at_params_short.innerText = '(参数)';
  at_params_long.innerText = '(参数)';
  // 重置初始指令
  at_params_long.style.display = 'inline-block';
}

// 短指令复制
function copyShort(e) {
  let short_text = at_short.innerText;
  let short_text_param = at_params_short.innerText;
  let flag = copyText(short_text + short_text_param);
  alert(flag ? '复制成功' + '\n' + `${short_text + short_text_param}` : '复制失败');
}

// 兼容版本-copyToClipboard
function copyText(text) {
  // console.log(text);
  let textarea = document.createElement('textarea'); //创建input对象
  let current_focus = document.activeElement; //当前获得焦点的元素
  let tool_div = $('#at_copy_tool'); //将文本框插入到工具div之后
  tool_div.appendChild(textarea); //添加元素
  textarea.value = text;
  textarea.focus();
  if (textarea.setSelectionRange) {
    textarea.setSelectionRange(0, textarea.value.length); //获取光标起始位置到结束位置
  } else {
    textarea.select();
  }
  let flag;
  try {
    flag = document.execCommand('copy'); //执行复制
  } catch (error) {
    flag = false;
  }
  tool_div.removeChild(textarea); //删除元素
  current_focus.focus();
  return flag;
}

// 开始执行函数
window.onload = function() {
  console.log('window_onload');
  requestJSON();
  searchAt();
  eventListener();
};
