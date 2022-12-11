import React, { PropsWithChildren } from 'react'
import Header from './Header'
import Footer from './Footer'

const MainLayout: React.FC<PropsWithChildren<{ dark?: boolean }>> = ({ children, dark }) => (
    <div className={dark ? 'bg-black' : 'bg-white'}>
        <div className='my-09 mx-auto max-w-screen-xl min-h-screen flex flex-col px-0 mx-0'>
            <Header dark={dark} />
            {children}
            <Footer dark={dark} />
        </div>
    </div>
)

export default MainLayout
