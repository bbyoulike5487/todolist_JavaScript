url = `https://todoo.5xcamp.us`;

const logInPage = document.querySelector(".logIn");
const signUpPage = document.querySelector(".signUp");
const todoPage = document.querySelector(".todo");

const userName = document.querySelector(".userName");
let token = "";

//--登入介面--
const loginBtn = document.querySelector(".loginBtn");
const signupBtn = document.querySelector(".signupBtn");
const loginemail = document.querySelector("#loginemail");
const loginpassword = document.querySelector("#loginpassword");
const wrong_email = document.querySelector(".wrong_email");
const wrong_password = document.querySelector(".wrong_password");

//請求登入
function logIn(loginemail,loginpassword){
    axios.post(`${url}/users/sign_in`,{
        "user": {
            "email": loginemail,
            "password": loginpassword
          }
    })
    .then((res) => { //登入成功
        token = res.headers.authorization;
        logInPage.classList.add("none");
        todoPage.classList.remove("none");
        userName.innerHTML = `${res.data.nickname}的待辦`;
    })
    .catch((error) => { //登入失敗
        Swal.fire({
            icon: 'error',
            title: '登入失敗',
            text: '帳號或密碼有誤，請重新輸入！'
          })
          loginNullValue();
    })
}

//點擊登入
loginBtn.addEventListener("click",(e) => {
    e.preventDefault(); //防止往上跑
    if(loginemail.value === ''){ //信箱空值，出現提示文字
        wrong_email.classList.remove("none");
        return;
    }else{
        wrong_email.classList.add("none");
    }
    if(loginpassword.value === ''){ //密碼空值，出現提示文字
        wrong_password.classList.remove("none");
        return;
    }
    logIn(loginemail.value,loginpassword.value);
})

//點擊註冊
signupBtn.addEventListener("click",(e) => {
    logInPage.classList.add("none");
    signUpPage.classList.remove("none");
})

//登入介面文字框恢復空值
function loginNullValue(){
    loginemail.value = "";
    loginpassword.value = "";
}

//--登入介面--

//--註冊介面--
const signupBtn_2 = document.querySelector(".signupBtn_2");
const loginBtn_2 = document.querySelector(".loginBtn_2");
const wrong_singuppassword = document.querySelector(".wrong_singuppassword");
const wrong_password_again = document.querySelector(".wrong_password_again");
const singuppassword = document.querySelector("#singuppassword");
const singuppasswordAgain = document.querySelector("#singuppasswordAgain");

//請求註冊
function singUp(singupemail,nickname,singuppassword){
    axios.post(`${url}/users`,{
        "user": {
            "email": singupemail,
            "nickname": nickname,
            "password": singuppassword
        }
    })
    .then((res) => { //註冊成功
        Swal.fire({
            icon: 'success',
            title: '註冊成功',
            text: '請重新登入！'
          })
          nullValue();
    })
    .catch((error) => { //註冊失敗
        Swal.fire({
            icon: 'error',
            title: '註冊失敗',
            text: '帳號或密碼已被使用，請重新輸入！'
          })
          nullValue();
    })
}

//點擊註冊帳號
signupBtn_2.addEventListener("click",(e) => {
    e.preventDefault(); //防止往上跑
    if(singuppassword.value.length < 6){ //密碼不足6位數
        wrong_singuppassword.classList.remove("none");
        return;
    }else{
        wrong_singuppassword.classList.add("none");
    }
    if(singuppasswordAgain.value !== singuppassword.value){ //密碼雙重確認
        wrong_password_again.classList.remove("none");
        return;
    }else{
        wrong_password_again.classList.add("none");
    }
    singUp(singupemail.value,nickname.value,singuppassword.value);
})

//點擊重新登入
loginBtn_2.addEventListener("click",(e) => {
    e.preventDefault(); //防止往上跑
    signUpPage.classList.add("none");
    logInPage.classList.remove("none");
})

//註冊介面文字框恢復空值
function nullValue(){
    singupemail.value = "";
    nickname.value = "";
    singuppassword.value = "";
    singuppasswordAgain.value = "";
}

//--註冊介面--

//--todolist介面--
const signOut = document.querySelector(".signOut a");

