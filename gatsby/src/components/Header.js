import React, { useState } from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

const Header = styled.header`
    display: flex;
    width: 100%;
    height: 5em;
    padding: 0 1em;
    line-height: 5em;
    font-size: 1rem;
    justify-content: space-between;
    a {
        color: ${(props) => (props.dark ? '#fff' : '#000')};
        text-decoration: none;
        background-color: ${(props) => (props.dark ? 'inherit' : '#fff')};;
    }
    section > a {
        margin-left: 2em;
        i {
            margin-left: 5px;
        }
    }
`

const MenuLink = styled.span`
    position: relative;
    margin-left: 2em;
    color: ${(props) => (props.dark ? '#fff' : '#000')};
    user-select: none;
`

const Popover = styled.div`
    position: absolute;
    top: 14px;
    right: 0;

    ul {
        list-style: none;
        margin: 0;
        padding-top: 20px;
        li {
            width: 200px;
            height: 2em;
            line-height: 2em;
            text-align: right;
        }
    }
`

const MenuIcon = styled.i`
    margin-left: 0.5em;
`

const HeaderComp = ({ dark }) => {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <Header dark={dark}>
            <Link to="/">vv13</Link>
            <section>
                <Link to="/blog/">博客</Link>
                <MenuLink
                    dark={dark}
                    onClick={() => setShowMenu(!showMenu)}
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                >
                    更多<MenuIcon style={{ marginLeft: '0.5em' }} className="iconfont icon-menu"></MenuIcon>
                    <Popover style={{ display: showMenu ? 'block' : 'none' }}>
                        <ul>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://github.com/vv13/dojo/issues/created_by/vv13"
                                    rel="noreferrer"
                                >
                                    Dojo - 飞行笔记
                                    <MenuIcon className="iconfont icon-link" />
                                </a>
                            </li>
                            <li>
                                <a target="_blank" href="https://github.com/vv13" rel="noreferrer">
                                    Github - 开源作品
                                    <MenuIcon className="iconfont icon-link" />
                                </a>
                            </li>
                            <li>
                                <a target="_blank" href="https://gist.github.com/vv13" rel="noreferrer">
                                    Gist - 代码片段
                                    <MenuIcon className="iconfont icon-link" />
                                </a>
                            </li>
                        </ul>
                    </Popover>
                </MenuLink>
            </section>
        </Header>
    )
}

export default HeaderComp
