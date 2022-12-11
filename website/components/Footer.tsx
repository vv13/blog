import React from 'react'
import cx from 'classnames'
import site from '../config/site'


const FooterComp: React.FC<{ dark?: boolean }> = ({ dark }) => (
    <footer className={cx("text-center text-gray-400 text-xs pb-4", { 'bg-black': dark })}>
        {site.footerTxt} |{' '}
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">
            蜀ICP备17042657号
        </a>
    </footer>
)

export default FooterComp
