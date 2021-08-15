import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import theme from '../config/theme'

const Container = styled.div`
    margin: 0 auto;
    max-width: 1200px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    a {
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
`

const Wrapper = styled.div`
    background-color: ${({ dark }) => (dark ? '#000' : '#fff')};
`

const MainLayout = ({ children, dark }) => (
    <ThemeProvider theme={theme}>
        <Wrapper dark={dark}>
            <Container>
                <Header dark={dark} />
                {children}
                <Footer />
            </Container>
        </Wrapper>
    </ThemeProvider>
)

export default MainLayout
