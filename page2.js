var ws;
var user_number = new Array();
var big = '0';
var now_time_label;
var user = window.location.href.split("=");
var user_room = user[user.length - 1];
// alert(user_room);
var user_name_temp = user[user.length - 2].split("&");
var user_name = user_name_temp[0];

function onLoad() {


    ws = new WebSocket("ws://39.96.93.74:8080/MessageWSHandler");

    ws.onmessage = function(e) {

        if (e.data[0] == '6') //刷新拉流，角色等等（相当于刷新界面，注意数组是否需要清空等等）
        {
            user_number = new Array();
            var my_message = e.data.split('#');
            var list = document.getElementById('list');
            list.innerHTML = '';
            list.style.display = "none";
            document.getElementById("my_close").innerHTML = "离开会议";
            for (var i = 1; i < my_message.length; i++) {
                var temp = my_message[i].split(',');
                user_number.push(temp);
                if (user_name != temp[0]) {
                    var ele = document.createElement('li');
                    ele.innerHTML = "<font size='4' color='red'>" + temp[0] + "</font>";
                    ele.setAttribute('align', 'left');
                    ele.onclick = function(e) {
                        document.getElementById('send_message').value += e.target.innerHTML;
                        document.getElementById("u39").style.display = "none";
                        document.getElementById("list").style.display = "none";
                        document.getElementById("u42").style.display = "block";
                        document.getElementById("u44").style.display = "block";
                        document.getElementById("u33").style.display = "block";
                    }
                    list.appendChild(ele);
                }
            }

            if (user_number.length == 1 && (user_number[0][2] == '1' || user_number[0][3] == '1' || user_number[0][4] == '1')) {
                big = user_name;
            } else {
                for (var i = 0; i < user_number.length; i++) {
                    if (user_number[i][3] == '1' || user_number[i][4] == '1') {
                        big = user_number[i][0];
                        break;
                    }
                    big = '0';
                }
            }
            if (big == '0' || user_number.length == 1) {
                show_video(user_number); //显示视频，拉流的
                show_right_juese(user_number); //显示角色权限管理，主持人的，观众对应角色查看
            } else {
                show_video(user_number); //显示视频，拉流的
            }
            show_self(user_number); //显示自己信息
            if (user_number[get_key(user_number, user_name)][3] == '1') {
                document.getElementById("my_close").innerHTML = "停止屏幕共享";
            }
            // else if (user_number[get_key(user_number, user_name)][4] == '1') {
            //   document.getElementById("my_close").innerHTML = "停止白板演示";
            // }
        } else if (e.data[0] == '7') {
            var temp = e.data.split('#');
            pyjs.play(user_name + ',' + temp[1], function(res) {}); //pyqt5交互
        } else if (e.data[0] == '8') {
            var temp = e.data.split('#');

            if (now_time_label != temp[1]) {
                var txt1 = document.createElement('DIV');
                txt1.innerHTML = "<font size='1'>" + temp[1] + "</font>";
                txt1.setAttribute('align', 'center');
                document.getElementById("u31_div").appendChild(txt1);
                now_time_label = temp[1]
            }

            var txt2 = document.createElement('DIV');
            txt2.innerHTML = "<font size='2' color='blue'>" + temp[2] + "</font>";
            txt2.setAttribute('align', 'left');
            document.getElementById("u31_div").appendChild(txt2);

            var txt3 = document.createElement('DIV');
            txt3.innerHTML = "<font size='4' color='blue'>" + temp[3] + "</font>";
            txt3.setAttribute('align', 'left');
            document.getElementById("u31_div").appendChild(txt3);
        } else if (e.data[0] == '@') {
            var temp = e.data.split(',');
            alert(temp[1] + '@你');
        } else if (e.data[0] == 'd') {
            var temp = e.data.split(',');
            var list = document.getElementById('list');
            var li_num = list.getElementsByTagName('li');
            for (var i = 0; i < li_num.length; i++) {

                if (li_num[i].innerHTML == temp[1]) {
                    //从list得DOM对象中删除子li
                    list.removeChild(list.childNodes[i]);
                    break;
                }
            }
        } else if (e.data[0] == 's') {
            alert('会议结束');
            pyjs.play(user_name + ',0,0,0,0', function(res) {}); //pyqt5交互
            window.location.href = "join.html?user=" + user_name;
        } else if (e.data == 'False1') {
            alert('无麦克风权限');
        } else if (e.data == 'False2') {
            alert('无摄像头权限');
        } else if (e.data == 'False3') {
            alert('无屏幕共享权限');
        } else if (e.data == 'False4') {
            alert('无白板演示权限');
        }


    }

    ws.onopen = function(e) {
        ws.send(user_name + ',' + user_room + ',g');
        ws.send(user_room + ',6'); //表明需要主持人状态
    }

    window.onbeforeunload = function(e) {
        pyjs.play(user_name + ',0,0,0,0', function(res) {}); //pyqt5交互
    }

    document.getElementById("room_id").innerHTML = "房间号：" + user_room;

    //ws.send();

    // document.getElementById("u72").style.display="block";
    // document.getElementById("u96").style.display="block";
    // document.getElementById("u103_img").src="img/regen/u51.png"
    // document.getElementById("u105_div").innerHTML += "<p id='21ij'><br>内容</p>";
    //  document.getElementById("u63").style.display="none";
    // document.getElementById("u105_div").innerHTML += "<p id='21ij2'><br>内容2</p>";
    new QWebChannel(qt.webChannelTransport, function(channel) {
        window.pyjs = channel.objects.pyjs;
    });
}
// if (flvjs.isSupported()) {
//         startVideo()
//     }
function show_video(my_user_number) {
    document.getElementById("u70").style.display = "none";
    document.getElementById("u71").style.display = "none";
    document.getElementById("u72").style.display = "none";

    //document.getElementById("u46").style.display="block";
    if (big != '0') {



        for (var i = 0; i < my_user_number.length; i++) {
            if (my_user_number[i][0] == big) {
                document.getElementById("u73").style.display = "block";
                startVideo('videoElement4', big);
                break;
            }
        }

        if (my_user_number.length >= 2) {
            document.getElementById("u36").style.display = "block";
            document.getElementById("u30").style.display = "none";
            document.getElementById("u39").style.display = "block";
            document.getElementById("u74").style.display = "none";
            document.getElementById("u105").style.display = "none";
            document.getElementById("u107").style.display = "none";
            document.getElementById("u109").style.display = "none";
        }
        var judge_big = 0;
        for (var i = 0; i < my_user_number.length; i++) {
            if (my_user_number[i][0] != big) {
                judge_big++;
                if (judge_big == 1) {
                    document.getElementById("u38").style.display = "block";
                    document.getElementById("u37").style.display = "none";
                    startVideo('videoElement5', my_user_number[i][0]);
                }
                if (judge_big == 2) {
                    document.getElementById("u37").style.display = "block";
                    startVideo('videoElement6', my_user_number[i][0]);
                }
            }
        }
    } else {
        // alert(my_user_number[0][2]);
        document.getElementById("u73").style.display = "none";
        if (my_user_number.length >= 1) {
            if (my_user_number[0][2] == '1') //音频和视频
            {
                startVideo('videoElement1', my_user_number[0][0]);
                document.getElementById("u63").style.display = "none"; //头像关闭  
                document.getElementById("u72").style.display = "block"; //视频打开
            } else {
                document.getElementById("u63").style.display = "block"; //头像打开
                document.getElementById("u72").style.display = "none"; //视频打开
                document.getElementById("audience1").innerHTML = my_user_number[0][0];
            }
            if (my_user_number.length >= 2) {
                if (my_user_number[1][2] == '1') //音频和视频
                {
                    startVideo('videoElement2', my_user_number[1][0]);
                    document.getElementById("u56").style.display = "none"; //头像关闭  
                    document.getElementById("u71").style.display = "block"; //视频打开
                } else {
                    document.getElementById("u56").style.display = "block"; //头像打开
                    document.getElementById("u71").style.display = "none"; //视频打开
                    document.getElementById("audience2").innerHTML = my_user_number[1][0];
                }
                if (my_user_number.length >= 3) {
                    if (my_user_number[2][2] == '1') //音频和视频
                    {
                        startVideo('videoElement3', my_user_number[2][0]);
                        document.getElementById("u49").style.display = "none"; //头像关闭  
                        document.getElementById("u70").style.display = "block"; //视频打开
                    } else {
                        document.getElementById("u49").style.display = "block"; //头像打开
                        document.getElementById("u70").style.display = "none";
                        document.getElementById("audience3").innerHTML = my_user_number[2][0];
                    }
                }
            }
        }
    }
}

