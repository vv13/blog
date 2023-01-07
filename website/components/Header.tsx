import React, { PropsWithChildren, useState } from "react";
import Link from 'next/link'
import cx from 'classnames'

const toolMenus = [{
  title: '照片 Exif 摘要',
  link: 'https://photo-exif-viewer.vercel.app'
}]

const moreMenus = [{
  title: 'Note - 飞行笔记',
  link: 'https://github.com/vv13/dojo/issues/created_by/vv13'
}, {
  title: 'Github - 开源作品',
  link: 'https://github.com/vv13'
}, {
  title: 'Gist - 代码片段',
  link: 'https://gist.github.com/vv13'
}]

const MenuBar: React.FC<PropsWithChildren<{ dark?: boolean; menus: { title: string; link: string }[] }>> = ({ dark, children, menus }) => {
  const [showMenu, setShowMenu] = useState(false);
  return <div
    onClick={() => setShowMenu(!showMenu)}
    onMouseEnter={() => setShowMenu(true)}
    onMouseLeave={() => setShowMenu(false)}
    className="relative ml-5 select-none"
  >
    {children}
    <i
      className="iconfont icon-menu ml-1.5"
    />
    <div className="absolute pt-3 top-5 right-0" style={{ display: showMenu ? "block" : "none" }}>
      <ul className="list-none m-0 ">
        {menus.map(menu => (
          <li key={menu.title} className="w-40 h-8 text-right">
            <a
              target="_blank"
              href={menu.link}
              rel="noreferrer"
              className={dark ? 'bg-black' : 'bg-white'}
            >
              {menu.title}
              <i className="iconfont icon-link ml-1.5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
}

const HeaderComp: React.FC<{ dark?: boolean }> = ({ dark }) => {
  return (
    <header className={cx("flex w-full items-center h-20 px-0 py-3 justify-between px-5", { "bg-black": dark, "text-white": dark })}>
      <Link className="no-underline" href="/">{!dark && 'vv13'}</Link>
      <section className="flex items-center">
        <Link href="/blog/">博客</Link>
        <MenuBar dark={dark} menus={toolMenus}>工具箱</MenuBar>
        <MenuBar dark={dark} menus={moreMenus}>更多</MenuBar>
      </section>
    </header>
  );
};

export default HeaderComp;
