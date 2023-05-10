from tornado import ioloop
from tornado.web import Application
from tornado.websocket import WebSocketHandler
import os
import datetime
import time
people_messages={}
room_PB={}#对应的是是否有人在屏幕和白板操作，1表示有人，0表示没人
romm_people={}#权限：麦克风，摄像头,屏幕共享，白板演示，0表示可以使用，1表示不可以
room_state={}#状态：wbsocket，麦克风，摄像头,屏幕共享，白板演示，0表示未使用，1表示正在使用
room_password={}
user_password={}

with open('user_password.txt','r') as fp:
    data=fp.readlines()
fp.close()

for i in data:
    temp=i.split()
    user_password[temp[0]]=temp[1]
class EchoWebSocket(WebSocketHandler):
    users = set()
    def open(self):#建立连接时执行
        print("WebSocket opened")
        self.users.add(self)
    # 处理client发送的数据
    def on_message(self, message):#有消息到服务端时执行
        message=message.split(',')
        if message[-1]=='0':#创建房间
            # 传送0用户名，1房间，2密码，3麦克风，4摄像头（状态），5麦克风，6摄像头（权限），结束标志0
            # print(message)
            if message[1] in romm_people.keys():
                print("False")
            else:
                room_PB[message[1]]=['0','0']
                room_password[message[1]]=[message[0],message[2]]
                #priority
                romm_people[message[1]]=dict()
                romm_people[message[1]][message[0]]=[message[5],message[6],'0','0']#网页信息，主持人

                room_state[message[1]] = dict()
                room_state[message[1]][message[0]] = [self, message[3], message[4],'0','0']  # 网页信息，主持人

        elif message[-1]=='1':#加入房间
            # 传送用户名0，房间1，麦克风2，摄像头3，结束标志1
            # print('1')
            if message[1] not in room_password.keys():
                print("False")
            else:
                # if message[0] in room_state[message[1]].keys():
                #     room_state[message[1]][message[0]][0] = self
                # else:
                sound=romm_people[message[1]][room_password[message[1]][0]][0]
                camera = romm_people[message[1]][room_password[message[1]][0]][1]
                romm_people[message[1]][message[0]] = [sound, camera,'0','0']  # 网页信息，主持人
                if sound=='0':
                    sound=message[2]
                else:
                    sound='0'
                if camera=='0':
                    camera=message[3]
                else:
                    camera='0'
                room_state[message[1]][message[0]] =[self,sound,camera,'0','0']
            for i in room_state[message[1]]:
                if i!=message[0]:
                    room_state[message[1]][i][0].write_message(self.update(message[1]))
            temp = room_state[message[1]][message[0]][1:5:]
            self.write_message('7#' + ",".join(temp))
            # self.write_message(self.update(message[1]))


        elif message[-1]=='2':  #注册
            # print('2')
            if message[0] in user_password:
                self.write_message("False")
            else:
                user_password[message[0]]=message[1]
                with open('user_password.txt', 'a') as fp:
                    fp.write(message[0]+' '+message[1]+'\n')
                    fp.close()
                self.write_message("True")

        elif message[-1]=='3':#登陆
            # print('3')
            if message[0] not in user_password:
                self.write_message("False1")
            elif user_password[message[0]]!=message[1]:
                self.write_message("False2")
            else:
                self.write_message(message[0])

        elif message[-1] == '4':#获取房间号
            room = str(int(time.time() % 1000000000))
            while(room in romm_people):
                room = str(time.time() % 1000000000)
            self.write_message('R,'+room)
        elif message[-1] == '5':
            if message[0] not in room_password:
                self.write_message("False1")
            elif room_password[message[0]][1]=='':
                self.write_message("False2")
            else:
                self.write_message(room_password[message[0]][1])

        elif message[-1]=='6':#所有人信息
            self.write_message(self.update(message[0]))

        elif message[-1] == '7':  #更改推流
            user_name = message[0]
            user_room = message[1]
            if(user_name==room_password[user_room][0]):
                if message[2]=="audio":
                    room_state[user_room][user_name][1]=message[3]
                elif message[2]=="video":
                    room_state[user_room][user_name][2] = message[3]
                elif message[2] == "screen":
                    if message[3]=='0':
                        room_PB[user_room][0]='0'
                        room_state[user_room][user_name][3]='0'
                    else:
                        if(room_PB[user_room][0]=='1' or room_PB[user_room][1]=='1'):
                            self.write_message('False3')
                            return
                        else:
                            room_state[user_room][user_name][3] = '1'
                            room_PB[user_room][0]='1'
                elif message[2] == "screen2":
                    if message[3]=='0':
                        room_PB[user_room][1]='0'
                        room_state[user_room][user_name][4]='0'
                    else:
                        if (room_PB[user_room][0] == '1' or room_PB[user_room][1] == '1'):
                            self.write_message('False4')
                            return
                        else:
                            room_state[user_room][user_name][4] = '1'
                            room_PB[user_room][1] = '1'
                temp = room_state[user_room][user_name][1:5:]
                self.write_message('7#' + ",".join(temp))
                for i in room_state[user_room]:
                    room_state[user_room][i][0].write_message(self.update(user_room))
            else:
                if message[2]=="audio":
                    if romm_people[user_room][room_password[user_room][0]][0]=='0' and romm_people[user_room][user_name][0]=='0':
                        room_state[user_room][user_name][1]=message[3]
                    else:
                        self.write_message('False1')

                elif message[2]=="video":
                    if romm_people[user_room][room_password[user_room][0]][1] == '0' and romm_people[user_room][user_name][1] == '0':
                        room_state[user_room][user_name][2] = message[3]
                    else:
                        self.write_message('False2')
                elif message[2] == "screen":
                    if message[3]=='0':
                        room_PB[user_room][0]='0'
                        room_state[user_room][user_name][3]='0'
                    else:
                        if room_PB[user_room][0]=='1' or room_PB[user_room][1]=='1' or romm_people[user_room][user_name][2] == '1':
                            self.write_message('False3')
                            return
                        else:
                            room_state[user_room][user_name][3] = '1'
                            room_PB[user_room][0]='1'
                elif message[2] == "screen2":
                    if message[3]=='0':
                        room_PB[user_room][1]='0'
                        room_state[user_room][user_name][4]='0'
                    else:
                        if room_PB[user_room][0] == '1' or room_PB[user_room][1] == '1' or romm_people[user_room][user_name][3] == '1':
                            self.write_message('False4')
                            return
                        else:
                            room_state[user_room][user_name][4] = '1'
                            room_PB[user_room][1] = '1'
                temp = room_state[user_room][user_name][1:5:]
                self.write_message('7#' + ",".join(temp))
                for i in room_state[user_room]:
                    room_state[user_room][i][0].write_message(self.update(user_room))

        elif message[-1]=='8':#
            # 需要发送8#时间#名字#信息
            user_name = message[0]
            user_room = message[1]
            user_message=message[2]
            time_str = datetime.datetime.strftime(datetime.datetime.now(), '%H:%M:%S')
            for i in room_state[user_room]:
                if i!=user_name:
                    room_state[user_room][i][0].write_message('8#'+time_str+'#'+user_name+'#'+user_message)

        elif message[-1]=='@':#user_name + "," + user_room + "," + last_at + '@'   last_at是需要@的人
            user_name = message[0]
            user_room = message[1]
            last_at=message[2:-1:]
            for i in last_at:
                room_state[user_room][i][0].write_message('@,'+user_name)
       
        elif message[-1]=='g':#更新自己
            room_state[message[1]][message[0]][0]=self
        
        elif message[-1]=='s':#结束会议
            del room_password[message[0]]
            for i in room_state[message[0]]:
                room_state[message[0]][i][0].write_message('s')
            del room_state[message[0]]
            del romm_people[message[0]]
        
        elif message[-1] == 'a':#全体静音
            for i in room_state[message[0]]:
                room_state[message[0]][i][1]='0'
                temp = room_state[message[0]][i][1:5:]
                room_state[message[0]][i][0].write_message('7#' + ",".join(temp))
                room_state[message[0]][i][0].write_message(self.update(message[0]))
        
        elif message[-1]=='v':#全体关闭麦克风
            for i in room_state[message[0]]:
                room_state[message[0]][i][2]='0'
                temp = room_state[message[0]][i][1:5:]
                room_state[message[0]][i][0].write_message('7#' + ",".join(temp))
                room_state[message[0]][i][0].write_message(self.update(message[0]))
        
        elif message[-1]=='S':#离开会议
            # print(message)
            user_name = message[0]
            user_room = message[1]
            del room_state[user_room][user_name]
            # print(room_state)
            for i in room_state[user_room]:
                room_state[user_room][i][0].write_message(self.update(user_room))

        else:
            print('helseh')

    def update(self,my_user_room):
        user_name = room_password[my_user_room][0]
        my_message = '6' + '#' + user_name + ',' + room_state[my_user_room][user_name][1] + ',' + room_state[my_user_room][user_name][2]+','+\
                     room_state[my_user_room][user_name][3]+','+room_state[my_user_room][user_name][4]
        for i in room_state[my_user_room]:
            if i != user_name:
                my_message += '#' + i + ',' + room_state[my_user_room][i][1] + ',' + room_state[my_user_room][i][2]+ ',' + \
                              room_state[my_user_room][i][3] + ',' + room_state[my_user_room][i][4]
        return my_message

    def on_close(self):#连接断了执行
        print("WebSocket closed")
        self.users.discard(self)

    # 允许所有跨域通讯，解决403问题
    def check_origin(self, origin):
        return True

application = Application([(r"/MessageWSHandler", EchoWebSocket),(r"/Second", EchoWebSocket)],
                           static_path=os.path.join(os.path.dirname(__file__), "statics"))
application.listen(8080)
ioloop.IOLoop.current().start()