//請求登出
function logOut(){
    axios.delete(`${url}/users/sign_out`,{
        headers:{
            "Authorization" : token
        }
    })
    .then((res) => {
        todoPage.classList.add("none");
        logInPage.classList.remove("none");
    })
    .catch((error) => {
        Swal.fire({
            icon: 'error',
            title: '登出失敗'
          })
    })
}

//點擊登出
signOut.addEventListener("click",(e) => {
    logOut();
})

//getTodo
function getTodo(){
    axios.get(`${url}/todos`,{
        headers:{
            "Authorization" : token
        }
    })
    .then((res) => {})
    .catch((error) => {console.log(error);})
}

//設一個空陣列
let data = [];

//預設tab在全部
let toggleTab = "all";

//新增待辦事項
const txt = document.querySelector(".txt");
const btn_add = document.querySelector(".btn_add");
const list = document.querySelector(".list");
const all = document.querySelector("#all");

btn_add.addEventListener("click",add);
function add(e){
  e.preventDefault(); //避免網頁往上跑
  if(txt.value.trim() == ""){ //空值跳出提示文字
    alert("請輸入待辦事項！！");
    txt.value = ""; //空值輸出後，清空文字欄位
    return; //切斷執行
  }
  let obj = {};
  obj.content = txt.value;
  data.push(obj);
  txt.value = ""; //文字輸出後，清空文字欄位
  //新增事項後，會跳回"全部"
  if(toggleTab == "work" || toggleTab == "done"){
    allLi.forEach(function(item){
    item.setAttribute("class","");
    });
    all.setAttribute("class","active");
    toggleTab = "all";
  };
  renderData();
}

//優化：Enter鍵新增
txt.addEventListener("keyup",function(e){
  if(e.key === "Enter"){
    add(e);
  }
})

//刪除待辦事項 & 點擊list除了刪除外的地方，checked交換
list.addEventListener("click",function(e){
  let num = e.target.getAttribute("data-num");
  if(e.target.nodeName == "A" && e.target.getAttribute("class") == "delete"){ //點擊刪除按鈕
    e.preventDefault(); //避免網頁往上跑
    data.splice(num,1);
  }else{ //點擊list刪除外的地方
    data[num].checked = !data[num].checked; //checked交換
  }
  renderData();
})

//清除已完成項目
const btn_clear = document.querySelector(".btn_clear");

btn_clear.addEventListener("click",function(e){
  e.preventDefault(); //避免網頁往上跑
  let newData = [];
  data.forEach(function(item){
    if(!item.checked){ //沒打勾的項目新增到newData
      newData.push(item);
    }
  });
  data = newData;
  renderData();
})

//tab切換
const tab = document.querySelector(".tab");
let allLi = document.querySelectorAll(".tab li");

tab.addEventListener("click",function(e){
  //每次點tab，清空li class 裡的 active
  allLi.forEach(function(item){
    item.setAttribute("class","");
  });
  //點tab其中一項，給它添加 active
  e.target.setAttribute("class","active");
  //更新tab
  toggleTab = e.target.getAttribute("data-tab");
  renderData();
})

//渲染
const card_list = document.querySelector(".card_list");

function renderData(){
const todoLength = document.querySelector(".todoLength");
//沒data，整塊card list隱藏
if(!data.length){
  card_list.style.display = "none";
  return; 
}else{
  card_list.style.display = "block";
}

let str = "";
let count = 0;
data.forEach(function(item,index){
  if(!item.checked){ //沒打勾
    count += 1;
    if(toggleTab == "all" || toggleTab == "work"){
      str += `<li>
            <label class="checkbox" for="">
            <input type="checkbox"  data-num="${index}"/>
            <span>${item.content}</span>
            </label>
            <a href="#" class="delete" data-num="${index}"></a>
            </li>`;
      }
  }else if(item.checked){ //打勾
    if(toggleTab == "all" || toggleTab == "done"){
      str += `<li>
            <label class="checkbox" for="">
            <input type="checkbox" checked data-num="${index}"/>
            <span>${item.content}</span>
            </label>
            <a href="#" class="delete" data-num="${index}"></a>
            </li>`;
      }
  }
  list.innerHTML = str;
  todoLength.textContent = count;
})
}
//--todolist介面--