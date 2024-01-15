import RoomsAvatarPanel from 'components/Common/Panels/RoomsAvatarPanel'
import { SettingsRoomsTabData } from 'data/Profile'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import NoGalleryCollection from './NoGalleryCollection'
import RoomAvatar from './RoomAvatar'

const ProfileRoomsContent = (props) => {
    const [ownRooms, setOwnRooms] = useState([])

    useEffect(() => {
        var rooms = []
        if (!!props.user.rooms) {
            for (var i = 0; i < props.user.rooms.length; i++) {
                rooms.push({
                    srcUrl: props.user.rooms[i].imageUrl,
                    title: props.user.rooms[i].title,
                    no: props.user.rooms[i].roomNo,
                })
            }
            setOwnRooms(rooms)
        }
    }, [!!props.user && props.user.rooms])

    const content = SettingsRoomsTabData.map((i) => {
        return (
            <RoomsAvatarPanel
                imageSrc={i.srcUrl}
                title={i.title}
                no={i.no}
                onClick={() => alert('your room')}
            />
        )
    })

    return (
        <div
            className="flex flex-row gap-[32px] my-[32px]
                        grid custom-2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 justify-items-center
                        sm:justify-around xs:justify-center"
        >
            {ownRooms.length == 0 ? (
                <NoGalleryCollection text="The user has no rooms" />
            ) : (
                ownRooms.map((i) => {
                    return (
                        <RoomAvatar
                            user={props.user}
                            title={i.title}
                            imgSrc={i.srcUrl}
                            no={i.no}
                            onClose={() => {}}
                        />
                    )
                })
            )}
        </div>
    )
}

export default ProfileRoomsContent
