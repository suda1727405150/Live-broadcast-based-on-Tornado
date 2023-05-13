var canvas;
var context;
var tool;
var imgData;
var color = "#000000";
var clear = false;
var my_width = 1;
var my_line = 'solid';
var my_photo = 'rec';
var pen = true;
var colors = new Array("#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff");
var photo = new Array("img/rec.png", "img/circle.png", "img/line.png");
var photo_rec = new Array("rec", "circle", "line")
var line_file = new Array("img/solid.png", "img/dotted.png");
var line_ret = new Array('solid', 'dotted');
var width_file = new Array("img/width1.png", "img/width3.png", "img/width5.png", "img/width7.png");
var width_ret = new Array(1, 3, 5, 7);
/**
 * called on window load.
 */
if (window.addEventListener) {
    //alert(window.addEventListener);
    window.addEventListener('load',
            init(),
            false) //添加监听事件，onload
}

/**
 * init.
 */
function init() {
    /**
     * find the canvas element.
     */
    //imageView.onmouseover=function(){
    // this.style.cursor='url(img/mouse.png),auto';
    //} 
    imageView.style.cursor = 'url(img/mouse1.png),auto';
    canvas = document.getElementById('imageView');
    if (!canvas) { //没有得到返回null
        return;
    }
    if (!canvas.getContext) {
        return;
    }

    /**
     * get the 2D canvas context.
     */
    context = canvas.getContext('2d');
    if (!context) {
        return;
    }

    /**
     * pencil tool instance.
     */
    tool = new tool_pencil();

    /**
     * attach the mousedown, mousemove and mouseup event listeners.
     */
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup', ev_canvas, false);

}

/**
 * This painting tool 
 * works like a drawing pencil 
 * which tracks the mouse movements.
 * 
 * @returns {tool_pencil}
 */
function tool_pencil() {
    this.started = false;
    //this.circle=false;
    this.c_x = 0;
    this.c_y = 0;

    /**
     * This is called when you start holding down the mouse button.
     * This starts the pencil drawing.
     */
    this.mousedown = function(ev) { //点击
        /**
         * when you click on the canvas and drag your mouse
         * the cursor will changes to a text-selection cursor
         * the "ev.preventDefault()" can prevent this.
         */
        //context.setLineDash([5, 5]);
        ev.preventDefault(); //阻止事件默认行为
        context.beginPath(); //beginPath() 丢弃任何当前定义的路径并且开始一条新的路径。它把当前的点设置为 (0,0)。
        context.lineWidth = my_width;
        if (clear) {
            context.lineWidth = 8;
            context.setLineDash([]);
            context.strokeStyle = '#ffffff';
        } else {
            if (my_line == 'solid') {
                context.setLineDash([]);
            } else {
                context.setLineDash([5, 5]);
            }
            context.strokeStyle = color;
        }

        context.moveTo(ev._x, ev._y); //移动x和y个像素
        this.started = true;
        this.c_x = ev._x;
        this.c_y = ev._y;
        //alert(circle);
        //alert(this.started);
        imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    };

    /**
     * This is called every time you move the mouse.
     * Obviously, it only draws if the tool.started state is set to true
     */
    this.mousemove = function(ev) { //点击且移动
        if (clear != true) {
            imageView.style.cursor = 'url(img/mouse1.png),auto';
        }
        if (this.started) {
            if (pen) {
                context.lineTo(ev._x, ev._y); //lineTo() 方法添加一个新点，然后创建从该点到画布中最后指定点的线条（该方法并不会创建线条）。
                context.stroke(); //使用 stroke() 方法在画布上绘制确切的路径
            } else {
                if (my_photo == 'rec') {
                    context.putImageData(imgData, 0, 0);
                    context.beginPath();
                    var width = Math.sqrt(Math.pow(ev._x - this.c_x, 2));
                    var height = Math.sqrt(Math.pow(ev._y - this.c_y, 2));
                    if (ev._x >= this.c_x) {
                        if (ev._y >= this.c_y) {
                            context.rect(this.c_x, this.c_y, width, height);
                        } else {
                            context.rect(this.c_x, this.c_y, width, -height);
                        }
                    } else {
                        if (ev._y >= this.c_y) {
                            context.rect(this.c_x, this.c_y, -width, height);
                        } else {
                            context.rect(this.c_x, this.c_y, -width, -height);
                        }
                    }

                    context.stroke();
                } else if (my_photo == 'circle') {
                    context.putImageData(imgData, 0, 0);
                    context.beginPath();
                    var r = Math.sqrt(Math.pow(ev._x - this.c_x, 2) + Math.pow(ev._y - this.c_y, 2));
                    context.arc(this.c_x, this.c_y, r, 0, 2 * Math.PI);
                    context.stroke();
                } else if (my_photo == 'line') {
                    context.putImageData(imgData, 0, 0);
                    context.beginPath();
                    context.moveTo(this.c_x, this.c_y);
                    context.lineTo(ev._x, ev._y);
                    context.stroke();
                }
            }

        }
    };

    /**
     * This is called when you release the mouse button.
     */
    this.mouseup = function(ev) { //点击后释放
        if (this.started) {
            //context.putImageData(imgData,0,0);
            //this.mousemove(ev);
            this.started = false;
            //this.clear=false;
            //circle=false;
            //rec=false;
        }
    };
}

