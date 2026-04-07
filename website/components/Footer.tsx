import React from 'react'
import site from '../config/site'


const FooterComp: React.FC = () => (
    <footer className="text-center py-8 px-6 border-t bg-white dark:bg-black text-gray-500 dark:text-gray-400 text-xs border-gray-100 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto">
            <p className="mb-2">{site.footerTxt}</p>
            <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
                蜀 ICP 备 17042657 号
            </a>
        </div>
    </footer>
)

export default FooterComp