function show_self(my_user_number) {
    for (var i = 0; i < my_user_number.length; i++) {
        if (my_user_number[i][0] == user_name) {
            if (my_user_number[i][1] == '1') {
                document.getElementById("u4_img").src = "img/regen/u51.png";
            } else {
                document.getElementById("u4_img").src = "img/regen/u11.png";
            }
            if (my_user_number[i][2] == '1') {
                document.getElementById("u6_img").src = "img/regen/u33.png";
            } else {
                document.getElementById("u6_img").src = "img/regen/u6.png";
            }
            break;
        }
    }
}

function do_close() {

    if (document.getElementById("my_close").innerHTML == "停止屏幕共享") {
        ws.send(user_name + ',' + user_room + ',screen,' + '0' + ',7');

        document.getElementById("my_close").innerHTML = "离开会议";


    } else if (document.getElementById("my_close").innerHTML == "停止白板演示") {

        ws.send(user_name + ',' + user_room + ',screen2,' + '0' + ',7');
        document.getElementById("my_close").innerHTML = "离开会议";


    } else if (document.getElementById("my_close").innerHTML == "离开会议") {
        ws.send(user_name + ',' + user_room + ',S');
        // pyjs.play(user_name + ',0,0,0,0', function (res) { });//pyqt5交互
        window.location.href = "join.html?user=" + user_name;

    }
}

