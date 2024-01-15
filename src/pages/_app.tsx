import React, { useEffect, useState, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import {
    ConnectionProvider,
    useWallet,
    WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import {
    WalletModalProvider,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { MetaplexProvider } from 'providers/MetaplexProvider'
// For redux
import { Provider, RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import store from '../redux/store'

import { checkSession } from 'redux/slices/authSlice'
import {
    setIsMobile,
    startLoadingApp,
    stopLoadingApp,
} from 'redux/slices/commonSlice'
import useWindowDimensions from 'utils/layout'

// CSS
import 'styles/globals.css'
import 'styles/app.css'
import 'styles/custom.css'
import 'animate.css/animate.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'styles/wallet.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import AppLoader from 'components/Layout/AppLoader'
import GameModal from 'components/Community/GameModal'
import { checkBrowser } from 'utils'

const endpoint = 'https://ssc-dao.genesysgo.net'

function MyApp({ children }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const dimensions = useWindowDimensions()
    const wallet = useWallet()
    const { asPath } = router
    const [network, setNetwork] = useState(WalletAdapterNetwork.Mainnet)

    const endpoint = useMemo(() => clusterApiUrl(network), [network])

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new BackpackWalletAdapter(),
        ],
        [network]
    )

    const { logged, profileData, checkingSession } = useSelector(
        (state: RootStateOrAny) => ({
            profileData: state.profile.data,
            logged: state.auth.logged,
            checkingSession: state.auth.checkingSession,
        })
    )

    const handleChange = (event) => {
        switch (event.target.value) {
            case 'devnet':
                setNetwork(WalletAdapterNetwork.Devnet)
                break
            case 'mainnet':
                setNetwork(WalletAdapterNetwork.Mainnet)
                break
            case 'testnet':
                setNetwork(WalletAdapterNetwork.Testnet)
                break
            default:
                setNetwork(WalletAdapterNetwork.Devnet)
                break
        }
    }

    // useEffect(() => {
    //     dispatch(checkSession())
    // }, [])

    useEffect(() => {
        dispatch(setIsMobile(checkBrowser()))
    }, [dimensions])

    useEffect(() => {
        const currentRoute = router.pathname
        if (currentRoute === '/profile' && !logged && !checkingSession) {
            router.push('/')
            return
        }
        dispatch(stopLoadingApp())
    }, [logged])

    return (
        <div>
            <ConnectionProvider
                endpoint={'https://gwenneth-fpqx5g-fast-devnet.helius-rpc.com/'}
            >
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <MetaplexProvider>
                            {children}
                            {store.getState().common.gameModalVisibility && (
                                <GameModal
                                    title={
                                        store.getState().common.selectedGame
                                            .title
                                    }
                                    websiteUrl={
                                        store.getState().common.selectedGame
                                            .iframeUrl
                                    }
                                />
                            )}
                        </MetaplexProvider>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    )
}

function ReduxWrapped({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Head>
                <title>Shaga</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                ></meta>
            </Head>
            <MyApp>
                <AppLoader />
                <ToastContainer
                    style={{ position: 'fixed', zIndex: '100000000' }}
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <Component {...pageProps} />
            </MyApp>
        </Provider>
    )
}

export default ReduxWrapped
