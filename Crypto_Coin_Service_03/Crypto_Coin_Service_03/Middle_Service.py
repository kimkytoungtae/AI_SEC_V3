import base64

from flask import Flask,render_template,request,json,jsonify

# 서버랑 렌더 요청하는 패키지들을 가져옴+ 파일을 json으로 전송하겠다( dict와 상호작용하기 좋음)

app = Flask(__name__)
#클라이언트로부터 데이터받기
@app.route("/") #index.html불러오기
def root_connect():
    return render_template("index.html")
@app.route("/myinfo",methods=["post"]) #post방식으로 데이터받기
def my_info():
    myname=(request.form.get("myname"))
    age=(request.form.get("age"))
    return render_template("join.html",myname=myname,age=age)
@app.route("/getimg/<imgname>")
def getimage(imgname="tiger.jpg"):
    with open(f"static/img/{imgname}","rb") as fp:
        img_byte=fp.read()
        #이미지를 byte 값으로 읽어들어 아스키 인코딩후 완성형 문자로 전송과정
        encoded = base64.b64encode(img_byte).decode("utf-8")
    return f"data:image/jpg;base64,{encoded}"
@app.route("/aaa")
def aaa():
    return "aaa를 찾으셨군요!"

@app.route("/bbb/<name>",methods=["get"])#get함수 써서
@app.route("/ccc/<name>",methods=["get"])
def get_param(name):
    print("bbb에 데이터를 보냈습니다",name)
    return f"{name}님 환영합니다"

@app.route("/fff")
def get_querystring():
    name=request.args.get("name")
    age=request.args.get("age")
    return f"이름:{name} 나이: {age}"
@app.route("/jtest")
def jsondata_test():
    return render_template("jtest.html")
@app.route("/jtest/jdata",methods=["post"])
def get_jdata():
    jdict=(request.get_json())
    print(jdict["myname"])
    print(jdict["age"])
    return jsonify(jdict)
app.run("127.0.0.1",port=4321,debug=True)


