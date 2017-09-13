from collections import Counter
import sys
import re
import requests
import json
import math
import datetime
import time
from random import randint


host="http://anny.me:4003"

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


forHours=4

# get trending urls
url = host+"/feed"
trendingUrls=[]
headers = {
    'authorization': authKey,
    'Content-type': "application/json",
    'cache-control': "no-cache",
    'Accept': 'application/json',

    }
query = {"trending":'true',"$limit":"1000"}
response = requests.request("GET", url, headers=headers, params=query)

# print response.text
# sys.exit()
for value in response.json()['data']:
    trendingUrls.append(value['_id'])
print "trendingUrls"

#trending urls ends

# sys.exit()


# get stop words
url = host+"/stopwords"
querystring = {"$limit":"10000"}
headers = {
    'cache-control': "no-cache",
    }
response = requests.request("GET", url, headers=headers, params=querystring)
json_data = json.loads(response.text)
totalPages=int(math.ceil(json_data['total'] / 100.0)) * 100
i=0
stopWords=[]

while totalPages>=i:
    if i % 100 == 0:
        querystring = {"$skip":i,"$limit":100}
        response = requests.request("GET", url, headers=headers,params=querystring)
        json_data = json.loads(response.text)
        if len(json_data['data'])>0:
            for value1 in json_data['data']:
                stopWords.append(value1['word'])
    i=i+1

# stop words ends

url = host+"/feedstore/"

headers = {
    'authorization': authKey,
    'content-type': "application/json",
    'cache-control': "no-cache",
    }
last8hours = datetime.datetime.now() - datetime.timedelta(hours=forHours)

toPast= format(last8hours,'%Y-%m-%dT%H:%M:%S.%fZ')
querystring = {"feedId[$in]":trendingUrls}


response = requests.request("GET", url, headers=headers,params=querystring)
json_data = json.loads(response.text)
totalPages=int(math.ceil(json_data['total'] / 100.0)) * 100
i2=0
colectedData=[]
totalPages=200

while totalPages>i2:
    if i2 % 100 == 0:
        querystring = {"$skip":i2,"$limit":100,"feedId[$in]":trendingUrls,"$sort[createdAt]":"-1"}
        response1 = requests.request("GET", url, headers=headers,params=querystring)
        json_data1 = json.loads(response1.text)
        if len(json_data1['data'])>0:
            for value1 in json_data1['data']:
                colectedData.append(value1)
        else:
            print "else"
    i2=i2+1
word_list=[]
# print colectedData
print len(colectedData)
for value in colectedData:
    title=value['title']
    try:
        explode=title.lower().split()
        for word in explode:
            word = re.sub(r'\W+', '', word,flags=re.U)
            if len(word) >= 3 and word not in stopWords:
                word_list.append(word)
    except Exception as e:
        print e



c = Counter(word_list)
cw= c.most_common(10)

# cw= c.most_common(500)
url = host+"/trending"
# url = host+"/stopwords"
headers = {
    'content-type': "application/json",
    'cache-control': "no-cache",
    'charset':'UTF-8'
    }
for c in reversed(cw):
    if c[1]>=4:
        print c[0]
        time.sleep(1)
        payload = {'word':c[0],'count':c[1]}
        payload= json.dumps(payload)
        response = requests.request("POST", url, data=payload, headers=headers)
    else:
        print "else;",c[0]
