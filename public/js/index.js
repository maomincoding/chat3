// var socket = io.connect("https://www.maomin.club:3003");
function sock () {
    return io.connect("localhost:3003");
}
// 心跳机制
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden') {
        //记录页面隐藏时间
        sock()
        console.log('隐藏了')
    }
})
var socket = sock()
    var re = document.querySelector("#re");
    var register1=document.querySelector(".register");
    var init =document.querySelector(".init");
    var passr=document.querySelector("#passr");
    var passl=document.querySelector("#passl");
    var login1= document.querySelector(".login");
    var register_b = document.querySelector("#register_b");
    var lo = document.querySelector("#lo");
    var chat = document.querySelector("#chat");
    var login_b = document.querySelector("#login_b");
    var myMes = "";
    var vf="";
    var na = "";
    var p = "";
    var we = "";
    var div = "";
    var v="";
    var q=0;
    var regCn = /[@:]/im;
    var pattern = /^[\u4E00-\u9FA5]{1,5}$/;





// 初始页面注册
    document.querySelector("#reg").onclick=function(){
        register1.style.display="block";
        init.style.display="none";
        document.querySelector(".bg").style.display="none";
    }
// 初始页面登录
    document.querySelector("#log").onclick=function(){
        login1.style.display="block";
        init.style.display="none";
        document.querySelector(".bg").style.display="none";
    }
// 登录按钮
    login_b.onclick = function () {
        login();
       
    }
// 注册按钮
    register_b.onclick=function () {
        register();
    }
//发送
    document.getElementById("btn").onclick = function () {
        send(); 
    };
// 内容填充
    document.getElementById("text").onkeyup = function () {
        if (document.getElementById("text").value.length != 0) {
            document.getElementById("btn").style.cssText = "background:#98E165;color:#fff;"
        } else {
            document.getElementById("btn").style.cssText = "background: #DDDEE2;color:#fff"
        }
    }
    document.querySelector("#text").onclick = function () {
        document.querySelector('#text').scrollIntoView(false);
    }
// 传名
 var users2 = "";
 socket.on('users', function (users) {
     users2 = users;
    //  console.log(users2);
 });
 // 传密码
 var pass2=""
  socket.on('pass', function (val) {
     pass2 = val;
    //  console.log(pass2)
 });
// 统计在线人数
var arrh=[]
  socket.on('dataval', function (val) {
      vf = val;
      console.log(vf);
        
        for (let i = 0; i < vf.length; i++) {
            // uu++
            arrh.push(vf[i])
            console.log(arrh)
        }
              var rf = [...new Set(arrh)]
              console.log(rf)
              rf=vf
              for (let j = 0; j < rf.length; j++) {
                    var li = document.createElement("li");
                    li.classList.add("active");
                    li.innerText = rf[j]
                    console.log(rf[j])
                    socket.emit("time", rf[j]);
                    document.querySelector(".fix").appendChild(li);
                  
              }
  });
  socket.on('join', function (val) {
  	document.querySelector(".fix").innerHTML = ''
  })
  socket.on('disconnect', function (val) {
  	document.querySelector(".fix").innerHTML = ''
  })
// 生成数组
  var ar="";
  socket.on('array', function (val) {
    ar = val;
    // console.log(ar);
});
// 在线信息
  var onOff = true;
document.querySelector(".title img").onclick=function (arams) {
    onOff ? document.querySelector(".fix").style.display = "block" : document.querySelector(".fix").style.display = "none";
    onOff = !onOff;
}
 // 封装注册
