import React from 'react'
import Image from 'next/image'
import site from '../config/site'
import Helmet from '../components/Helmet'
import MainLayout from '../components/MainLayout'

const Index = () => (
    <MainLayout dark>
        <Helmet title={site.title} noSuffix />
        <div className='flex flex-1 items-center justify-center flex-col bg-black'>
            <Image width={1280} height={720} style={{ maxWidth: '100%' }} src='/assets/banner.jpg' alt={''}></Image>
        </div>
    </MainLayout>
)

export default Index
