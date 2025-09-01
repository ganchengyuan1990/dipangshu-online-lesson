from openai import OpenAI
client = OpenAI(
    base_url="http://47.236.159.224/v1",
    api_key="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",
)
prompt = f"""
请根据以下文本内容，生成3-5个问题和答案，格式如下：
Q1: 问题1
A1: 答案1
Q2: 问题2
A2: 答案2
...

文本内容：
你试试是的是的是的是的手打
"""

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "你是一个教育专家，善于提取文章重点并设计相关的问题。"},
        {"role": "user", "content": prompt}
    ]
)
print(response)