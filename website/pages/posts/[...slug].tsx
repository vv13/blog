import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import mermaid from 'mermaid'
import { escape2Html } from '../../utils'
import { Post } from '../../utils/mdParser'
import ReactMarkdown from 'react-markdown'
import remarkImages from 'remark-images'
import { getPost, getPosts } from '../../utils/server'
import Giscus from '@giscus/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export async function getStaticPaths() {
  const data = await getPosts()
  const paths = data.map((item: Post) => ({ params: { slug: item.slug.split('/').filter(item => item !== '') } }))
  return {
    paths: paths,
    fallback: false,
  }
}

export async function getStaticProps(context: any) {
  const { slug } = context.params
  const resData = await getPost(slug)
  if (!resData) {
    throw new Error('Not found post.')
  }
  return {
    props: {
      data: resData.data,
      content: resData.content,
      slug: slug.join('/')
    }
  }
}

const PostDetail: React.FC<{
  content: string
  data: {
    title?: string;
    date?: string;
    update_date?: string;
    tags?: string[]
  }
  slug: string
}> = ({ data, content, slug }) => {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement
      setIsDark(html.classList.contains('dark'))
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    setMounted(true)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.querySelectorAll('.mermaid').forEach((element, index) => {
      void mermaid.mermaidAPI
        .render('mermaid' + index, escape2Html(element.innerHTML))
        .then(({ svg }) => {
          element.innerHTML = svg
        })
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewImage(null)
      }
    }

    if (previewImage) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [previewImage])

  return (
    <MainLayout>
      <Head>
        <title>vv13 - {data.title}</title>
      </Head>

      <div className="w-full">
        <div className="border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-screen-xl mx-auto px-6 py-4">
            <Link
              href="/posts/"
              className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回博客列表
            </Link>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time>{data.date}</time>
            </div>
            {data.update_date && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>更新于 {data.update_date}</span>
              </div>
            )}
            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <article className="max-w-screen-xl mx-auto px-6 pb-12">
          <ReactMarkdown
            remarkPlugins={[remarkImages]}
            components={{
              img: function ({ node, ...props }) {
                const alt = node?.properties?.alt as string || ''
                let src = node?.properties?.src as string || ''
                const fileName = src.replace('./', '');
                if (!src.includes('http')) {
                  src = `/images/${slug}/${fileName}`;
                }

                return (
                  <figure className="my-8">
                    <button
                      type="button"
                      className="block mx-auto cursor-zoom-in"
                      onClick={() => setPreviewImage({ src, alt })}
                      aria-label={alt ? `放大查看图片：${alt}` : '放大查看图片'}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img {...props} src={src} alt={alt} className="rounded-lg shadow-md mx-auto" />
                    </button>
                    {alt && <figcaption className="text-center text-gray-500 dark:text-gray-400 text-sm mt-3">{alt}</figcaption>}
                  </figure>
                );
              },
              h1: (props) => <h1 {...props} className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700" />,
              h2: (props) => <h2 {...props} className="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800" />,
              h3: (props) => <h3 {...props} className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3" />,
              h4: (props) => <h4 {...props} className="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-2" />,
              p: (props) => <p {...props} className="text-gray-700 dark:text-gray-300 leading-8 mb-6" />,
              a: (props) => (
                <a
                  {...props}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                const isInline = inline || !className;
                if (isInline && inline) {
                  return (
                    <code
                      {...props}
                      className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-sm font-mono"
                    >
                      {children}
                    </code>
                  );
                }
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : 'text';
                return (
                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    PreTag="div"
                    customStyle={{
                      margin: '1rem 0',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
              pre: (props) => <pre {...props} className="m-0 p-0 bg-transparent" />,
              blockquote: (props) => (
                <blockquote
                  {...props}
                  className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 italic my-6 py-2 bg-gray-50 dark:bg-gray-800 rounded-r-lg"
                />
              ),
              ul: (props) => <ul {...props} className="list-disc list-outside ml-6 my-4 space-y-2" />,
              ol: (props) => <ol {...props} className="list-decimal list-outside ml-6 my-4 space-y-2" />,
              li: (props) => <li {...props} className="text-gray-700 dark:text-gray-300 leading-8" />,
              table: (props) => (
                <div className="overflow-x-auto my-6">
                  <table {...props} className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg" />
                </div>
              ),
              th: (props) => (
                <th
                  {...props}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                />
              ),
              td: (props) => (
                <td
                  {...props}
                  className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800"
                />
              ),
              hr: (props) => <hr {...props} className="my-12 border-gray-200 dark:border-gray-700" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setPreviewImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={previewImage.alt ? `图片预览：${previewImage.alt}` : '图片预览'}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-md bg-white/10 px-3 py-1.5 text-white hover:bg-white/20"
              onClick={() => setPreviewImage(null)}
              aria-label="关闭图片预览"
            >
              关闭
            </button>
            <div className="flex h-full w-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.src}
                alt={previewImage.alt}
                className="max-h-full max-w-full object-contain"
                onClick={(event) => event.stopPropagation()}
              />
            </div>
          </div>
        )}

        <div className="max-w-screen-xl mx-auto px-6 mb-16">
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            {mounted && (
              <Giscus
                id="comments"
                repo="vv13/blog"
                repoId="MDEwOlJlcG9zaXRvcnkxMjA2MzQ0Nzc="
                category="General"
                categoryId="DIC_kwDOBzC8bc4CTmyu"
                mapping="title"
                strict='0'
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={isDark ? 'dark' : 'light'}
                lang="zh-CN"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default PostDetail
