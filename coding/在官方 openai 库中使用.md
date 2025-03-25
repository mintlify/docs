---
sidebar_position: 1.5
---

# 在官方 openai 库中使用

此处为最新OpenAI包调用方式  
```
from openai import OpenAI

client = OpenAI(
    # #将这里换成你在aihubmix api keys拿到的密钥
    api_key="sk-xxx",
    # 这里将官方的接口访问地址，替换成aihubmix的入口地址
    base_url="https://aihubmix.com/v1"
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Say this is a test",
        }
    ],
    model="gpt-3.5-turbo",
)

print(chat_completion)
```
其他的方式和官方是一样的，只是改一个URL和key用我们的；具体API调用方法请查看官方文档即可。