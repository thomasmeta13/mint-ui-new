import React, { useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { BannerText } from './BannerText'
import { BannerImage } from './BannerImage'
import { BannerLeftImg, BannerRightImg } from 'components/Common/Images'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { apiCaller } from 'utils/fetcher'
import { useDispatch } from 'react-redux'
import { initialState } from 'redux/slices/authSlice'
import { useRouter } from 'next/router'
import { startLoadingApp, stopLoadingApp } from 'redux/slices/commonSlice'
import { useLocalStorage } from 'hooks/useLocalStorage'

export const HomePage = () => {
    const wallet = useWallet()
    const dispatch = useDispatch()

    const {
        query: { ref },
    } = useRouter()

    const router = useRouter()

    const [stateInfo, setStateInfo] = useLocalStorage('stateInfo', initialState)
    const [step, setUserStep] = useLocalStorage('step', 1)

    const connected = useMemo(() => {
        return wallet.connected
    }, [wallet])

    useEffect(() => {
        if (wallet.connected) {
            let publicKey = wallet.publicKey.toBase58()
            loginUser(publicKey)
        }
    }, [connected])

    const loginUser = async (address: string) => {
        dispatch(startLoadingApp())
        let url = `/leaderboard`
        // do some online checks i.e. leaderboard
        // grab nfts check if user has nft.
        if (stateInfo.userInfo.solanaAddress != address) {
            setStateInfo(() => ({
                ...initialState,
                ref: ref,
                userInfo: {
                    ...initialState.userInfo,
                    solanaAddress: address,
                },
            }))
        } else {
            if (ref) {
                setStateInfo((prev) => ({
                    ...prev,
                    ref: ref
                }))
            }
        }
        
        if (step != 6) {
            url = `/auth/register`
        }
        router.push({ pathname: url }).then((res) => {
            dispatch(stopLoadingApp())
        })
    }

    return (
        <>
            <div className="block sm:hidden mobile-gradient"></div>
            <div className="block sm:hidden mobile-gradient-2"></div>
            <div className="absolute block sm:hidden -ml-[37px] -mt-[50px] w-[50vw]">
                <Image
                    src={BannerLeftImg}
                    alt="Solarity"
                    layout="responsive"
                    className="custom-animation-bounce banner-image"
                ></Image>
            </div>
            <div className="absolute block sm:hidden right-0 -ml-[20px] -mt-[50px] w-[50vw]">
                <Image
                    src={BannerRightImg}
                    alt="Solarity"
                    layout="responsive"
                    className="custom-animation-bounce banner-image"
                ></Image>
            </div>
            <div className="absolute block sm:hidden">
                <BannerImage isMobile={false} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-[80px] items-baseline px-[10px] ml-[50px] sm:pl-0">
                <div>
                    <BannerText />
                    <div className="flex flex-row justify-start items-center gap-6">
                        <WalletMultiButton />
                    </div>
                </div>
            </div>
            <div className="hidden sm:block absolute top-0 right-0 -z-10">
                <BannerImage isMobile={true} />
            </div>
        </>
    )
}
