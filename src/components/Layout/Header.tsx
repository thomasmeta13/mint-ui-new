import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import HeaderMenuItem from '../Common/Layout/HeaderMenuItem'
import { HeaderMenuTitles } from 'data/HeaderMenu'
import SearchBox from 'components/Common/Forms/SearchBox'
import BalanceBox from 'components/Common/Forms/HeaderBalanceBox'
import UserInfoMenu from 'components/Common/Forms/UserInfoMenu'
import LibraryLayout from 'components/LibraryLayout'
import { CloseIcon } from 'components/icons'
import { Rnd } from 'react-rnd'
import CreateEventModal from 'components/Library/CreateEventModal'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { ToggleChatBtn } from './Sidebar'
import LogoComp from 'components/Common/Layout/LogoComp'
import { setChatSidebarVisibility, setDMChats } from 'redux/slices/chatSlice'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { apiCaller } from 'utils/fetcher'
import { setAlarm } from 'redux/slices/profileSlice'
import { time_ago } from 'utils'

interface HeaderProps {
    searchString?: string
    setSearchString?: any
}

const Header = (props: HeaderProps) => {
    const wallet = useWallet()
    const router = useRouter()
    const { asPath } = useRouter()
    const pathSegments = asPath.split('/')
    const currentPath = pathSegments[pathSegments.length - 1]
    const enabledResizing = {
        bottom: false,
        bottomLeft: true,
        bottomRight: true,
        left: false,
        right: false,
        top: false,
        topLeft: true,
        topRight: true,
    }

    const [active, setActive] = useState(currentPath)
    const [balanceBoxToggle, setBalanceBoxToggle] = useState(false)
    const [userInfoToggle, setUserInfoToggle] = useState(false)
    const [gameLibraryToggle, setGameLibraryToggle] = useState(false)
    const [gameLibraryPageFlag, setGameLibraryPageFlag] = useState(0)
    const [createEventToggle, setCreateEventToggle] = useState(false)
    const [isIframe, setIsIframe] = useState(false)
    const [selectedGame, setSelectedGame] = useState(null)

    const [status, setStatus] = useState<any>()

    const connected = useMemo(() => {
        return wallet.connected
    }, [wallet])

    useEffect(() => {
        if (connected) {
            let publicKey = wallet.publicKey.toBase58()
            let type = 'solana'
            // loginUser(publicKey, type, wallet)
        }
    }, [connected])

    useEffect(() => {
        const innerWidth = (window as any).innerWidth
        const innerHeight = (window as any).innerHeight

        const defaultStatus = {
            width: (((innerHeight * 85) / 100) * 16) / 9,
            height: (innerHeight * 85) / 100,
            x: (innerWidth - (((innerHeight * 85) / 100) * 16) / 9) / 2,
            y: (innerHeight * (100 - 85)) / 100 / 2,
        }

        setStatus(defaultStatus)
    }, [])

    const openPopup = (i) => {
        setGameLibraryToggle(true)
        setActive(i.toLowerCase())
    }

    const onClose = () => {
        const innerWidth = (window as any).innerWidth
        const innerHeight = (window as any).innerHeight

        const defaultStatus = {
            width: (((innerHeight * 85) / 100) * 16) / 9,
            height: (innerHeight * 85) / 100,
            x: (innerWidth - (((innerHeight * 85) / 100) * 16) / 9) / 2,
            y: (innerHeight * (100 - 85)) / 100 / 2,
        }

        setGameLibraryToggle(false)
        setIsIframe(false)
        setStatus(defaultStatus)
    }

    return (
        <div className="relative w-full bg-[#141414] z-[100]">
            <div
                            className="flex flex-row justify-between pl-2 pr-10 py-5 h-[144px]
                                        w-full"
            >
                <div className="flex">
                    <LogoComp />
                </div>
                <div
                    className="flex
                                md:flex-row 
                                h-full justify-end
                                md:w-full"
                >
                    <div
                        className="flex flex-row items-center
                                    md:justify-end
                                    "
                    >
                        <WalletMultiButton
                            style={{
                                fontSize: '18px',
                                padding: '15px 20px',
                                borderRadius: '10px',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
