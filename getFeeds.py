from collections import Counter
import sys
import re
import requests
import json
import datetime
from random import randint
reload(sys)
sys.setdefaultencoding('utf8')


# get all feeds
host= "http://anny.me:4003"

def fetchNow(id):
    f = '%Y-%m-%d %H:%M:%S'
    now = datetime.datetime.now()
    updatedAtNow= format(now,f)
    url=host+"/feed/"+id

    headers = {
        'authorization': authKey,
        'cache-control': "no-cache",
        'content-type': "application/json"

        }
    payload = {"updatedAt":updatedAtNow}
    payload= json.dumps(payload)
    print payload
    response = requests.request("PATCH", url, data=payload ,headers=headers)


def auth():
    url = host+"/authentication"

    payload = "{\n\t\"strategy\":\"local\",\n\t\"email\":\"dban@x.me\",\n\t\"password\":\"dban\"\n}"
    headers = {
    'content-type': "application/json",
    'cache-control': "no-cache"
    }

    response = requests.request("POST", url, data=payload, headers=headers)
    json_data = json.loads(response.text)
    if json_data.has_key('accessToken'):
        accessToken = open("jwt.txt", "w")
        accessToken.write(json_data['accessToken'])
        accessToken.close()
        return json_data['accessToken']


def isKeyWalid(authKey):
    url = host+"/users"
    headers = {
        'authorization': authKey,
        'cache-control': "no-cache"
        }
    response = requests.request("GET", url, headers=headers)
    json_data = json.loads(response.text)
    if json_data.has_key('code'):
        if json_data['code']==401:
            print json_data['message']
            authKey = auth()
    else:
        authKey = authKey

try:
    with open('jwt.txt') as f:
        key = f.readlines()
        authKey=key[0]
        isKeyWalid(authKey)
except Exception as e:
     authKey = auth()

# url = "http://pro.me:4000/feed/"
url = host+"/feed/"
headers = {
    'authorization': authKey,
    'cache-control': "no-cache"
    }
querystring = {"$limit":"500"}

response = requests.request("GET", url, headers=headers,params=querystring)
json_data = json.loads(response.text)

f = '%Y-%m-%d %H:%M:%S'
# f = '%Y-%m-%dT%H:%M:%S.%fZ'





for value in json_data['data']:
    updatedAt= datetime.datetime.strptime(value['updatedAt'], f)
    now = datetime.datetime.now()
    nightShift = datetime.datetime.now()
    hour= format(nightShift,'%H')
    delayMe=value['delay']
    # print "delayMe",delayMe
    if int(hour)>=2 and int(hour)<=5:
        if delayMe<=60:
            delayMe=delayMe+60
            # print "bigger",delayMe
    # print "next update",updatedAt+datetime.timedelta(minutes = delayMe)
    updatedAt_plus_fetch_time= updatedAt + datetime.timedelta(minutes = delayMe)
    if now>=updatedAt_plus_fetch_time:
        if value['followersCount']>0:
            print "fetch"
            print value['_id']
            fetchNow(value['_id'])
        else:
            if value.has_key('feedName'):
                print "no one follows",value['_id'],value['feedName']
            else:
                print "no one follows",value['_id'],value['feedUrl']

    else:
        print "next update for: ",value['feedUrl']," " ,updatedAt_plus_fetch_time-now

# print(response.text)
