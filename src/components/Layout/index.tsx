import React, { useEffect, useState } from 'react'
import Header from './Header'
import MobileTopBar from './MobileTopBar'
import { checkBrowser, eqArraySets } from 'utils'
import { useWallet } from '@solana/wallet-adapter-react'

const Layout = ({
    children,
    banner,
    onClick,
    sidebarToggler,
    searchString,
    setSearchString,
}: {
    children: any
    banner?: any
    onClick: Function
    sidebarToggler: boolean
    searchString?: string
    setSearchString?: Function
}) => {
    const [mobileMenuToggler, setMobileMenuToggler] = useState(false)

    return (
        <div className="bg-globalBgColor flex flex-row w-full relative">
            <MobileTopBar
                mobileMenuToggler={mobileMenuToggler}
                onClick={() => setMobileMenuToggler(!mobileMenuToggler)}
            />
            <div className="bg-globalBgColor w-full hidden sm:block flex-row">
                <Header
                    searchString={searchString}
                    setSearchString={setSearchString}
                />
            </div>
        </div>
    )
}

export default Layout
