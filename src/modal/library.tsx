export type GameLibraryDataType = {
    image: string
    title: string
    likes: number
    members: number
    owner: string
    category: string
    iframe: string
    description: string
    twitter?: string
    discord?: string
    website?: string
    quests?: Array<{
        title: string
        description: string
        image: string
        rarity: number
        price: number
    }>
    stores?: Array<{
        title: string
        image: string
        price: number
    }>
    reviews?: Array<{
        owner: string
        likes: number
        dislikes: number
        content: string
        createAt: string
    }>
}

export type LiveEventsDataType = {
    image: string
    title: string
    creator: {
        avatar: string
        name: string
    }
    friends: Array<{
        avatar: string
        name: string
    }>
    createAt: string
}

export type FriendsDataType = {
    avatar: string
    name: string
    link?: string
}

export type RoomListDataType = {
    imgUrl: string
    roomName: string
}