function register() {
    if (re.value.length == 0) {
        sweetAlert("请输入用户名！");
        return false;
    } else if (regCn.test(re.value)) {
        sweetAlert("格式错误，不能够用和:符号取名，请重新输入！");
        return false;
    } else if (pattern.test(re.value)) {
        sweetAlert("不能使用中文字符哦！");
        return false;
    } else if (!(re.value.length == 0 && regCn.test(re.value))) {
        if (users2.indexOf(re.value) != -1) {
              sweetAlert("已经注册啦,换一个用户名吧！");
        }
        else{
             names(re.value.trim());
             pass(passr.value.trim());
             sweetAlert("注册成功,您的用户名:" + re.value.trim());
             document.querySelector(".swal-button").onclick = function () {
                window.location.reload();
             }
        }
    } 
}
// 封装登录
    function login() {
       if (lo.value.length == 0) {
           sweetAlert("请输入用户名！");
           return false;
       } else if (regCn.test(lo.value)) {
           sweetAlert("格式错误，不能够用和:符号取名，请重新输入！");
           return false;
       } else if (pattern.test(lo.value)) {
           sweetAlert("不能使用中文字符哦！");
           return false;
       } else if (!(lo.value.length == 0 && regCn.test(lo.value))) {
           if (users2.indexOf(lo.value) != -1) {
            for (var i = 0; i < users2.length; i++) {
                if(users2[i]===lo.value&&pass2[i]===passl.value){
                    if(ar.indexOf(lo.value)==-1){
                        sweetAlert("恭喜您，登录成功！");
                        socket.emit('setName', lo.value.trim());
                        names1(lo.value.trim());
                        login1.style.display="none";
                        document.querySelector(".bg").style.display = "none";
                        document.querySelector(".cd span").style.display = "none";
                        document.querySelector(".title img").style.display = "block";
                        document.querySelector(".fix").style.display = "block" ;
                        document.querySelector(".title").style.display = "block" ;
                        document.querySelector(".tit").innerText=lo.value.trim();
                        document.querySelector(".swal-button").onclick = function () {
                        document.getElementById("text").focus();
                        document.querySelector(".fix").addEventListener('click', function (e) {
                           if (e.target.nodeName === "LI"&&e.target.innerText != document.querySelector(".tit").innerText) {
                                document.querySelector(".fix").style.display="none";
                                document.querySelector(".chat_b").style.display="block";
                                document.querySelector(".box").style.display="block";
                                document.querySelector(".tit").innerText = e.target.innerText;
                                document.querySelector("#text").focus();
                                onOff=true;
                           }
                           else{
                            sweetAlert("不能跟自己聊天哦~");
                           }
                        })
                    }
                }
                else{ sweetAlert("不能重复登录哦！"); return }
            }
            if(users2[i]===lo.value&&pass2[i]!=passl.value){ sweetAlert("密码错误！"); return; }
            } 
           } 
           else { sweetAlert("请先注册哦！"); login1.style.display="none"; register1.style.display="block"; }
       }                  
    }
// 传名
    function names(value) {
        this.name=value;
        socket.emit("reg", name);
    }
    function names1(value) {
        this.name1 = value;
        socket.emit("join", name1);
        document.title = name1 + "的臻美Chat"
    }
// 传密码
    function pass(value){
         socket.emit("pass", value);
    }
    socket.on("join", function (user) {
        this.na = user; 
    })
    socket.on("reg", function (user) {
        this.na1 = user;
    })
    socket.on("pass", function (val) {
        // console.log(val);
    })
// 私发消息
    socket.on('message1', function (data) {
        var p1 = document.createElement("div");
        var s1 = document.createElement("p");
        var s2 = document.createElement("p");
        var div1 = document.createElement("div");
        var em=document.createElement("em");
        var ads = document.createElement("audio");
        ads.src = "http://106.13.131.245/data/res.mp3";
        ads.className = "ads";
        s1.className="chatlist";
        s2.className="chatlist1";
        em.className="zwasked1";
        div1.className = "divbox";
        s1.innerText= data.from;
        s2.innerText= data.msg;
        s1.appendChild(em);
        p1.appendChild(s1);
        p1.appendChild(s2);
        chat.appendChild(ads);
        ads.play();
        div1.appendChild(p1);
        chat.appendChild(div1);
        chat.scrollTop = chat.scrollHeight;
    });
// 私聊发送
    function send() {
            if (document.getElementById("text").value != "") {
                 socket.emit('sayTo', {
                     from: lo.value,
                     to: document.querySelector(".tit").innerText,
                     msg: document.querySelector("#text").value,
                 })
                var p1 = document.createElement("div");
                 var s1 = document.createElement("p");
                var s2 = document.createElement("p");
                var em=document.createElement("em");
                var div1 = document.createElement("div");
                var ads = document.createElement("audio");
                p1.style.cssText="float:right;";
                s2.style.cssText = "color:#333;"
                ads.src = "http://106.13.131.245/data/s.wav";
                ads.className = "ads";
                div1.className = "divbox";
                s1.className="chatlist";
                s1.style.cssText="color:#333 !important;float:right; !important";
                s2.className="chatlist2";
                em.className="zwasked";
                s1.innerText=lo.value;
                s2.innerText= document.querySelector("#text").value;
                s1.appendChild(em);
                p1.appendChild(s1);
                p1.appendChild(s2);
                chat.appendChild(ads);
                ads.play();
                div1.appendChild(p1);
                chat.appendChild(div1);
                chat.scrollTop = chat.scrollHeight;
  
            } else {
                sweetAlert('请输入内容！');
            }
         chat.scrollTop = chat.scrollHeight;
         document.querySelector("#text").value = "";
         document.querySelector("#text").focus();
}
