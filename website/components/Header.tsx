import React, { useEffect, useState } from "react";
import Link from 'next/link'
import cx from 'classnames'
import { useRouter } from "next/router";

const HeaderComp: React.FC = () => {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement;
      const dark = html.classList.contains('dark');
      setIsDark(dark);
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const nextDark = !html.classList.contains('dark');
    html.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
  };

  const isActive = router.pathname.startsWith('/posts');
  const isHome = router.pathname === '/';
  const isHomeHero = isHome && !scrolled;

  const navLinkClasses = cx(
    'relative text-sm font-medium transition-colors duration-200',
    isHomeHero
      ? (isActive ? 'text-white' : 'text-white/85 hover:text-white')
      : (isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white')
  );

  const activeIndicator = "after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-current after:rounded-full";

  const headerClasses = cx(
    'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
    scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-black/90' : 'bg-transparent'
  );

  return (
    <header className={headerClasses}>
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          className={cx(
            'text-xl font-bold tracking-tight no-underline transition-opacity hover:opacity-70',
            isHomeHero ? 'text-white drop-shadow-md' : 'text-gray-900 dark:text-white'
          )}
          href="/"
        >
          vv13
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/posts/"
            className={cx(navLinkClasses, { [activeIndicator]: isActive })}
          >
            博客
          </Link>
          <a
            href="https://github.com/vv13"
            target="_blank"
            rel="noreferrer"
            className={cx(
              'flex items-center space-x-1.5 text-sm font-medium transition-colors duration-200',
              isHomeHero ? 'text-white/85 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>GitHub</span>
          </a>
          {!isHome && (
            <button
              type="button"
              onClick={toggleTheme}
              className={cx(
                'p-2 rounded-lg transition-colors duration-200',
                'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderComp;
