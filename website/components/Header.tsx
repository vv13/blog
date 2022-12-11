import React, { useState } from "react";
import Link from 'next/link'
import cx from 'classnames'

const menus = [{
  title: 'Note - 飞行笔记',
  link: 'https://github.com/vv13/dojo/issues/created_by/vv13'
}, {
  title: 'Github - 开源作品',
  link: 'https://github.com/vv13'
}, {
  title: 'Gist - 代码片段',
  link: 'https://gist.github.com/vv13'
}, {
  title: 'Photo - 生活碎片',
  link: 'https://www.icloud.com.cn/sharedalbum/zh-cn/#B0R5n8hH4uLD7Cy'
}]

const HeaderComp: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <header className={cx("flex w-full items-center h-20 px-0 py-3 justify-between px-5", { "bg-black": dark, "text-white": dark })}>
      <Link className="no-underline" href="/">vv13</Link>
      <section>
        <Link href="/blog/">博客</Link>
        <span
          onClick={() => setShowMenu(!showMenu)}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
          className="relative ml-5 pt-5 select-none"
        >
          更多
          <i
            className="iconfont icon-menu ml-1.5"
          />
          <div className="absolute pt-10 top-5 right-0" style={{ display: showMenu ? "block" : "none" }}>
            <ul className="list-none m-0 ">
              {menus.map(menu => (
                <li key={menu.title} className="w-52 h-8 text-right">
                  <a
                    target="_blank"
                    href={menu.link}
                    rel="noreferrer"
                    className={dark ? 'bg-black': 'bg-white'}
                  >
                    {menu.title}
                    <i className="iconfont icon-link ml-1.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </span>
      </section>
    </header>
  );
};

export default HeaderComp;
