import React, { useState } from 'react'
import { useDispatch, RootStateOrAny, useSelector } from 'react-redux'
import { PrimaryButton, BackButton } from 'components/Common/Buttons'
import { NftPanel } from 'components/Common/Panels'
import { getNfts } from '../../../hooks'
import { changeInfo, goStep, initialState } from 'redux/slices/authSlice'
import { StepTitle, WalletAddress } from './Components'
import { useLocalStorage } from 'hooks/useLocalStorage'

const UserPic = (props) => {
    const [stateInfo, setStateInfo] = useLocalStorage('stateInfo', initialState)
    const [_, setUserStep] = useLocalStorage('step', 1)

    const [selectStatus, setSelectStatus] = useState(false)
    const [selectedIndex, setSelectedtIndex] = useState<any>(false)
    const [nfts, nftLoading] = getNfts(stateInfo.userInfo.solanaAddress, false)

    const onSelectImage = async (image: any, index: number) => {
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                profileImage: image,
            },
        }))
        setSelectStatus(true)
        setSelectedtIndex(index)
    }

    const onContinue = () => {
        setUserStep(4)
    }

    const onUndo = () => {
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                profileImage: {},
            },
        }))
        setUserStep(2)
        setSelectedtIndex(false)
    }

    return (
        <>
            <div className="flex items-center justify-between pt-8 pl-5 pr-5 lg:p-5 lg:pt-8 lg:pb-0 lg:pr-5 rounded-t">
                <h3 className="hidden lg:block text-[22px] sm:text-[30px] text-white font-medium tracking-[0.02em]">
                    Choose Profile Picture
                </h3>
                <div className="block lg:hidden">
                    <StepTitle caption={'Avatar'} />
                </div>
                <WalletAddress />
            </div>
            <div className="relative px-5 lg:px-5 flex-auto overflow-scroll max-h-[calc(100vh-509px)] sm:max-h-[575px]">
                {nftLoading ? (
                    <h3 className="text-center text-[24px] lg:text-[26px] text-white font-medium tracking-[0.02em]">
                        Loading NFTs...
                    </h3>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 custom-2xl:grid-cols-3 gap-3">
                        {nfts.map(
                            (
                                {
                                    type,
                                    mintAddress,
                                    contractAddress,
                                    tokenId,
                                    name,
                                    image,
                                    collectionName,
                                },
                                index
                            ) => (
                                <NftPanel
                                    image={
                                        image
                                            ? image
                                            : '/images/nft_placeholder.png'
                                    }
                                    name={name}
                                    collectionName={collectionName}
                                    type={type}
                                    keyIndex={index}
                                    onClick={() =>
                                        onSelectImage(
                                            {
                                                link: image,
                                                network: type,
                                                contractAddress,
                                                tokenId,
                                                mintAddress,
                                            },
                                            index
                                        )
                                    }
                                    selected={selectedIndex}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
            <div className="w-full p-5 lg:p-5 flex-auto flex items-end px-5 py-5 lg:px-5 lg:py-5">
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
                        disabled={nftLoading || !selectStatus ? true : false}
                        styles="rounded-[15px]"
                    />
                </div>
            </div>
        </>
    )
}

export default UserPic
