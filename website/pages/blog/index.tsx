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
        <MainLayout dark={false}>
            <Helmet title="博客" />
            {currentPosts.map((node) => (
                <article key={node.slug} className="mb-2.5">
                    <div className={styles.ListItemWrap}>
                        <div className={styles.ListItemHeader}>
                            <div>{node.data.date}</div>
                            <div>{node.data.tags}</div>
                        </div>
                        <div>
                            <Link className={styles.titleColor} href={`/blog/post${node.slug}`}>{node.data.title}</Link>
                            <div className={styles.excerpt}>{node.excerpt}</div>
                        </div>
                    </div>
                    <p className={styles.mobileExcerpt}>{node.excerpt}</p>
                </article>
            ))}
            <Pagination pageInfo={pageInfo} onChange={(page: number) => setPageInfo({ ...pageInfo, currentPage: page })} />
        </MainLayout>
    )
}

export default BlogList