function get_key(my_user_number, my_key) {
    for (var i = 0; i < my_user_number.length; i++) {
        if (my_user_number[i][0] == my_key) {
            return i;
        }
    }
}

function show_juese() {
    show_right_juese(user_number);
}

function do_chat() //发送
{
    document.getElementById("u36").style.display = "none";
    document.getElementById("u30").style.display = "block";
    document.getElementById("u39").style.display = "none";
    document.getElementById("u74").style.display = "none";
    document.getElementById("u105").style.display = "none";
    document.getElementById("u107").style.display = "none";
    document.getElementById("u109").style.display = "none";
}

function show_right_juese(my_user_number) {
    document.getElementById("u36").style.display = "none";
    document.getElementById("u96").style.display = "none";
    document.getElementById("u87").style.display = "none";
    document.getElementById("u78").style.display = "none";
    document.getElementById("u30").style.display = "none";
    document.getElementById("u39").style.display = "block";
    document.getElementById("u74").style.display = "block";
    document.getElementById("u105").style.display = "block";
    document.getElementById("u107").style.display = "block";
    document.getElementById("u109").style.display = "block";
    document.getElementById("u105_div").innerHTML = '';

    if (my_user_number.length >= 1) {
        document.getElementById("u96").style.display = "block"; //右边角色和权限打开
        document.getElementById("u105_div").innerHTML += "<p id='hostname'><br>主持人：" + my_user_number[0][0] + "</p>";
        if (my_user_number[0][1] == '1') {
            document.getElementById("u103_img").src = "img/regen/u51.png";
        } else {
            document.getElementById("u103_img").src = "img/regen/u11.png";
        }
        if (my_user_number[0][2] == '1') {
            document.getElementById("u101_img").src = "img/regen/u33.png";
        } else {
            document.getElementById("u101_img").src = "img/regen/u6.png";
        }


        if (my_user_number.length >= 2) {
            document.getElementById("u87").style.display = "block"; //右边角色和权限打开
            if (my_user_number[1][0] == user_name) {
                document.getElementById("u105_div").innerHTML += "<p id='hostname2'><br>我</p>";
            } else {
                document.getElementById("u105_div").innerHTML += "<p id='hostname2'><br>" + my_user_number[1][0] + "</p>";
            }
            if (my_user_number[1][1] == '1') {
                document.getElementById("u94_img").src = "img/regen/u51.png";
            } else {
                document.getElementById("u94_img").src = "img/regen/u11.png";
            }
            if (my_user_number[1][2] == '1') {
                document.getElementById("u92_img").src = "img/regen/u33.png";
            } else {
                document.getElementById("u92_img").src = "img/regen/u6.png";
            }


            if (my_user_number.length >= 3) {
                document.getElementById("u78").style.display = "block"; //右边角色和权限打开
                if (my_user_number[2][0] == user_name) {
                    document.getElementById("u105_div").innerHTML += "<p id='hostname3'><br>我</p>";

                } else {
                    document.getElementById("u105_div").innerHTML += "<p id='hostname3'><br>" + my_user_number[2][0] + "</p>";
                }
                if (my_user_number[2][1] == '1') {
                    document.getElementById("u85_img").src = "img/regen/u51.png";
                } else {
                    document.getElementById("u85_img").src = "img/regen/u11.png";
                }
                if (my_user_number[2][2] == '1') {
                    document.getElementById("u83_img").src = "img/regen/u33.png";
                } else {
                    document.getElementById("u83_img").src = "img/regen/u6.png";
                }

            }
        }
    }

}

