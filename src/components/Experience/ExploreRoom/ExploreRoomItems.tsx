import Image from 'next/image'

type ExploreRoomItemType = {
    walletIcon: any
    collectionName: string
    roomName: string
    imgUrl: string
}

const ExploreRoomItem = (props: ExploreRoomItemType) => {
    return (
        <div
            className=" flex flex-col w-[403px] h-[310px] border-[1.2px] border-[#272829] rounded-[20px] p-[8px]
                        relative cursor-pointer hover:border-primary col-span-4"
        >
            <div className=" rounded-[15px] overflow-hidden">
                <Image
                    src={props.imgUrl}
                    layout="responsive"
                    width={387}
                    height={232}
                    alt="room_image"
                />
            </div>
            <div className=" mt-[20px] font-['Outfit'] font-[500] text-[14px] text-[#f3f3f3] ml-[12px] ">
                {props.roomName}
            </div>

            <div className="absolute flex items-center justify-center top-[20px] left-[20px] m-auto w-auto gap-[12px]">
                <span
                    className="flex items-center justify-center h-[25px] w-[25px] text-[12px] text-[#f3f3f3] bg-[rgba(12,12,14,0.5)] rounded-[15px]
                                border-[1.5px] border-[rgba(0,0,0,0)] hover:border-primary cursor-pointer"
                >
                    {props.walletIcon}
                </span>
                <span
                    className="flex items-center justify-center h-[25px] text-[12px] text-[#f3f3f3] px-2 bg-[rgba(12,12,14,0.5)] rounded-[15px]
                                border-[1.5px] border-[rgba(0,0,0,0)] hover:border-primary cursor-pointer"
                >
                    {props.collectionName}
                </span>
            </div>
        </div>
    )
}

export default ExploreRoomItem
