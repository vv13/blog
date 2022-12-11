import React, { useEffect } from 'react'
import Head from 'next/head'
import MainLayout from '../../../components/MainLayout'
import mermaid from 'mermaid'
import { escape2Html } from '../../../utils'
import { Post } from '../../../utils/mdParser'
import ReactMarkdown from 'react-markdown'
import 'github-markdown-css/github-markdown-light.css'
import { getPost, getPosts } from '../../../utils/server'


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

const BlogPost: React.FC<{
    content: string
    data: {
        title?: string;
        date?: string;
        update_date?: string;
        tags?: string[]
    }
    slug: string
}> = ({ data, content, slug }) => {
    useEffect(() => {
        document.querySelectorAll('.mermaid').forEach((element, index) => {
            mermaid.mermaidAPI.render(
                'mermaid' + index,
                escape2Html(element.innerHTML),
                (svgCode) => {
                    element.innerHTML = svgCode
                },
                element
            )
        })
    }, [])
    return (
        <MainLayout>
            <Head>
                <title>vv13 - ${data.title}</title>
            </Head>
            <div className='px-0'>
                <h1 className='text-center border-b-0 pb-8 text-3xl font-bold'>
                    {data.title}
                </h1>
                <div className={'mx-auto markdown-body max-w-screen-lg  p-5'}>
                    <ReactMarkdown
                        components={{
                            img: function ({ node }) {
                                const alt = node.properties!.alt as string
                                let src = node.properties!.src as string || ''
                                const fileName = src.replace('./', '');
                                if (!src.includes('http')) {
                                    src = `/images/${slug}/${fileName}`;
                                }

                                return <img src={src} alt={alt} className="m-auto py-3" />;
                            },
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </MainLayout>
    )
}

export default BlogPost
