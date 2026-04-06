import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import site from '../config/site'
import Helmet from '../components/Helmet'
import MainLayout from '../components/MainLayout'

const Index = () => (
  <MainLayout dark>
    <Helmet title={site.title} noSuffix />

    {/* Hero Banner Section */}
    <section className="relative w-full">
      <div className="flex w-full items-center justify-center flex-col bg-black">
        <Image
          width={1280}
          height={720}
          style={{ maxWidth: '100%', height: 'auto' }}
          src='/assets/banner.jpg'
          alt={''}
          priority
        />
      </div>

      {/* Intro Section - Overlapping Banner */}
      <div className="relative -mt-20 mx-auto max-w-3xl px-6 pb-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-soft-lg p-8 md:p-12 text-center animate-fade-in">
          {/* Avatar Placeholder */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            V
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            Hi, I&apos;m vv13
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 leading-relaxed">
            {site.footerTxt}
          </p>

          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            热爱编程，专注于前端开发和用户体验。<br />
            在这里分享我的技术心得和生活记录。
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/blog/"
              className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 shadow-md"
            >
              浏览博客
            </Link>
            <a
              href="https://github.com/vv13"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Content Section */}
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">探索更多</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-lg mx-auto">
          {/* Blog Card */}
          <Link href="/blog/" className="group block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 mb-4 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white">博客文章</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">技术分享、学习笔记、生活感悟</p>
          </Link>

          {/* GitHub Card */}
          <a
            href="https://github.com/vv13"
            target="_blank"
            rel="noreferrer"
            className="group block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 mb-4 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white">开源项目</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">GitHub 上的开源作品和代码片段</p>
          </a>
        </div>
      </div>
    </section>
  </MainLayout>
)

export default Index
