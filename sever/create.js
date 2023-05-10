var ws;
var user_name;

function onLoad() {

    ws = new WebSocket("ws://39.96.93.74:8080/MessageWSHandler");
    var user = window.location.href.split("=");
    user_name = user[user.length - 1];
    document.getElementById("user_name").value = user_name
    ws.onmessage = function(e) {
        if (e.data[0] == 'R') {
            var temp = e.data.split(',');
            document.tijiao.text1.value = temp[1];
        }
    }

    ws.onopen = function(e) {
        ws.send("4"); //表明需要一个房间号
    }
    new QWebChannel(qt.webChannelTransport, function(channel) {
        window.pyjs = channel.objects.pyjs;
    });
}

function sendMsg() {
    // alert(document.tijiao.text2.style.display);
    if (document.getElementById("yes").checked) {
        if (document.tijiao.text2.value == "") {
            document.getElementById("div2").innerHTML = "密码不可为空";
            document.getElementById("div3").innerHTML = "";
            return;
        }
        if (document.tijiao.text2.value != document.tijiao.text3.value) {
            document.getElementById("div3").innerHTML = "密码不一致";
            document.getElementById("div2").innerHTML = "";
            return;
        }
    }
    var user_room = document.tijiao.text1.value;
    var password = '';
    var my_sound0 = '0';
    var my_camera0 = '0';
    var my_sound1 = '0';
    var my_camera1 = '0';
    if (document.getElementById("sound").checked) {
        my_sound0 = '1';
    }
    if (document.getElementById("camera").checked) {
        my_camera0 = '1';
    }
    if (document.getElementById("my_sound").checked) {
        my_sound1 = '1';
    }
    if (document.getElementById("my_camera").checked) {
        my_camera1 = '1';
    }
    if (document.getElementById("yes").checked) {
        password = document.tijiao.text2.value;
    }


    if (check_username()) {
        user_name = document.tijiao.user_name.value;
        ws.send(user_name + ',' + user_room + ',' + password + ',' + my_sound1 + ',' + my_camera1 + ',' + my_sound0 + ',' + my_camera0 + ',0'); //传送用户名，房间，密码，麦克风，摄像头(状态，权限)，结束标志0
        window.location.href = "page1.html?user=" + user_name + "&room=" + user_room;
        pyjs.play(user_name + ',' + my_sound1 + ',' + my_camera1 + ',0,0', function(res) {}); //pyqt5交互    
    }



}

function show_password() {
    document.getElementById("my_password").style.display = "block"; //
}

function clear_password() {
    document.getElementById("my_password").style.display = "none"; //隐藏
}

//加入房间
document.getElementById('i77').onclick = function() {
    var user = window.location.href.split("=");
    var user_name = user[user.length - 1];
    window.location.href = "join.html?user=" + user_name;
}


//密码验证
function checkpassword() {
    var div = document.getElementById("div2");
    div.innerHTML = "";
    var password = document.tijiao.text2.value;
    if (password == "") {
        div.innerHTML = "密码不能为空";
        //document.tijao.text2.focus(); 
        return false;
    }
    if (password.length < 4 || password.length > 16) {
        div.innerHTML = "密码长度为4-16位";
        document.tijiao.text2.select();
        return false;
    }
    return true;
}

function checkrepassword() {
    var div = document.getElementById("div3");
    div.innerHTML = "";
    var password = document.tijiao.text2.value;
    var repass = document.tijiao.text3.value;
    if (repass == "") {
        div.innerHTML = "密码不能为空";
        //document.tijiao.text3.focus(); 
        return false;
    }
    if (password != repass) {
        div.innerHTML = "密码不一致";
        document.tijiao.text3.select();
        return false;
    }
    return true;
}

function check_username() {
    document.getElementById("user_nameid").innerHTML = '';
    user_name = document.tijiao.user_name.value;
    if (user_name == "") {
        document.getElementById("user_nameid").innerHTML = "名称不能为空";
        return false;
    }
    return true;
}


function check() {
    if (check_username() && checkpassword() && checkrepassword()) {
        return true;
    } else {
        return false;
    }
}