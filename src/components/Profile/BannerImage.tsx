import { NormalButton } from 'components/Common/Buttons'
import SocialIcon from 'components/Common/SocialIcon'
import NoRoomBannerImage from 'components/Profile/NoRoomBannerImage'

import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { setVisitFlag } from 'redux/slices/profileSlice'
import useWindowDimensions from 'utils/layout'
import VisitorNoRoomBannerImage from './VisitorNoRoomBannerImage'

const BannerImage = ({ user }) => {
    const dispatch = useDispatch()

    const { width, height } = useWindowDimensions()
    const [shareMenuToggle, setShareMenuToggle] = useState(false)
    const [activeRoom, setActiveRoom] = useState(-1)
    const [isIframe, setIsIframe] = useState(false)
    const [path, setPath] = useState('')

    useEffect(() => {
        if (user) {
            user.rooms.forEach((room, index) => {
                if (room.active == true) {
                    setActiveRoom(index)
                }
            })
        }
    }, [user])

    const expandRoom = (selectedRoom) => {
        dispatch(setVisitFlag(1))
        setPath(`/profile/roomview?no=${selectedRoom.roomNo}`)
        setIsIframe(true)
    }

    return (
        <div className="w-full relative">
            {!isIframe && (
                <div>
                    {activeRoom != -1 ? (
                        <div className="rounded-[25px] sm:mt-[0px] xs:mt-[24px] overflow-hidden w-full">
                            <Image
                                src={
                                    user.rooms[activeRoom].imageUrl != ''
                                        ? user.rooms[activeRoom].imageUrl
                                        : '/images/profile/Profile_banner_Konstantin1982.webp'
                                }
                                layout="responsive"
                                width={1708}
                                height={450}
                                alt="Banner Image"
                            />
                        </div>
                    ) : (
                        <div className="rounded-[25px] sm:mt-[0px] xs:mt-[24px] overflow-hidden w-full">
                            <div className="relative -mt-5 h-[400px] w-full rounded-2xl">
                                <div
                                    className="w-full h-[400px] rounded-2xl relative"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                    }}
                                >
                                    <div
                                        className="absolute flex bottom-5 p-[5px] right-10 rounded-full cursor-pointer"
                                        style={{
                                            background:
                                                'rgba(255, 255, 255, 0.15)',
                                            backdropFilter: 'blur(30px)',
                                        }}
                                    >
                                        <div className="w-7 h-7 bg-white rounded-full">
                                            <img
                                                src="/images/profile/lock.png"
                                                className="m-auto pt-[5px]"
                                                alt="locked"
                                                width="13"
                                                height="17"
                                            />
                                        </div>
                                        <span className="ml-2 text-sm mr-4 pt-[5px]">
                                            Unlock
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {isIframe && (
                <div className="w-full h-[300px] md:h-[450px]">
                    <iframe
                        src={path}
                        frameBorder="0"
                        className="w-full h-full rounded-[25px]"
                    ></iframe>
                </div>
            )}
            <div
                className="absolute flex sm:justify-start xs:justify-center w-full
                            custom-2xl:bottom-[-32px] custom-2xl:left-[0px]
                            xl:bottom-[-30px] xl:left-[0px]
                            md:bottom-[-30px] md:left-[0px]
                            sm:bottom-[-30px] sm:left-[0px]
                            xs:bottom-[-30px] xs:left-[0px]"
            >
                <div
                    className="relative custom-2xl:w-[136px] xl:w-[120px] md:w-[110px] sm:w-[100px] xs:w-[100px] 
                                custom-2xl:rounded-[45px] xl:rounded-[40px] lg:rounded-[40px] md:rounded-[40px] sm:rounded-[35px] xs:rounded-[35px]
                                border-[3px] border-globalBgColor"
                >
                    <Image
                        src={
                            user.profileImage && user.profileImage.link
                                ? user.profileImage.link
                                : '/images/profile/temp/Avatar_Konstantin1982.webp'
                        }
                        className="rounded-[40px]"
                        layout="responsive"
                        width={136}
                        height={136}
                        alt="user avatar"
                    />
                    <div
                        className="absolute
                                custom-2xl:right-[0px] custom-2xl:bottom-[0px] custom-2xl:w-[28px]
                                xl:right-[0px] xl:bottom-[0px] xl:w-[26px]
                                md:right-[0px] md:bottom-[0px] md:w-[24px]
                                sm:right-[0px] sm:bottom-[0px] sm:w-[24px]
                                xs:right-[0px] xs:bottom-[0px] xs:w-[24px]"
                    >
                        <Image
                            src={'/images/profile/temp/Verified.png'}
                            layout="responsive"
                            width={28}
                            height={28}
                            alt="verified badge"
                        />
                    </div>
                </div>
            </div>

            {activeRoom != -1 && (
                <div>
                    {/* <div className={`absolute top-[24px]
                                    ${width < 640 ? "xs:left-[24px]" : ""}
                                    custom-2xl:right-[120px] xl:right-[120px] lg:right-[120px] md:right-[120px] sm:right-[120px]
                                    select-none`}> */}
                    <div className={`absolute top-[24px] right-[10px] `}>
                        {/* <SocialIcon onClick={() => setShareMenuToggle(!shareMenuToggle)}> */}
                        <SocialIcon
                            onClick={() => expandRoom(user.rooms[activeRoom])}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.58203 6.41712L12.3654 1.63379"
                                    stroke="#F3F3F3"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12.8312 3.96699V1.16699H10.0312"
                                    stroke="#F3F3F3"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M6.41797 1.16699H5.2513C2.33464 1.16699 1.16797 2.33366 1.16797 5.25032V8.75032C1.16797 11.667 2.33464 12.8337 5.2513 12.8337H8.7513C11.668 12.8337 12.8346 11.667 12.8346 8.75032V7.58366"
                                    stroke="#F3F3F3"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </SocialIcon>
                        {/* <div className={`absolute top-[58px] sm:left-[-135px] xs:left-[0px] w-[183px] h-[184px]
                                        bg-globalBgColor border-[1px] border-[#1d1f1f] rounded-[12px]
                                        p-[16px] gap-[16px] ${shareMenuToggle ? "flex flex-col" : "hidden"}`}>
                            <NormalButton caption="Continue" styles="bg-[#1F1F20]"/>
                            <NormalButton caption="Share on twitter" styles="bg-primary" onClick={() => { alert("go go go"); setShareMenuToggle(false); }} />
                            <NormalButton caption="Share on discord" styles="bg-primary" onClick={() => { alert("go go go"); setShareMenuToggle(false); }} />
                        </div> */}
                    </div>

                    {/* <div className={`absolute top-[24px] right-[65px]`}>
                        <SocialIcon>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.98407 2.85668L2.59678 9.37137C2.3556 9.61877 2.1222 10.1061 2.07552 10.4434L1.78767 12.8724C1.68653 13.7495 2.34004 14.3492 3.24251 14.1993L5.74763 13.787C6.09773 13.727 6.58786 13.4796 6.82904 13.2247L13.2163 6.71002C14.3211 5.5855 14.819 4.30356 13.0996 2.73673C11.3881 1.1849 10.0888 1.73216 8.98407 2.85668Z" stroke="#F3F3F3" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 4.44434C8.28053 6.34984 9.7419 7.80658 11.5556 7.99989" stroke="#F3F3F3" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </SocialIcon>
                    </div>

                    <div className={`absolute top-[24px] right-[10px] `}>
                        <SocialIcon>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 6V2H10" stroke="#F3F3F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 10V14H6" stroke="#F3F3F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2L9 7" stroke="#F3F3F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 9L2 14" stroke="#F3F3F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </SocialIcon>
                    </div> */}
                </div>
            )}
        </div>
    )
}

export default BannerImage
