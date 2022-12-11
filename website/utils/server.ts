import path from "path"
import fs from 'fs'
import { getMarkdownList, MarkdownParser } from "./mdParser"

export const getPosts = () => {
    const markdownPath = path.join(path.resolve(process.cwd()), '../md')
    const allMarkdownFiles = getMarkdownList(markdownPath, [])

    // Desc Sort
    allMarkdownFiles.sort((prev, next) => {
        const prevTime = prev.data?.date
        const nextTime = next.data?.date
        if (!prevTime || !nextTime) return 0
        return new Date(nextTime).getTime() - new Date(prevTime).getTime()
    })
    return allMarkdownFiles
}

export const getPost = (slug: string[]) => {
    if (!(slug instanceof Array)) {
        return null
    }

    const sourcePath = path.join(path.resolve(process.cwd()), '../md', slug?.join('/'))

    let filePath: string
    if (fs.existsSync(sourcePath + '.md')) {
        filePath = sourcePath + '.md'
    } else if (fs.existsSync(path.join(sourcePath, '/index.md'))) {
        filePath = path.join(sourcePath, '/index.md')
    } else {
        return null
    }
    const parser = new MarkdownParser(filePath)
    return parser.md
}
