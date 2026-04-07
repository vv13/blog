import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import site from '../config/site'
import Helmet from '../components/Helmet'
import MainLayout from '../components/MainLayout'

const HELLO_TEXT = '你好，我是 vv13，一名专注前端与用户体验的开发者。'
const DESC_TEXT = '这里主要记录前端工程实践、性能优化、交互设计思考，以及开发过程中的问题复盘与解决方案。'

const Index = () => {
  const [typedHello, setTypedHello] = useState('')
  const [typedDesc, setTypedDesc] = useState('')
  const [phase, setPhase] = useState<'idle' | 'hello' | 'showQuestion2' | 'desc' | 'done'>('idle')
  const [draftMessage, setDraftMessage] = useState('')

  useEffect(() => {
    if (phase === 'idle') {
      const timer = window.setTimeout(() => setPhase('hello'), 2000)
      return () => window.clearTimeout(timer)
    }

    const typeByChar = (
      sourceText: string,
      currentText: string,
      updateText: (text: string) => void,
      onDone: () => void
    ) => {
      if (currentText.length >= sourceText.length) {
        onDone()
        return
      }

      const nextIndex = currentText.length + 1
      const nextText = sourceText.slice(0, nextIndex)
      const prevChar = sourceText[nextIndex - 1] || ''
      const delay = /[,.!?，。！？、]/.test(prevChar) ? 210 : 60
      const timer = window.setTimeout(() => updateText(nextText), delay)
      return () => window.clearTimeout(timer)
    }

    if (phase === 'hello') {
      return typeByChar(HELLO_TEXT, typedHello, setTypedHello, () => setPhase('showQuestion2'))
    }

    if (phase === 'showQuestion2') {
      const timer = window.setTimeout(() => setPhase('desc'), 280)
      return () => window.clearTimeout(timer)
    }

    if (phase === 'desc') {
      return typeByChar(DESC_TEXT, typedDesc, setTypedDesc, () => setPhase('done'))
    }
  }, [phase, typedHello, typedDesc])

  const handlePublish = () => {
    const content = draftMessage.trim()
    if (!content) return
    const subject = encodeURIComponent('来自博客访客的新消息')
    const body = encodeURIComponent(content)
    window.location.href = `mailto:zwhvv13@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <MainLayout dark>
      <Helmet title={site.title} noSuffix />

      <section className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/15 via-black/45 to-[#05070c]/90" />
        <div className="pointer-events-none absolute -left-24 top-20 z-[1] h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 z-[1] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Image
            width={1280}
            height={720}
            style={{ maxWidth: '100%', height: 'auto' }}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/banner.jpg`}
            alt=''
            priority
          />
        </div>

        <div className="absolute inset-0 z-[2] mx-auto flex w-full max-w-5xl items-center px-6 py-16 md:left-1/2 md:-translate-x-1/2 md:py-20">
          <div className="flex w-full flex-col gap-3">
            {phase !== 'idle' && (
              <div className="animate-slide-up ml-auto flex max-w-[88%] items-end gap-2">
                <div className="rounded-2xl rounded-tr-md border border-white/10 bg-slate-700/40 px-4 py-3 text-sm text-slate-100 backdrop-blur-md md:text-base">
                  你好，怎么称呼你？
                </div>
                <span className="mb-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-slate-200/90" />
              </div>
            )}

            {phase !== 'idle' && (
              <div className="animate-slide-up flex max-w-[90%] items-end gap-2">
                <span className="mb-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-300/90" />
                <div className="rounded-2xl rounded-tl-md border border-blue-200/20 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 backdrop-blur-md md:text-base">
                  {typedHello}
                  {phase === 'hello' && <span className="ml-0.5 inline-block animate-pulse text-blue-300">|</span>}
                </div>
              </div>
            )}

            {(phase === 'showQuestion2' || phase === 'desc' || phase === 'done') && (
              <div className="animate-slide-up ml-auto flex max-w-[88%] items-end gap-2">
                <div className="rounded-2xl rounded-tr-md border border-white/10 bg-slate-700/40 px-4 py-3 text-sm text-slate-100 backdrop-blur-md md:text-base">
                  这个网站会分享哪些内容？
                </div>
                <span className="mb-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-slate-200/90" />
              </div>
            )}

            {(phase === 'desc' || phase === 'done') && (
              <div className="animate-slide-up flex max-w-[94%] items-end gap-2">
                <span className="mb-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-300/90" />
                <div className="rounded-2xl rounded-tl-md border border-blue-200/20 bg-slate-900/70 px-4 py-3 text-sm leading-7 text-slate-100 backdrop-blur-md md:text-base">
                  {typedDesc}
                  {phase === 'desc' && <span className="ml-0.5 inline-block animate-pulse text-blue-300">|</span>}
                </div>
              </div>
            )}

            {phase !== 'idle' && phase !== 'done' && (
              <div className="mt-1 flex items-center gap-2 pl-1 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-300" />
                正在输入...
              </div>
            )}

            {phase === 'done' && (
              <div className="animate-slide-up ml-auto mt-6 flex w-full max-w-[92%] items-end gap-2">
                <div className="w-full rounded-2xl rounded-tr-md border border-white/10 bg-slate-700/50 px-3 py-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <input
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          handlePublish()
                        }
                      }}
                      placeholder="输入你想交流的内容..."
                      className="w-full bg-transparent px-1 text-sm text-slate-100 placeholder:text-slate-400/80 focus:outline-none md:text-base"
                      aria-label="输入消息内容"
                    />
                    <button
                      type="button"
                      onClick={handlePublish}
                      className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-slate-100 transition hover:bg-slate-900/80 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="发布并发送邮件"
                      disabled={!draftMessage.trim()}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 12l16-8-4 16-4-6-8-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <span className="mb-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-slate-200/90" />
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

export default Index
