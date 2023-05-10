var ws;
var room_password = '';
var user_name;

function onLoad() {
    ws = new WebSocket("ws://39.96.93.74:8080/MessageWSHandler");
    var user = window.location.href.split("=");
    user_name = user[user.length - 1];
    document.getElementById("user_name").value = user_name
    ws.onmessage = function(e) {
        if (e.data == "False1") {
            document.getElementById("div1").innerHTML = "不存在的房间号";
        } else if (e.data == "False2") {
            clear_password();

        } else if (e.data[0] == '7') {
            var temp = e.data.split('#');
            pyjs.play(user_name + ',' + temp[1], function(res) {}); //pyqt5交互
        } else {
            room_password = e.data;
            show_password();

        }
    }
    new QWebChannel(qt.webChannelTransport, function(channel) {
        window.pyjs = channel.objects.pyjs;
    });



}
document.getElementById('text1').oninput = function(e) {
    if (document.tijiao.text1.value.length == 9) {
        ws.send(document.tijiao.text1.value + ',5');
    }
}

function sendMsg() {
    //alert(room_password);

    if (document.tijiao.text2.value == '' || document.tijiao.text2.value == room_password) {
        var my_sound = '0';
        var my_camera = '0';
        if (document.getElementById("sound").checked) {
            my_sound = '1'
        }
        if (document.getElementById("camera").checked) {
            my_camera = '1'
        }

        if (check_username()) {
            user_name = document.tijiao.user_name.value;
            ws.send(user_name + "," + document.tijiao.text1.value + ',' + my_sound + ',' + my_camera + ",1"); //传送用户名，房间，麦克风，摄像头，结束标志1
            // pyjs.play(user_name + ',' + my_sound + ',' + my_camera + ',0', function (res) { });//pyqt5交互
            window.location.href = "page2.html?user=" + user_name + "&room=" + document.tijiao.text1.value;
        }
    } else {
        document.getElementById("div2").innerHTML = "密码错误";
    }
}

function show_password() {
    document.getElementById("my_password").style.display = "block"; //
}

function clear_password() {
    document.getElementById("my_password").style.display = "none"; //隐藏
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

//加入房间
document.getElementById('i77').onclick = function() {
    var user = window.location.href.split("=");
    var user_name = user[user.length - 1];
    window.location.href = "create.html?user=" + user_name;
}