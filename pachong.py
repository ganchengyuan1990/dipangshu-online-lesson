from flask import Flask, request, jsonify
from flask_cors import CORS
import requests; 
from bs4 import BeautifulSoup; 
from openai import OpenAI
import httpx
import re


app = Flask(__name__)

CORS(app, supports_credentials=True) 


def clean_text(text):
    # 保留中文、英文、数字、常用标点符号
    cleaned = re.sub(r'[^\u4e00-\u9fa5a-zA-Z0-9，。！？、：；''""（）《》\s]+', '', text)
    # 去除多余的空白字符
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned.strip()

# url='https://f.mnr.gov.cn/202406/t20240603_2847181.html'; 
# response=requests.get(url); 
# soup = BeautifulSoup(response.content.decode('utf-8'), 'html.parser')
# text_content = clean_text(soup.get_text()).strip()


def parse_qa(qa_text):
    qa_list = []
    current_qa = {}
    
    # 按行分割文本
    lines = qa_text.strip().split('\n')
    
    for line in lines:
        line = line.strip()
        if line.startswith('Q'):
            # 如果已有问题答案对，先保存
            if current_qa:
                qa_list.append(current_qa)
                current_qa = {}
            # 提取问题
            current_qa['question'] = line.split(':', 1)[1].strip()
        elif line.startswith('A'):
            # 提取答案
            current_qa['answer'] = line.split(':', 1)[1].strip()
    
    # 添加最后一组问答
    if current_qa:
        qa_list.append(current_qa)
    
    return qa_list


@app.route('/generate-qa', methods=['GET'])
# @cross_origin(origins=['*'])
def generate_qa():
    try:
        # 从查询参数获取 URL
        url = request.args.get('url')
        if not url:
            return jsonify({'error': 'URL parameter is required'}), 400
        
        # URL 解码已经由 Flask 自动处理，不需要额外处理
        
        # 其余代码保持不变
        response = requests.get(url)
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        content = soup.find('body')
        
        if not content:
            return jsonify({'error': 'Content not found'}), 404
        
        text_content = clean_text(content.get_text())

        client = OpenAI(
            api_key='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',
        )
        
        prompt = f"""
        请根据以下文本内容，生成3-5个问题和答案，格式如下：
        Q1: 问题1
        A1: 答案1
        Q2: 问题2
        A2: 答案2
        ...
        
        文本内容：
        {text_content}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "你是一个教育专家，善于提取文章重点并设计相关的问题。"},
                {"role": "user", "content": prompt}
            ]
        )

        print(response, '====response====')

        # client = OpenAI(api_key='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')
                
        # prompt = f"""
        # 请根据以下文本内容，生成3-5个问题和答案，格式如下：
        # Q1: 问题1
        # A1: 答案1
        # Q2: 问题2
        # A2: 答案2
        # ...
        
        # 文本内容：
        # {text_content}
        # """
        
        # response = client.chat.completions.create(
        #     model="gpt-3.5-turbo",
        #     messages=[
        #         {"role": "system", "content": "你是一个教育专家，善于提取文章重点并设计相关的问题。"},
        #         {"role": "user", "content": prompt}
        #     ]
        # )
        
        qa_result = parse_qa(response.choices[0].message.content)
        
        return jsonify({
            'success': True,
            'message': 'success',
            'status': 200,
            'data': qa_result
        })
        
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Failed to fetch URL: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

# openai.api_key ='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'

# prompt = f"""
# 请根据以下文本内容，生成3-5个问题和答案，格式如下：
# Q1: 问题1
# A1: 答案1
# Q2: 问题2
# A2: 答案2
# ...

# 文本内容：
# {text_content}
# """

# # 调用 API
# try:
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": "你是一个不动产方面的专家，善于提取文章重点并设计相关的问题。"},
#             {"role": "user", "content": prompt}
#         ]
#     )
    
#     # 打印生成的问题和答案
#     # print("\n=== 生成的问题和答案 ===")
#     # print(response.choices[0].message.content)

#     qa_result = parse_qa(response.choices[0].message.content)
    
#     # 打印结果
#     print("\n=== 生成的问题和答案 ===")
#     for i, qa in enumerate(qa_result, 1):
#         print(f"\n问题 {i}:")
#         print(f"问题：{qa['question']}")
#         print(f"答案：{qa['answer']}")
    
# except Exception as e:
#     print(f"API 调用出错: {str(e)}")