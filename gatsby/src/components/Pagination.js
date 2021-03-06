import React from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'

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

export default (props) => {
  const { totalCount, skip, limit } = props

  const currentPage = skip / 10 + 1
  const totalPage = Math.ceil(totalCount / limit)

  const prevLink = currentPage === 2 ? '/blog' : `/blog/${currentPage - 1}`
  const nextLink = `/blog/${currentPage + 1}`
  const finalLink = `/blog/${totalPage}`

  return (
    <NavWrap>
      <NavItem>
        {currentPage !== 1 ? (<Link to="/blog"><NavBtn>«</NavBtn></Link>) : ''}
      </NavItem>
      <NavItem>
        {currentPage > 1 ? (<Link to={prevLink}><NavBtn>‹</NavBtn></Link>) : ''}
      </NavItem>
        {currentPage}
      <NavItem>
        {currentPage < totalPage ? (<Link to={nextLink}><NavBtn>›</NavBtn></Link>) : ''}
      </NavItem>
      <NavItem>
        {currentPage !== totalPage ? (<Link to={finalLink}><NavBtn>»</NavBtn></Link>) : ''}
      </NavItem>
      <NavInfo>
        共{totalCount}篇
      </NavInfo>
      <span></span>
    </NavWrap>
  )
}
