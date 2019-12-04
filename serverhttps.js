var https=require("https");
var fs=require("fs");
var express = require('express');
var ws=require("socket.io");
var path=require("path");
var _ = require('underscore');
var usocket = [];
var usocket1 = [];
var pass=[];
var data=[];
var hashName = {};
var onlineCount = 0;
var app = express();
// 静态文件识别
app.use(express.static('./public'));
var options = {
    key: fs.readFileSync('./2_www.maomin.club.key'),
    cert: fs.readFileSync('./1_www.maomin.club_bundle.crt')
}
var server = https.createServer(options, app);

function get_file_content(filepath) {
    return fs.readFileSync(filepath);
}
// 获取在线
function broadcast() {
    io.sockets.emit("dataval", hashName);
}
//提供私有socket
function privateSocket(toId) {
    return (_.findWhere(io.sockets.sockets, {
        id: toId
    }));
}
// 封装删除
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
// 连接socket
var io=ws(server);
io.on("connection",function(socket){
// 写入成功后读取测试
fs.readFile('./user.xls', 'utf-8', function (err, data) {
    if(data!=null){
    var value = data.split('\n');
     io.sockets.emit("users", value); 
    }

});
// 写入成功后读取测试
fs.readFile('./password.xls', 'utf-8', function (err,data) {
    if(data!=null){
    var pass1=data.split('\n');
    io.sockets.emit("pass", pass1);
    }
});
    broadcast();
// 生成名字
socket.on('setName', function (data) {
    var name = data;
    hashName[name] = socket.id;
    // console.log(hashName[name]);
    broadcast();
});
// 私聊发送
socket.on('sayTo', function (data) {
    var toName = data.to;
    var toId;
    console.log(toName);
    if (toId = hashName[toName]) {
        privateSocket(toId).emit('message1', data);
    }
});
// 离开
socket.on('disconnect', function (name) {
         name=this.i2;
         io.emit("disconnect", name);
         removeByValue(data, name);
         io.sockets.emit("dataval", data);
    })
socket.on('reconnect', attemptNumber => {
    console.log('重连')
})
socket.on('reconnect_failed', () => {
   console.log('重连失败')
  })
socket.on('reconnect_attempt', () => {
   console.log('正在重连')
})
// 在线
socket.on('time', function (val) {
        // console.log(val);
   })
// 注册
socket.on("reg", function (name) {
          usocket[name] = socket;
          this.i1=name;
          io.emit("reg", name);
          var myname =this.i1+"\n";
          fs.writeFile('./user.xls', myname, {
              'flag': 'a'
          }, function (err) {
              if (err) {
                  throw err;
              }
              // 写入成功后读取测试
              fs.readFile('./user.xls', 'utf-8', function (err,data) {
                  if (err) {
                      throw err;
                  }
              });
          });
    })
// 加入
io.emit('connected', ++onlineCount);
    // console.log(data);
    io.sockets.emit("array", data);
    socket.on("join", function (name) {
        usocket1[name] = socket;
        this.i2 = name;
        io.emit("join", name);
        data.push(name);
        io.sockets.emit("dataval", data);
    })
// 密码
socket.on("pass",function(val){
      pass[val]=socket;
      this.i2=val;
      io.emit("pass", val);
      var password=this.i2+"\n";
       fs.writeFile('./password.xls', password, {
              'flag': 'a'
          }, function (err) {
              if (err) {
                  throw err;
              }
          });
    })
});
server.listen(3003);
console.log("服务器运行中");