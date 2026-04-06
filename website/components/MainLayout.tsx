import React, { PropsWithChildren, useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'

const MainLayout: React.FC<PropsWithChildren<{ dark?: boolean }>> = ({ children, dark }) => {
  const [mounted, setMounted] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement
      const dark = html.classList.contains('dark')
      setIsDarkTheme(dark)
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    setMounted(true)
    return () => observer.disconnect()
  }, [])

  // 页面级的 dark 属性仅用于控制 Banner 等特定区域的背景色（如首页）
  const hasDarkBanner = dark !== undefined ? dark : false

  return (
    <div className={mounted && isDarkTheme ? 'bg-gray-950' : (hasDarkBanner ? 'bg-black' : 'bg-white')}>
      <div className='min-h-screen flex flex-col px-0'>
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