function do_send() {
    var temp_message = document.getElementById("send_message").value;
    if (temp_message.length == 0) {
        return;
    }
    var temp_time = new Date();
    var now_time_temp = temp_time.getHours() + ':' + temp_time.getMinutes() + ':' + temp_time.getSeconds();
    if (now_time_temp != now_time_label) {
        var txt1 = document.createElement('DIV');
        txt1.innerHTML = "<font size='1'>" + now_time_temp + "</font>";
        txt1.setAttribute('align', 'center');
        document.getElementById("u31_div").appendChild(txt1);
        now_time_label = now_time_temp;
    }
    var txt1 = document.createElement('DIV');
    txt1.innerHTML = "<font size='2' color='red'>" + user_name + "</font>";
    txt1.setAttribute('align', 'right');
    document.getElementById("u31_div").appendChild(txt1);

    var txt2 = document.createElement('DIV');
    txt2.innerHTML = "<font size='4' color='red'>" + temp_message + "</font>";
    txt2.setAttribute('align', 'right');
    document.getElementById("u31_div").appendChild(txt2);

    ws.send(user_name + "," + user_room + "," + temp_message + ',8');
    var last_at = '';

    for (var i = 0; i < user_number.length; i++) {

        if (temp_message.search('@' + user_number[i][0]) != -1) {
            last_at += (user_number[i][0] + ',');
        }

    }
    if (last_at.length != 0) {
        ws.send(user_name + "," + user_room + "," + last_at + '@');
    }

    document.getElementById("send_message").value = '';
}

function click_video() {
    var my_video = user_number[get_key(user_number, user_name)][2];
    if (my_video == '0') {
        document.getElementById("u6_img").src = "img/regesn/u33.png";
        my_video = '1';
    } else {
        document.getElementById("u6_img").src = "img/regen/u6.png";
        my_video = '0';
    }
    ws.send(user_name + ',' + user_room + ',video,' + my_video + ',7');
}

function click_audio() {
    var my_audio = user_number[get_key(user_number, user_name)][1];
    if (my_audio == '0') {
        document.getElementById("u4_img").src = "img/regen/u51.png";
        my_audio = '1';
    } else {
        document.getElementById("u4_img").src = "img/regen/u11.png";
        my_audio = '0';
    }
    ws.send(user_name + ',' + user_room + ',audio,' + my_audio + ',7');
}


function click_screen() {
    ws.send(user_name + ',' + user_room + ',screen,' + '1' + ',7');
}

function click_screen2() {
    ws.send(user_name + ',' + user_room + ',screen2,' + '1' + ',7');
    window.location.href = "index.html?user=" + user_name + "=" + user_room + '=page2.html';
}

function startVideo(my_label, l_user_name) {
    var videoElement = document.getElementById(my_label);
    var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        enableWorker: true,
        url: 'http://39.96.93.74/live?port=1935&app=myapp&stream=' + l_user_name

    });
    // 'http://39.96.93.74/live?port=1935&app=myapp&stream=2'

    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();
}

videoElement.addEventListener('click', function() {
    alert('是否支持点播视频：' + flvjs.getFeatureList().mseFlvPlayback + ' 是否支持httpflv直播流：' + flvjs.getFeatureList().mseLiveFlvPlayback)
})

function my_at() {
    var ipt = document.getElementById('send_message');
    var list = document.getElementById('list');
    if (ipt.value[ipt.value.length - 1] == '@') {
        // alert('ok');
        if (list.children.length != 0) {
            document.getElementById("u39").style.display = "block";
            document.getElementById("list").style.display = "block";
            document.getElementById("u42").style.display = "none";
            document.getElementById("u44").style.display = "none";
        }
        // document.getElementById("u39").style.display = "block";
    } else {
        document.getElementById("u39").style.display = "none";
        document.getElementById("list").style.display = "none";
    }
}

