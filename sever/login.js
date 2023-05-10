var ws;

function onLoad() {

    ws = new WebSocket("ws://39.96.93.74:8080/MessageWSHandler");

    ws.onmessage = function(e) {
        if (e.data == "False1") {
            alert("账号不存在");
        } else if (e.data == "False2") {
            alert("密码错误");
        } else {
            window.location.href = "create.html?user=" + e.data;
        }
    }
}

function sendMsg() {
    var user_information = '';
    user_information += (document.getElementById('user_name').value);
    user_information += (',' + document.getElementById('password').value);
    user_information += ',3';
    ws.send(user_information);
}