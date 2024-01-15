import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { HexColorPicker } from 'react-colorful'
import RoomTypeDropdown from 'components/Library/RoomTypeDropdown'
import { PrimaryButton, BackButton } from 'components/Common/Buttons'
import { useDispatch, RootStateOrAny, useSelector } from 'react-redux'
import {
    startLoadingApp,
    stopLoadingApp,
} from '../../../redux/slices/commonSlice'
import { changeInfo, goStep, initialState } from 'redux/slices/authSlice'
import { StepTitle, WalletAddress } from './Components'
import { DownArrow, UpArrow } from 'components/icons'
import { PassportPrices, PassportThemes } from 'data/Register'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { PassportPriceType } from 'modal/register'

const EditStyle = (props) => {
    const { onMint } = props

    const [stateInfo, setStateInfo] = useLocalStorage('stateInfo', initialState)
    const [step, setUserStep] = useLocalStorage('step', 1)
    const [toggleStatus, setToggleStatus] = useState(false)
    const [togglePrices, setTogglePrices] = useState(false)
    const [selectedImage, setSelectedImage] = useState(PassportThemes[0])
    const [selectedPrice, setSelectedPrice] = useState(PassportPrices[0])
    const [error, setError] = useState(null)

    const onSetColor = (value, target) => {
        let tempStyle = {}
        Object.assign(tempStyle, stateInfo.userInfo.passportStyle)
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                passportStyle: {
                    ...tempStyle,
                    [target]: value,
                },
            },
        }))
    }

    const selectImage = (item) => {
        setSelectedImage(item)
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                backgroundImage: item,
            },
        }))
    }
    const selectTier = (item: PassportPriceType) => {
        setSelectedPrice(item)
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                passportTier: item,
            },
        }))
        if (item.priceLamports > stateInfo.userInfo.balance) {
            setError('Insuffficient balance.')
        } else {
            setError(null)
        }
    }

    const onUndo = () => {
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                backgroundImage: PassportThemes[0],
            },
        }))
        setUserStep(4)
    }

    return (
        <>
            <div className="flex items-center justify-between pt-8 pl-5 pr-5 lg:p-5 lg:pb-0 lg:pt-8 rounded-t">
                <h3 className="hidden lg:block text-[22px] sm:text-[30px] text-white font-medium tracking-[0.02em]">
                    Edit Style
                </h3>
                <div className="block lg:hidden">
                    <StepTitle caption={'Style'} />
                </div>

                <WalletAddress />
            </div>
            {/*body*/}
            <div className="relative p-5 pt-0 sm:p-5 flex-auto text-[16px] sm:text-[20px]">
                <div className="mb-5 flex flex-row justify-between items-center relative">
                    <span className="text-white">Logo Color: </span>
                    <div className="border-[1px] border-white rounded-[12px] p-[2px] cursor-pointer peer">
                        <div
                            className="w-[60px] h-[30px] sm:w-[80px] sm:h-[40px] rounded-[10px]"
                            style={{
                                backgroundColor: `${stateInfo.userInfo.passportStyle.logo}`,
                            }}
                        ></div>
                    </div>
                    <div className="hidden peer-hover:block absolute hover:block right-0 bottom-[37px] sm:right-[-64px] sm:bottom-[47px] z-10">
                        <HexColorPicker
                            className="!w-[150px] !h-[150px]"
                            color={'#29b080'}
                            onChange={(value) => onSetColor(value, 'logo')}
                        />
                    </div>
                </div>
                <div className="mb-5 flex flex-row justify-between items-center relative">
                    <span className="text-white">Background Color: </span>
                    <div className="border-[1px] border-white rounded-[12px] p-[2px] cursor-pointer peer">
                        <div
                            className="w-[60px] h-[30px] sm:w-[80px] sm:h-[40px] rounded-[10px]"
                            style={{
                                backgroundColor: `${stateInfo.userInfo.passportStyle.background}`,
                            }}
                        ></div>
                    </div>
                    <div className="hidden peer-hover:block absolute hover:block right-0 bottom-[37px] sm:right-[-64px] sm:bottom-[47px] z-10">
                        <HexColorPicker
                            className="!w-[150px] !h-[150px]"
                            color={'#333333'}
                            onChange={(value) =>
                                onSetColor(value, 'background')
                            }
                        />
                    </div>
                </div>
                <div className="mb-5 flex flex-row justify-between items-center relative">
                    <span className="text-white">Line Color: </span>
                    <div className="border-[1px] border-white rounded-[12px] p-[2px] cursor-pointer peer">
                        <div
                            className="w-[60px] h-[30px] sm:w-[80px] sm:h-[40px] rounded-[10px]"
                            style={{
                                backgroundColor: `${stateInfo.userInfo.passportStyle.line}`,
                            }}
                        ></div>
                    </div>
                    <div className="hidden peer-hover:block absolute hover:block right-0 bottom-[37px] sm:right-[-64px] sm:bottom-[47px] z-10">
                        <HexColorPicker
                            className="!w-[150px] !h-[150px]"
                            color={'#29b080'}
                            onChange={(value) => onSetColor(value, 'line')}
                        />
                    </div>
                </div>
                <div className="mb-5 flex flex-row justify-between items-center relative">
                    <span className="text-white">Text Color: </span>
                    <div className="border-[1px] border-white rounded-[12px] p-[2px] cursor-pointer peer">
                        <div
                            className="w-[60px] h-[30px] sm:w-[80px] sm:h-[40px] rounded-[10px]"
                            style={{
                                backgroundColor: `${stateInfo.userInfo.passportStyle.text}`,
                            }}
                        ></div>
                    </div>
                    <div className="hidden peer-hover:block absolute hover:block right-0 bottom-[37px] sm:right-[-64px] sm:bottom-[47px] z-10">
                        <HexColorPicker
                            className="!w-[150px] !h-[150px]"
                            color={'#ffffff'}
                            onChange={(value) => onSetColor(value, 'text')}
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center relative">
                    <span className="text-white">Background Image: </span>

                    <div className="w-fit h-[46px] border-[1px] border-white rounded-[12px] px-[10px] cursor-pointer flex justify-center items-center">
                        <div
                            className="relative flex justify-around w-full items-center cursor-pointer gap-2"
                            onClick={() => setToggleStatus(!toggleStatus)}
                        >
                            <div className="font-extralight text-[14px] text-[#f3f3f3]">
                                {selectedImage.title}
                            </div>
                            <div className={``}>
                                {toggleStatus ? <UpArrow /> : <DownArrow />}
                            </div>
                            {toggleStatus && PassportThemes && (
                                <div
                                    className={`flex flex-col absolute w-[210px] h-[290px] overflow-y-scroll top-[40px] right-[-10px] text-center font-400 text-[16px] text-[#f3f3f3] z-[1000] p-[8px] bg-globalBgColor border-[1.5px] border-[#272829] rounded-[12px] cursor-pointer`}
                                >
                                    {PassportThemes.map((item, index) => (
                                        <div
                                            className={`hover:bg-[#272829] rounded-[6px] py-[2px] ${
                                                item == selectedImage
                                                    ? 'text-primary'
                                                    : ''
                                            }`}
                                            onClick={() => selectImage(item)}
                                            key={index}
                                        >
                                            {item.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center relative mt-5">
                    <span className="text-white">
                        Passport Tier: {selectedPrice.price}{' '}
                    </span>
                    <div className="w-fit h-[46px] border-[1px] border-white rounded-[12px] px-[10px] cursor-pointer flex justify-center items-center">
                        <div
                            className="relative flex justify-around w-full items-center cursor-pointer gap-2"
                            onClick={() => setTogglePrices(!togglePrices)}
                        >
                            <div className="font-extralight text-[14px] text-[#f3f3f3]">
                                {selectedPrice.title}
                            </div>
                            <div className={``}>
                                {togglePrices ? <UpArrow /> : <DownArrow />}
                            </div>
                            {togglePrices && PassportPrices && (
                                <div
                                    className={`flex flex-col absolute w-[210px] h-[150px] overflow-y-scroll top-[40px] right-[-10px] text-center font-400 text-[16px] text-[#f3f3f3] z-[1000] p-[8px] bg-globalBgColor border-[1.5px] border-[#272829] rounded-[12px] cursor-pointer`}
                                >
                                    {PassportPrices.map((item, index) => (
                                        <div
                                            className={`hover:bg-[#272829] rounded-[6px] py-[2px] ${
                                                item == selectedPrice
                                                    ? 'text-primary'
                                                    : ''
                                            }`}
                                            onClick={() => selectTier(item)}
                                            key={index}
                                        >
                                            {item.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {error ? (
                    <div className="text-[16px] text-rose-600">{error}</div>
                ) : null}
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
                        caption="Mint"
                        icon=""
                        bordered={false}
                        disabled={error || error !== null ? true : false}
                        onClick={() => onMint()}
                        styles="rounded-[15px]"
                    />
                </div>
            </div>
        </>
    )
}

export default EditStyle
