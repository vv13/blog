import os
import json
import string
import re
from typing import Dict, List

md_path = './md'
md_target = './README.md'


def get_category_posts():
    generate_obj = {}
    for category in os.listdir(md_path):
        if category == 'draft':
            continue
        rootDir = os.path.join(md_path, category)
        posts = []
        if not os.path.isdir(rootDir):
            continue

        for file_name in os.listdir(rootDir):
            file_path = os.path.join(rootDir, file_name)
            if os.path.isdir(file_path):
                dir_index = os.path.join(file_path, 'index.md')
                if os.path.exists(dir_index):
                    # posts.append(dir_index)
                    posts.append(dir_index.encode().decode(encoding='utf-8'))
            elif os.path.isfile(file_path) and file_name.endswith('.md'):
                posts.append(file_path.encode().decode(encoding='utf-8'))

        generate_obj[category] = posts
    return generate_obj


def getLatest10(categoryObj: Dict[str, List[int]]):
    strs = ''
    posts: List[str] = getSortedPost(
        [i for j in categoryObj.values() for i in j])
    for post in posts[:10]:
        strs += generatePost(post)
    return strs


def generatePost(post: str):
    if post.endswith('index.md'):
        return '- [{name}]({url})\n'.format(
            name=re.findall('(\d{8}.*?)/index.md', post)[0], url=post)
    else:
        return '- [{name}]({url})\n'.format(
            name=re.findall('(\d{8}.*?).md', post)[0], url=post)


def getCategoryStr(categoryObj: Dict[str, List[int]]):
    strs = ''
    for key, values in categoryObj.items():
        strs += '### ' + key + '\n'
        for post in getSortedPost(values):
            strs += generatePost(post)
    return strs


def getSortedPost(posts: List[str]):
    return sorted(posts, key=lambda x: re.findall(r"\d{8}", x), reverse=True)


category_obj = get_category_posts()
file = open(md_target, 'w')
t = string.Template(open('./generate_readme/README_TEMPLATE.md', 'r').read())
data = {'latest': getLatest10(category_obj),
        'categoryPost': getCategoryStr(category_obj)}
file.write(t.safe_substitute(data))
file.close()
