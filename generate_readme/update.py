import os
import string
import re
from typing import Dict, List, Optional

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


def _table_cell(text: str) -> str:
    return text.replace('|', '\\|').replace('\n', ' ')


def _table_row(post: str) -> Optional[str]:
    meta = _parse_post_meta(post)
    if not meta:
        return None
    date_fmt, category, title, link = meta
    return '| {d} | {c} | [{t}]({l}) |'.format(
        d=_table_cell(date_fmt),
        c=_table_cell(category),
        t=_table_cell(title),
        l=link,
    )


def _posts_table(posts: List[str]) -> str:
    lines = ['| 时间 | 类别 | 标题 |', '| --- | --- | --- |']
    for post in posts:
        row = _table_row(post)
        if row:
            lines.append(row)
    return '\n'.join(lines) + '\n'


def getLatest10(categoryObj: Dict[str, List[str]]):
    posts: List[str] = getSortedPost(
        [i for j in categoryObj.values() for i in j])[:10]
    return _posts_table(posts)


def _readme_link(path: str) -> str:
    p = path.replace('\\', '/')
    if p.startswith('./'):
        return p
    return './' + p.lstrip('/')


def _parse_post_meta(post: str):
    post_norm = post.replace('\\', '/')
    m = re.search(
        r'md/([^/]+)/(\d{8})_(.+?)(?:/index\.md|\.md)$',
        post_norm,
    )
    if not m:
        return None
    category, ymd, title = m.group(1), m.group(2), m.group(3)
    date_fmt = f'{ymd[:4]}-{ymd[4:6]}-{ymd[6:8]}'
    return date_fmt, category, title, _readme_link(post_norm)


def getCategoryStr(categoryObj: Dict[str, List[str]]):
    strs = ''
    for key, values in categoryObj.items():
        strs += '### ' + key + '\n\n'
        strs += _posts_table(getSortedPost(values))
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
