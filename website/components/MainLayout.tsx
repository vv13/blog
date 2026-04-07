import React, { PropsWithChildren } from 'react'
import Header from './Header'
import Footer from './Footer'

const MainLayout: React.FC<PropsWithChildren<{ dark?: boolean; hideFooter?: boolean }>> = ({ children, dark, hideFooter }) => {
  // 首页：浅色主题下也保持整页黑底（沉浸式 Hero）；其它页随主题白/深灰
  const shell =
    dark === true
      ? 'bg-black text-gray-100 dark:bg-gray-950 dark:text-gray-100'
      : 'bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100'

  return (
    <div className={shell}>
      <div className='min-h-screen flex flex-col px-0'>
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        {!hideFooter && <Footer immersive={dark === true} />}
      </div>
    </div>
  )
}

export default MainLayout
