import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
    AddressButton,
    WalletButton,
    PrimaryButton,
    BackButton,
} from 'components/Common/Buttons'

import { DaoBGImg } from 'components/Common/Images'
import { DaoPanel } from 'components/Common/Panels'
import { initialState } from 'redux/slices/authSlice'
import { StepTitle, WalletAddress } from './Components'
import { useMetaplex } from 'utils/contexts/useMetaplex'
import { getNfts } from 'hooks'
import axios from 'axios'
import { VERIFIED_LIST } from 'utils/verifiedList'
import { useLocalStorage } from 'hooks/useLocalStorage'

// const daos = [
//   {
//     name: "DeGods",
//     symbol: "DeGods",
//     description: "Welcome to new Dao",
//     profileImage: {
//       link: "/images/daos/degods.png",
//       address: "/images/daos/degods.png"
//     }
//   }, {
//     name: "BAYC",
//     symbol: "BAYC",
//     description: "Welcome to new Dao",
//     profileImage: {
//       link: "/images/daos/bayc.jpeg",
//       address: "/images/daos/bayc.jpeg"
//     }
//   }, {
//     name: "SolGods",
//     symbol: "SolGods",
//     description: "Welcome to new Dao",
//     profileImage: {
//       link: "/images/daos/solgods.jpeg",
//       address: "/images/daos/solgods.jpeg"
//     }
//   }, {
//     name: "MoneyBoys",
//     symbol: "MoneyBoys",
//     description: "Welcome to new Dao",
//     profileImage: {
//       link: "/images/daos/moneyboys.jpeg",
//       address: "/images/daos/moneyboys.jpeg"
//     }
//   }, {
//     name: "Doodles",
//     symbol: "Doodles",
//     description: "Welcome to new Dao",
//     profileImage: {
//       link: "/images/daos/doodles.png",
//       address: "/images/daos/doodles.png"
//     }
//   }, {
//     name: "CryptoPunks",
//     symbol: "CryptoPunks",
//     description: "Welcome to new Dao",
//     profileImage: {
//       link: "/images/daos/cryptopunk.png",
//       address: "/images/daos/cryptopunk.png"
//     }
//   },
// ];

const UserDaos = (props) => {
    const [daos, setDaos] = useState([])
    const [selectedDaos, setSelectedDaos] = useState([])
    const [stateInfo, setStateInfo] = useLocalStorage('stateInfo', initialState)
    const [step, setUserStep] = useLocalStorage('step', 1)

    const [nfts, nftLoading, nftError, fetchNFTs] = getNfts(
        stateInfo.userInfo.solanaAddress,
        false
    )

    useEffect(() => {
        if (!nfts) return
        if (nftLoading) return
        const filteredNfts = nfts.filter((nft) =>
            VERIFIED_LIST.includes(nft.collectionAddress)
        )

        setDaos(filteredNfts)
    }, [nfts, nftLoading])

    useEffect(() => {
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                daos: selectedDaos,
            },
        }))
    }, [selectedDaos])

    const onContinue = () => {
        setUserStep(3)
    }

    const onUndo = () => {
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                daos: [],
            },
        }))
        setUserStep(1)
    }

    const onSelectDao = (selected) => {
        let tempDaos
        let index = selectedDaos.findIndex(
            (dao, index) => dao.name === selected.name
        )
        if (index >= 0) {
            tempDaos = selectedDaos.filter(
                (dao, index) => dao.name !== selected.name
            )
        } else {
            tempDaos = [...selectedDaos, selected]
            if (tempDaos.length > 3) {
                alert('Maximum count is 3')
                return
            }
        }
        setSelectedDaos(tempDaos)
    }

    return (
        <>
            <div className="flex items-center justify-between pt-8 pl-5 pr-5 lg:p-5 lg:pt-8 lg:pb-0 lg:pr-5 rounded-t">
                <h3 className="hidden lg:block text-[22px] sm:text-[30px] text-white font-medium tracking-[0.02em]">
                    DAOs you&apos;re already in
                </h3>
                <div className="block lg:hidden">
                    <StepTitle caption={'DAOs'} />
                </div>
                <WalletAddress />
            </div>
            {/*body*/}
            <div className="relative px-5 sm:pt-5 lg:p-5 flex-auto">
                {nftLoading ? (
                    <div className="text-center	text-[24px] lg:text-[24px] text-white font-medium tracking-[0.02em]">
                        Daos Loading...
                    </div>
                ) : daos.length ? (
                    <div className="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 custom-2xl:grid-cols-3 max-h-[calc(100vh-392px)] sm:max-h-[476px] overflow-scroll gap-3">
                        {daos.map((dao, index) => (
                            <DaoPanel
                                imageSrc={dao?.image}
                                backSrc={DaoBGImg}
                                title={dao.name}
                                key={index}
                                selected={
                                    selectedDaos.findIndex(
                                        (item, index) => dao.name === item.name
                                    ) >= 0
                                        ? true
                                        : false
                                }
                                onClick={() => onSelectDao(dao)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center	text-[24px] lg:text-[24px] text-white font-medium tracking-[0.02em]">
                        No DAOs you are in.
                    </div>
                )}
            </div>
            <div className="w-full px-5 py-5 lg:px-5 lg:py-5 flex-auto flex items-end">
                <div className="inline-block w-[20%] pr-2">
                    <BackButton
                        onClick={() => onUndo()}
                        styles="rounded-[15px]"
                    />
                </div>
                <div className="inline-block w-[80%] pl-2">
                    <PrimaryButton
                        caption="Continue"
                        icon=""
                        bordered={false}
                        onClick={() => onContinue()}
                        disabled={nftLoading ? true : false}
                        styles="rounded-[15px]"
                    />
                </div>
            </div>
        </>
    )
}

export default UserDaos
