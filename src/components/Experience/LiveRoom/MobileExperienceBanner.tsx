import ACTIONS from 'config/actions'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { setMobileBanner } from 'redux/slices/chatSlice'
import RoomInfoDlg from '../RoomInfoDlg'

const MobileExperienceBanner = () => {
    const dispatch = useDispatch()
    const { selectedIndex, rooms, mobileBanner } = useSelector(
        (state: RootStateOrAny) => ({
            selectedIndex: state.chat.selectedIndex,
            mobileBanner: state.chat.mobileBanner,
            rooms: state.chat.rooms,
        })
    )

    const [selectedLiveRoom, setSelectedLiveRoom] = useState<any>({})

    useEffect(() => {
        document
            .getElementsByTagName('html')[0]
            .classList.remove('a-fullscreen')
        if (selectedIndex != -1 && rooms[selectedIndex]) {
            setSelectedLiveRoom(rooms[selectedIndex])
        }
    }, [rooms, selectedIndex])

    useEffect(() => {
        setTimeout(() => {
            if (!!(window as any).socket)
                (window as any).socket.emit(ACTIONS.ROOM_LIST, {})
        }, 100)
    }, [])
    return (
        <div
            className={`${
                mobileBanner ? 'flex' : 'hidden'
            } justify-center fixed top-[0px] bottom-[0px] right-[0px] left-[0px] backdrop-blur-sm w-full h-full z-[2000] touch-none`}
        >
            <div
                className={`fixed top-[72px] bottom-[0px] right-[0px] left-[0px] rounded-t-[25px] overflow-hidden
                    flex justify-center items-end bg-center`}
                style={{
                    backgroundImage: `url(${
                        !!selectedLiveRoom.imageUrl
                            ? selectedLiveRoom.imageUrl
                            : `/images/experience/room_images/room_1.jpg`
                    }`,
                }}
            >
                <div
                    className="fixed top-[24px] right-[47vw] "
                    onClick={() => dispatch(setMobileBanner(false))}
                >
                    <svg
                        width="17"
                        height="18"
                        viewBox="0 0 17 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.4314 15.5008L9.93216 9.00135L16.4315 2.50192C16.8271 2.10625 16.8271 1.46663 16.4315 1.07097C16.0358 0.675303 15.3962 0.675303 15.0005 1.07097L8.50124 7.57039L2.00189 1.07097C1.60623 0.675303 0.966619 0.675303 0.570961 1.07097C0.175305 1.46663 0.175305 2.10625 0.570961 2.50192L7.07028 9.00135L0.570961 15.5008C0.175305 15.8964 0.175305 16.5361 0.570961 16.9317C0.768281 17.129 1.02742 17.2282 1.28643 17.2282C1.54544 17.2282 1.80457 17.129 2.00189 16.9317L1.96653 16.8964L2.00189 16.9317L8.5012 10.4323L15.0005 16.9317C15.1978 17.129 15.457 17.2282 15.716 17.2282C15.975 17.2282 16.2341 17.129 16.4314 16.9317C16.8271 16.5361 16.8271 15.8964 16.4314 15.5008Z"
                            fill="#B3B3B7"
                            stroke="#B3B3B7"
                            strokeWidth="0.1"
                        />
                    </svg>
                </div>
                {!!selectedLiveRoom.title && (
                    <RoomInfoDlg selectedLiveRoom={selectedLiveRoom} />
                )}
            </div>
        </div>
    )
}

export default MobileExperienceBanner
