import React, { useEffect } from 'react'
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import Link from 'next/link'
import { UpArrow, DownArrow, SettingsIcon, LogOutIcon } from 'components/icons'
import DummyAvatarSmall from '../Layout/DummyAvatarSmall'
import { setValue } from 'utils'
import Image from 'next/image'
import { logout } from 'redux/slices/authSlice'
import { useWallet } from '@solana/wallet-adapter-react'
import { setNotificationModalVisibility } from 'redux/slices/commonSlice'

const MenuItem = ({ children }) => {
    return (
        <div className="rounded-[10px] hover:bg-[#1d1d1f] bg-transparent px-[10px] py-[8px] w-full flex flex-row py-[6px] font-500 text-[#f3f3f3] items-center group-hover:flex hidden hover:text-primary">
            {children}
        </div>
    )
}

const UserInfoMenu = (props) => {
    const { disconnect } = useWallet()

    return (
        <div className="select-none flex flex-row items-center border-l-semiSplitter border-l-[1px] h-full ">
            <div
                className="group relative ml-[14px] py-[15px] text-[#929298] text-[14px] font-500 cursor-pointer flex items-center"
                onMouseEnter={props.onEnter}
                onMouseLeave={props.onLeave}
            >
                <div className="">
                    {/* <div>{setValue(profileData.username)}</div> */}
                    <div className="relative h-[14px] mr-2">
                        <div className="absolute bottom-0 left-1 w-full bg-gray-200 rounded-full h-[9px] bg-[#282828]">
                            <div
                                className="bg-[#73DBC2] text-[7px] font-medium h-[9px] text-blue-100 text-center p-0.5 leading-none rounded-full"
                                style={{ width: '80%' }}
                            >
                                {' '}
                                80/100
                            </div>
                        </div>
                        <div className="absolute top-0 left-0">
                            <img
                                src="/images/wallets/score.png"
                                width={17}
                                height={16}
                            />
                            <div className="text-[9px] text-white mt-[-12px] ml-[6px]">
                                4
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-[8px]">
                    {props.openState ? <UpArrow /> : <DownArrow />}
                </div>

                <div
                    className={`duration-300 px-[12px] group-hover:py-[8px] p-[0px] flex flex-col items-start absolute top-[50px] right-[0px] opacity-0  h-[0px] w-[150%] bg-[#131314]
                            border-[#1d1f1f] border-[2px] rounded-[12px] text-white z-[1000]  group-hover:h-[88px] group-hover:opacity-100 overflow-hidden`}
                >
                    <MenuItem>
                        <div className="mr-[14px]">
                            <SettingsIcon />
                        </div>
                        Settings
                    </MenuItem>
                    <MenuItem>
                        <div onClick={() => {}} className="flex">
                            <div className="mr-[14px]">
                                <LogOutIcon />
                            </div>
                            Log out
                        </div>
                    </MenuItem>
                </div>
            </div>
        </div>
    )
}

export default UserInfoMenu