function destoryVideo() {
    flvPlayer.pause();
    flvPlayer.unload();
    flvPlayer.detachMediaElement();
    flvPlayer.destroy();
    flvPlayer = null;
}

function fast_send() {
    var code = event.keyCode;
    if (code == 13) {
        do_send();
    }
}

function do_audio1(e) {
    var re_user_name;
    if (e == 'u103_img') {
        user_number[0][1] = user_number[0][1] == '1' ? '0' : '0';
        re_user_name = 0;
    } else if (e == 'u94_img') {
        user_number[1][1] = user_number[1][1] == '1' ? '0' : '0';
        re_user_name = 1;
    } else if (e == 'u85_img') {
        user_number[2][1] = user_number[2][1] == '1' ? '0' : '0';
        re_user_name = 2;
    }
    show_right_juese(user_number);
    // ws.send(user_number[re_user_name][0]+','+user_room+',audio,'+user_number[re_user_name][1]+'c')
    ws.send(user_number[re_user_name][0] + ',' + user_room + ',audio,' + '0' + ',7');
}

function do_video1(e) {
    var re_user_name;
    if (e == 'u101_img') {
        user_number[0][2] = user_number[0][2] == '1' ? '0' : '0';
        re_user_name = 0;
    } else if (e == 'u92_img') {
        user_number[1][2] = user_number[1][2] == '1' ? '0' : '0';
        re_user_name = 1;
    } else if (e == 'u83_img') {
        user_number[2][2] = user_number[2][2] == '1' ? '0' : '0';
        re_user_name = 2;
    }
    show_right_juese(user_number);
    ws.send(user_number[re_user_name][0] + ',' + user_room + ',video,' + '0' + ',7');
    // ws.send(user_number[re_user_name][0]+','+user_room+',video,'+user_number[re_user_name][2]+'c')

}

function do_screen1(e) {
    var re_user_name;
    if (e == 'u99_img') {
        user_number[0][3] = user_number[0][3] == '1' ? '0' : '0';
        re_user_name = 0;
    } else if (e == 'u90_img') {
        user_number[1][3] = user_number[1][3] == '1' ? '0' : '0';
        re_user_name = 1;
    } else if (e == 'u81_img') {
        user_number[2][3] = user_number[2][3] == '1' ? '0' : '0';
        re_user_name = 2;
    }
    show_right_juese(user_number);
    ws.send(user_number[re_user_name][0] + ',' + user_room + ',screen,' + '0' + ',7');

    // ws.send(user_number[re_user_name][0]+','+user_room+',screen,'+user_number[re_user_name][3]+'c')

}

function do_screen21(e) {
    var re_user_name;
    if (e == 'u97_img') {
        user_number[0][4] = user_number[0][4] == '1' ? '0' : '0';
        re_user_name = 0;
    } else if (e == 'u88_img') {
        user_number[1][4] = user_number[1][4] == '1' ? '0' : '0';
        re_user_name = 1;
    } else if (e == 'u79_img') {
        user_number[2][4] = user_number[2][4] == '1' ? '0' : '0';
        re_user_name = 2;
    }
    show_right_juese(user_number);
    ws.send(user_number[re_user_name][0] + ',' + user_room + ',screen2,' + '0' + ',7');

    // ws.send(user_number[re_user_name][0]+','+user_room+',screen2,'+user_number[re_user_name][4]+'c')

}

// function reloadVideo(){
//     destoryVideo()
//     startVideo()
// }
// function do_close() {
//   ws.send(user_room + ',s');
// }
function do_closeaudio() {
    ws.send(user_room + ',a');
}

function do_closevideo() {
    ws.send(user_room + ',v');
}

function do_clickvideo(e) {
    var video_index;
    if (e == 'videoElement1') {
        video_index = 0;
    } else if (e == 'videoElement2') {
        video_index = 1;
    } else if (e == 'videoElement3') {
        video_index = 2;
    } else if (e == 'videoElement5') {
        if (user_number[0][0] == big) {
            video_index = 1;
        } else {
            video_index = 0;
        }
    } else if (e == 'videoElement6') {
        if (user_number[2][0] == big) {
            video_index = 1;
        } else {
            video_index = 2;
        }
    }
    big = user_number[video_index][0];
    show_video(user_number);

}

function stopplay() {
    pyjs.stopPlay('停止播放', function(res) {});
}