/**
 * general-purpose event handler.
 * determines the mouse position relative to the canvas element.
 * 
 * @param ev
 */
function ev_canvas(ev) {
    var x, y;
    if (ev.offsetX || ev.offsetY == 0) {
        ev._x = ev.offsetX; //检查相对于触发事件的对象，鼠标位置的水平坐标
        ev._y = ev.offsetY; //检查相对于触发事件的对象，鼠标位置的垂直坐标
    }

    /**
     * call the event handler of the tool.
     */
    var func = tool[ev.type]; //[]可以理解为.
    if (func) { //如果属于那三个事件
        func(ev); //执行相应事件
    }
}

function show_color(id) {

    delete_div();
    var room = document.getElementById('my_div');
    for (var i = 0; i < colors.length; i++) {

        var ele = document.createElement('li');
        ele.style.backgroundColor = colors[i];
        ele.id = colors[i];
        ele.onclick = function(e) {

            color = e.target.id;
            document.getElementById('showcolor').style.backgroundColor = color;
        }
        room.appendChild(ele);
    }
}

function delete_div() //删除li元素
{
    clear = false;
    var room = document.getElementById('my_div');
    var my_length = room.childNodes.length;
    for (var i = 0; i < my_length; i++) {
        room.removeChild(room.childNodes[0]);
    }
}

function my_pen() {
    //alert('ok');
    delete_div();
    pen = true;
}

function show_pen() {
    delete_div();
    var my_div = document.getElementById('my_div');
    for (var i = 0; i < line_file.length; i++) {
        var li = document.createElement("li");
        var img = document.createElement("img");
        img.setAttribute("id", line_ret[i]);
        img.src = line_file[i];
        li.appendChild(img);
        li.onclick = function(e) {
            my_line = e.target.id;
            if (my_line == 'dotted') {
                context.setLineDash([5, 5]);
            } else {
                context.setLineDash([]);
            }
            document.getElementById('solid').style.background = 'url(img/' + my_line + '.png)';
        }
        my_div.appendChild(li);
    }

}

function show_width(id) //后面还要搞一个粗细的全局变量
{
    delete_div();
    var my_div = document.getElementById('my_div');
    for (var i = 0; i < width_file.length; i++) {
        var li = document.createElement("li");
        var img = document.createElement("img");
        img.setAttribute("id", width_ret[i]);
        img.src = width_file[i];
        li.appendChild(img);
        li.onclick = function(e) {
            my_width = e.target.id;
            document.getElementById('width').style.background = 'url(img/width' + my_width + '.png)';
        }
        my_div.appendChild(li);
    }
}

function myclear() {
    delete_div();
    clear = true;
    pen = true;
    imageView.style.cursor = 'url(img/mouse2.png),auto';
}

function show_rec() {
    delete_div();
    pen = false;
    var my_div = document.getElementById('my_div');
    for (var i = 0; i < photo.length; i++) {
        var li = document.createElement("li");
        var img = document.createElement("img");
        img.setAttribute("id", photo_rec[i]);
        img.src = photo[i];
        li.appendChild(img);
        li.onclick = function(e) {
            pen = false;
            my_photo = e.target.id;
            //alert(my_photo);			
            document.getElementById('rec').style.background = 'url(img/' + my_photo + '.png)';
        }
        my_div.appendChild(li);
    }
}

function do_close() {
    var ws = new WebSocket("ws://39.96.93.74:8080/MessageWSHandler");
    var user = window.location.href.split("=");
    ws.onopen = function(e) {
        ws.send(user[1] + ',' + user[2] + ',screen2,' + '0' + ',7');
        window.location.href = user[3] + "?user=" + user[1] + "&room=" + user[2];
    }
}
