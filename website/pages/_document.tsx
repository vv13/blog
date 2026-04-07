import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <link
          rel="icon"
          type="image/png"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon-32.ico`}
          sizes="32x32"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const root = document.documentElement;
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'light') {
                  root.classList.remove('dark');
                } else if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  root.classList.add('dark');
                } else {
                  root.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
