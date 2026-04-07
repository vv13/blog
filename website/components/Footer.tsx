import React from 'react'
import cx from 'classnames'
import site from '../config/site'

const FooterComp: React.FC<{ immersive?: boolean }> = ({ immersive }) => (
    <footer
      className={cx(
        'text-center py-8 px-6 border-t text-xs',
        immersive
          ? 'border-gray-800 bg-black text-gray-400'
          : 'border-gray-100 bg-white text-gray-500 dark:border-gray-800 dark:bg-black dark:text-gray-400'
      )}
    >
        <div className="max-w-screen-xl mx-auto">
            <p className="mb-2">{site.footerTxt}</p>
            <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noreferrer"
                className={cx(
                  'hover:underline',
                  immersive
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
            >
                蜀 ICP 备 17042657 号
            </a>
        </div>
    </footer>
)

export default FooterComp
