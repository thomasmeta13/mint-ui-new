import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Logo from 'components/Common/Logo'
import { useDispatch, RootStateOrAny, useSelector } from 'react-redux'
import {
    EditStyle,
    UserBadges,
    UserDaos,
    UserInfo,
    UserPic,
    NftDemo,
} from './Steps'
import {
    goStep,
    initialState,
    jumpStep,
    setStep,
    updateUserInfo,
} from 'redux/slices/authSlice'
import ProgressBar from './ProgressBar'
import Circle from './Circle'
import { apiCaller } from 'utils/fetcher'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useMetaplex } from 'utils/contexts/useMetaplex'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import SuccessModal from './SuccessModal'
import { showErrorToast, showSuccessToast } from 'utils'
import { PublicKey, VersionedTransaction } from '@solana/web3.js'
import { useLocalStorage } from 'hooks/useLocalStorage'

export const RegisterPage = () => {
    const {
        query: { ref },
    } = useRouter()
    const router = useRouter()
    const { metaplex } = useMetaplex()
    const modelRef = useRef()
    const { connection } = useConnection()
    const { publicKey, sendTransaction, signMessage } = useWallet()
    const [mintProcess, setMintProcess] = useState<number>(0)
    const [stateInfo, setStateInfo] = useLocalStorage('stateInfo', initialState)
    const [step, setUserStep] = useLocalStorage('step', 1)

    useEffect(() => {
        if (step) {
            const userInfo = stateInfo.userInfo
            console.log(userInfo)
            // check if user owns nft if there are no steps.
            switch (step) {
                case 6:
                    router.push({
                        pathname: `/leaderboard`,
                    })
            }
        }
        getUserBalance()
    }, [])

    const getUserBalance = async () => {
        const userInfo = stateInfo.userInfo
        const userBalance = await connection.getBalance(
            new PublicKey(userInfo.solanaAddress)
        )
        console.log(userBalance)
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                balance: userBalance,
            },
        }))
    }
    const mintModel = async (buffer) => {
        try {
            setMintProcess(2)
            const blob = new Blob([buffer], {
                type: 'application/octet-stream',
            })
            const file = blobToFile(blob, 'Model.glb')
            const body = new FormData()
            const userInfo = stateInfo.userInfo
            let passportTier = userInfo.passportTier.title
            let shagaPoints = userInfo.passportTier.points
            let pfpUrl = userInfo.profileImage.link
            body.append('file', file)
            body.append('tier', passportTier)
            body.append('title', userInfo.title)
            body.append('domain', userInfo.domain)
            body.append('publicKey', publicKey?.toString())
            setMintProcess(3)
            const response = await fetch('/api/auth/mint', {
                method: 'POST',
                body,
            })
            const retrievedTransaction = await response.json()
            if (!retrievedTransaction) {
                setMintProcess(0)
                showErrorToast('Mint passport failed')
                return
            }

            console.log(retrievedTransaction)
            setMintProcess(4)

            const transactionBuf = Buffer.from(
                retrievedTransaction.transaction,
                'base64'
            )
            const transaction = VersionedTransaction.deserialize(transactionBuf)
            console.log(transaction.signatures)
            const txResponse = await sendTransaction(transaction, connection, {
                skipPreflight: false,
                maxRetries: 3,
            })

            await connection.confirmTransaction(txResponse, 'confirmed')

            const domainParts = userInfo.domain.split('.')
            let domainName = ''

            if (domainParts.length === 1) {
                domainName = domainParts[0]
            } else {
                domainName = domainParts[domainParts.length - 2]
            }


            const domainMintData = {
                domain: domainName,
                mint_address: retrievedTransaction.mintAddress,
                uri: retrievedTransaction.uri,
                points: shagaPoints,
                referredBy: ref,
                pfp_url: pfpUrl
            }

            await fetch('/api/auth/successful-mint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(domainMintData),
            })
            setMintProcess(5)
            showSuccessToast('Successfully mint your passport')
            setUserStep(6)
        } catch (error) {
            setMintProcess(0)
            console.log(error)
            showErrorToast('Mint passport failed')
        }
    }

    const blobToFile = (theBlob, fileName) => {
        const newFile = new File([theBlob], fileName, {
            type: theBlob.type,
        })
        return newFile
    }

    const exportModel = (e) => {
        setMintProcess(1)
        console.log(modelRef.current)
        try {
            const options = {
                binary: true,
            }
            const exporter = new GLTFExporter()
            exporter.parse(
                modelRef.current,
                (result: ArrayBuffer) => {
                    console.log(result)
                    // saveArrayBuffer(result, 'model.glb')
                    mintModel(result)
                },
                (error) => {
                    console.log(error)
                    setMintProcess(0)
                    showErrorToast('Export model failed.')
                },
                options
            )
        } catch (error) {
            console.log(error)
            setMintProcess(0)
            showErrorToast('Export model failed.')
        }
    }

    const saveArrayBuffer = (buffer, filename) => {
        save(new Blob([buffer], { type: 'application/octet-stream' }), filename)
    }

    const saveString = (text, filename) => {
        save(new Blob([text], { type: 'text/plain' }), filename)
    }

    const save = (blob, filename) => {
        const link = document.createElement('a')
        link.style.display = 'none'
        document.body.appendChild(link)

        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
    }

    return (
        <div
            className={`lg:flex lg:flex-row justify-center md:flex-col gap-[25px] mt-[35px] px-5 sm:px-11 lg:mt-[50px] items-center`}
        >
            <div className="hidden lg:block w-[90%] md:w-[80%] lg:w-[50%] xl:w-[55%] custom-2xl:w-[55%] m-auto z-10">
                <div className="relative w-auto mx-auto">
                    <div className="rounded-[30px] min-h-[600px] lg:min-h-[calc(100vh-150px)] shadow-lg relative w-full bg-[#141416] outline-none focus:outline-none flex flex-row">
                        <div className="hidden xl:w-[40%] xl:block h-full">
                            <div className="py-6">
                                <Logo />
                            </div>
                            <Circle step={step} />
                            <ProgressBar step={step} />
                        </div>
                        <div className="w-[100%] xl:w-[60%] flex flex-col relative">
                            {step === 1 && <UserInfo />}
                            {step === 2 && <UserDaos />}
                            {step === 3 && <UserPic />}
                            {step === 4 && <UserBadges />}
                            {(step === 5 || step === 6) && (
                                <EditStyle onMint={exportModel} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block w-[100%] md:w-[85%] lg:w-[50%] xl:w-[45%] custom-2xl:w-[45%] m-auto">
                <NftDemo modelRef={modelRef} />
            </div>
            <div className="block lg:hidden">
                <div className="w-[100%]">
                    <NftDemo modelRef={modelRef} />
                </div>
                <div className="w-[90%] m-auto z-10">
                    <div className="relative w-auto mx-auto">
                        <div className="rounded-[30px] min-h-[calc(100vh-350px)] sm:min-h-[calc(100vh-520px)] shadow-lg relative w-full bg-[#141416] outline-none focus:outline-none flex flex-row mt-10">
                            <div className="w-[100%] xl:w-[60%] flex flex-col relative">
                                {step === 1 && <UserInfo />}
                                {step === 2 && <UserDaos />}
                                {step === 3 && <UserPic />}
                                {step === 4 && <UserBadges />}
                                {(step === 5 || step === 6) && (
                                    <EditStyle onMint={exportModel} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {mintProcess === 5 && <SuccessModal username={stateInfo.userInfo.domain} modelRef={modelRef} />}
            {mintProcess !== 0 && mintProcess !== 5 && (
                <div className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm z-20 flex  justify-center items-center">
                    <div className="text-white text-[24px]">
                        {mintProcess === 1 && 'Exporting 3D model...'}
                        {mintProcess === 2 && 'Uploading your 3D Passport...'}
                        {mintProcess === 3 && 'Uploading NFT metadata...'}
                        {mintProcess === 4 && 'Minting your Passport NFT...'}
                    </div>
                </div>
            )}
        </div>
    )
}

export default RegisterPage
