import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark';
import html from 'remark-html';
import remarkImages from 'remark-images'


type MarkdownInfo = matter.GrayMatterFile<string> & { abstract?: string }

export interface Post {
    data: matter.GrayMatterFile<string>['data'];
    excerpt: string;
    slug: string
}


export class MarkdownParser {
    content: any
    md: MarkdownInfo

    constructor(path: string) {
        this.content = fs.readFileSync(path, 'utf-8')
        this.md = matter(this.content)
    }

    matterContent() {
        return matter(this.content)
    }

    abstractText() {
        return MarkdownParser.abstract(this.md.content, 140)
    }

    static abstract(md: string, length: number) {
        const str = md.replace(/(\*\*|__)(.*?)(\*\*|__)/g, '')          //全局匹配内粗体
            .replace(/\!\[[\s\S]*?\]\([\s\S]*?\)/g, '')                  //全局匹配图片
            .replace(/\[[\s\S]*?\]\([\s\S]*?\)/g, '')                    //全局匹配连接
            .replace(/<\/?.+?\/?>/g, '')                                 //全局匹配内html标签
            .replace(/(\*)(.*?)(\*)/g, '')                               //全局匹配内联代码块
            .replace(/`{1,2}[^`](.*?)`{1,2}/g, '')                       //全局匹配内联代码块
            .replace(/```([\s\S]*?)```[\s]*/g, '')                       //全局匹配代码块
            .replace(/\~\~(.*?)\~\~/g, '')                               //全局匹配删除线
            .replace(/[\s]*[-\*\+]+(.*)/g, '')                           //全局匹配无序列表
            .replace(/[\s]*[0-9]+\.(.*)/g, '')                           //全局匹配有序列表
            .replace(/(#+)(.*)/g, '')                                    //全局匹配标题
            .replace(/(>+)(.*)/g, '')                                    //全局匹配摘要
            .replace(/\r\n/g, "")                                        //全局匹配换行
            .replace(/\n/g, "")                                          //全局匹配换行
            .replace(/\s/g, "")                                          //全局匹配空字符;
        return str.slice(0, length);
    }
}

export function getMarkdownList(targetPath: string, result: Post[]) {
    const resultsDir = fs.readdirSync(targetPath)
    resultsDir.forEach(resultName => {
        const resultPath = path.join(targetPath, resultName)
        const stats = fs.statSync(resultPath)
        if (stats.isDirectory()) {
            getMarkdownList(resultPath, result)
            return
        }
        if (resultName.endsWith('.md')) {
            const file = new MarkdownParser(resultPath)
            const slug = resultPath.replace(path.resolve(process.cwd(), '../'), '').replace(/\/md|\.md|\/index\.md/ig, '')
            result.push({ data: file.md.data, excerpt: file.abstractText(), slug: slug })
        }
    })
    return result
}
