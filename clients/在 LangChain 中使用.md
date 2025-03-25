---
sidebar_position: 9
---

# 在 LangChain 中使用
下载地址：https://www.langchain.com/  
### 最简单的就是：直接设置环境变量代码如下

```
API_SECRET_KEY = "sk-pvMtoVO******66249058b93C766F2D70167"
BASE_URL = "https://aihubmix.com/v1"; #aihubmix的base-url

os.environ["OPENAI_API_KEY"] = API_SECRET_KEY
os.environ["OPENAI_BASE_URL"] = BASE_URL
```
注意：openai_api_base 的末尾要加上 /v1，  
```from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(
    openai_api_base="https://aihubmix.com/v1", # 注意，末尾要加 /v1
    openai_api_key="sk-3133f******fee269b71d",
)

res = llm.predict("hello")

print(res)
```
示例代码，使用LLM进行预测  
核心其实在于key和url的设置  
方法有：  
1. 使用环境变量来设置  
2. 使用变量来传入  
3. 使用手动设置环境变量     

```import os
import requests
import time
import json
import time

from langchain.llms import OpenAI

API_SECRET_KEY = "你在aihubmix的key";
BASE_URL = "https://aihubmix.com/v1"; #aihubmix的base-url

os.environ["OPENAI_API_KEY"] = API_SECRET_KEY
os.environ["OPENAI_API_BASE"] = BASE_URL

def text():
    llm = OpenAI(temperature=0.9)
    text = "What would be a good company name for a company that makes colorful socks?"
    print(llm(text))

if __name__ == '__main__':
    text();
    
```
运行后可以看到返回：  
```
Lively Socks.
```