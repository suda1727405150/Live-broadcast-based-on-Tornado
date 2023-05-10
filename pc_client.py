import sys
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QObject, pyqtSlot, QUrl
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import pyqtProperty
from ffmpy3 import FFmpeg
import subprocess

class ShareObject(QObject):
    def __init__(self, parent=None):
        super().__init__(parent=parent)
        self.audio=''
        self.video=''
        self.get_device()
        self.cmd = ['ffmpeg', '-list_devices', 'true', '-f', 'dshow', '-i', 'dummy']
        self.process = subprocess.Popen(self.cmd, shell=False, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, encoding="utf-8",
                                   text=True)
        self.rtmp = 'rtmp://39.96.93.74:1935/myapp/'

    @pyqtSlot(result=str)
    def sendAudioMsg(self):
        view.page().runJavaScript('upAudio("'+self.audioMsg+'");')
    
    @pyqtSlot(result=str)
    def sendVedioMsg(self):
        view.page().runJavaScript('upVedio("'+self.vedioMsg+'");')
    
    @pyqtSlot(str,result=str)
    def receiveMsg(self,msg):
        return msg

    @pyqtSlot(str, result=str)
    def myTest(self, test):
        print('test is', test)
        return '返回前端结果'

    def get_device(self):
        cmd = ['ffmpeg', '-list_devices', 'true', '-f', 'dshow', '-i', 'dummy']
        device_list = {'video': [], 'audio': []}
        process = subprocess.Popen(cmd, shell=False, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, encoding="utf-8",
                                   text=True)
        out = [line for line in process.stdout if line.startswith('[dshow')]
        flag = 'video'
        for i in out:
            if 'DirectShow video devices' in i:
                flag = 'video'
            elif 'DirectShow audio devices' in i:
                flag = 'audio'
            i = i.split(']')[1].strip()
            if i[0] == '"':
                device_list[flag].append(i.strip('"'))
        self.video = '#'.join(device_list['video'])
        self.audio = '#'.join(device_list['audio'])

    @pyqtSlot(str,result=str)
    def play(self,user):        #             推流
        information=user.split(',')
        # self.rtmp+=information[0]
        # 交换一下，传递过来的是先声音在摄像头，现在先摄像头再声音
        temp=information[1]
        information[1]=information[2]
        information[2]=temp
        if information[3]=='1' or information[3]=='1':
            information[3]='1'
        cmd = []
        if information[1] != '0':#vedio
            if information[2] != '0':#audio
                cmd = ['ffmpeg', '-f', 'dshow', '-i', 'video=' + self.video, '-s', '640x360', '-f', 'dshow', '-i',
                       'audio=' + self.audio, '-r', '5', '-vcodec', 'libx264', '-preset:v', 'ultrafast', '-tune:v',
                       'zerolatency', '-f', 'flv', self.rtmp+information[0]]
            else:
                cmd = ['ffmpeg', '-f', 'dshow', '-i', 'video=' + self.video, '-s', '640x360', '-vcodec', 'libx264',
                       '-b:v', '1000k', '-ab', '128k', '-f', 'flv', self.rtmp+information[0]]
        elif information[3] != '0':
            if information[2] != '0':
                cmd = ['ffmpeg', '-f', 'dshow', '-i', 'audio=' + self.audio, '-f', 'gdigrab', '-video_size',
                       '1920x1080', '-framerate', '15', '-i', 'desktop', '-pix_fmt', 'yuv420p', '-codec:v', 'libx264',
                       '-bf', '0', '-g', '300', '-preset:v', 'ultrafast', '-tune:v', 'zerolatency', '-f', 'flv',
                       self.rtmp+information[0]]
            else:
                cmd = ['ffmpeg', '-f', 'gdigrab', '-video_size', '1920x1080', '-framerate', '15', '-i', 'desktop',
                       '-pix_fmt', 'yuv420p', '-codec:v', 'libx264', '-bf', '0', '-g', '300', '-f', 'flv', self.rtmp+information[0]]
        elif information[2] != '0':
            cmd = ['ffmpeg', '-f', 'dshow', '-i', 'audio=' + self.audio, '-r', '5', '-vcodec', 'libx264',
                   '-preset:v', 'ultrafast', '-tune:v', 'zerolatency', '-f', 'flv', self.rtmp+information[0]]
        self.process.terminate()
        if cmd!=[]:
            self.process = subprocess.Popen(cmd)

    @pyqtSlot(str, result=str)
    def stopplay(self,data):
        print(data)



if __name__ == '__main__':
    app = QApplication(sys.argv)
    view = QWebEngineView()  #为拉网页做准备
    view.setWindowTitle('迅腾视频会议V1.0')
    view.setGeometry(5, 30, 1355, 730)
    channel = QWebChannel()
    share = ShareObject()
    # share.setMsg("xwxw")
    channel.registerObject('pyjs', share)
    view.page().setWebChannel(channel)   #拉过来的网页共享我们编写的ShareObject的值和方法，调用时用pyjs即可
    
    url_string = "http://39.96.93.74/"
    view.load(QUrl(url_string))
    view.show()
    sys.exit(app.exec_())

