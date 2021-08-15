import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

const NavWrap = styled.ul`
    position: relative;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    list-style: none;
`
const NavItem = styled.li`
    width: 2em;
    text-align: center;
    margin-bottom: 0;
`
const NavBtn = styled.button`
    background: transparent;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    outline: none;
`

const NavInfo = styled.span`
    font-size: 12px;
    position: absolute;
    right: -40px;
`

const Pagination = (props) => {
    const { pageInfo } = props
    const { currentPage, pageCount, totalCount } = pageInfo

    const prevLink = currentPage === 2 ? '/blog' : `/blog/${currentPage - 1}`
    const nextLink = `/blog/${currentPage + 1}`
    const finalLink = `/blog/${pageCount}`

    return (
        <NavWrap>
            <NavItem>
                {currentPage !== 1 ? (
                    <Link to="/blog">
                        <NavBtn>«</NavBtn>
                    </Link>
                ) : (
                    ''
                )}
            </NavItem>
            <NavItem>
                {currentPage > 1 ? (
                    <Link to={prevLink}>
                        <NavBtn>‹</NavBtn>
                    </Link>
                ) : (
                    ''
                )}
            </NavItem>
            {currentPage}
            <NavItem>
                {currentPage < pageCount ? (
                    <Link to={nextLink}>
                        <NavBtn>›</NavBtn>
                    </Link>
                ) : (
                    ''
                )}
            </NavItem>
            <NavItem>
                {currentPage !== pageCount ? (
                    <Link to={finalLink}>
                        <NavBtn>»</NavBtn>
                    </Link>
                ) : (
                    ''
                )}
            </NavItem>
            <NavInfo>共{totalCount}篇</NavInfo>
            <span></span>
        </NavWrap>
    )
}

export default Pagination
