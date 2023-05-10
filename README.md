# 基于 Tornado 的直播软件
本程序是一个基于 Tornado 框架开发的直播软件，它支持主持人和观众两种角色，让参与者之间可以进行音视频互动和实时文字交流。除此之外，该软件还支持屏幕分享、白板演示等功能。其中，PC 客户端采用了基于 PyQt5 框架的嵌入网页的混合结构，而 Web 服务端则采用了 Tornado HttpServer 框架。该软件的 Web 前端主要采用 HTML5、CSS3、Javascript 和 Websocket 等技术。直播推流基于 ffmpy3，而直播拉流可以使用 HTML5 video 或客户端中的视频播放器（如 VLC 组件）。视频分发则采用 nginx-http-flv 直播服务器。

该程序的主要依赖项如下：

- Python 3
- PyQt5
- Tornado
- ffmpy3
- nginx-http-flv

## 安装

1. 克隆或下载本程序的代码库

2. 安装 Python 3

3. 安装程序依赖项：

    ```
    pip install PyQt5 Tornado ffmpy3
    ```

4. 安装 nginx-http-flv

5. web_server.py代码和其他html文件均放在服务器上，pc_client.py放在本地

## 使用

### PC 客户端

1. 修改 `pc_client.py` 程序中的ip地址并运行

2. 在登录界面登录账户


### Web 服务端

1. 修改js文件中涉及到的ip地址

2. 运行 `web_server.py` 程序

3. 在浏览器中访问 http://host_ip:8080

## 参考资料

- PyQt5 文档：https://www.riverbankcomputing.com/static/Docs/PyQt5/
- Tornado 文档：https://www.tornadoweb.org/en/stable/
- ffmpy3 文档：https://pypi.org/project/ffmpy3/
- nginx-http-flv 文档：https://github.com/winshining/nginx-http-flv-module
