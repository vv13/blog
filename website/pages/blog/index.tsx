import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import Pagination from '../../components/Pagination'
import Helmet from '../../components/Helmet'
import { Post } from '../../utils/mdParser'
import styles from './index.module.css'
import { getPosts } from '../../utils/server'


export async function getStaticProps() {
    const posts = await getPosts()
    return {
        props: {
            posts
        }
    }
}

const BlogList: React.FC<{ posts: Post[] }> = ({ posts }) => {
    const [pageInfo, setPageInfo] = useState({ pageSize: 10, currentPage: 1, totalCount: posts.length, pageCount: Math.ceil(posts.length / 10) })
    const currentPosts = useMemo(() => {
        const start = (pageInfo.currentPage - 1) * pageInfo.pageSize
        return posts.slice(start, start + pageInfo.pageSize)
    }, [pageInfo, posts])

    return (
        <MainLayout>
            <Helmet title="博客" />

            {/* Header Section */}
            <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 px-6">
                <div className="max-w-screen-xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                        博客
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
                        记录技术学习路上的点点滴滴，分享编程心得与生活感悟
                    </p>
                </div>
            </div>

            {/* Blog Posts List */}
            <div className="max-w-screen-xl mx-auto px-6 py-12">
                <div className="space-y-4">
                    {currentPosts.map((node, index) => (
                        <article
                            key={node.slug}
                            className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <Link href={`/blog/post${node.slug}`}>
                                <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-6">
                                    {/* Date & Tags */}
                                    <div className="flex-shrink-0 w-full md:w-32 lg:w-40">
                                        <time className="text-sm text-gray-400 font-mono">
                                            {node.data.date}
                                        </time>
                                        {node.data.tags && node.data.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {node.data.tags.slice(0, 3).map((tag: string) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & Excerpt */}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors duration-200 mb-2 truncate">
                                            {node.data.title}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                            {node.excerpt}
                                        </p>
                                    </div>

                                    {/* Arrow Icon */}
                                    <div className="flex-shrink-0 self-center">
                                        <svg
                                            className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200 transform group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-12">
                    <Pagination
                        pageInfo={pageInfo}
                        onChange={(page: number) => setPageInfo({ ...pageInfo, currentPage: page })}
                    />
                </div>

                {/* Empty State */}
                {currentPosts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}

export default BlogList
