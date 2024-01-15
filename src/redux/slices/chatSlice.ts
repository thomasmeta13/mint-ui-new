import { createSlice, PayloadAction, current } from '@reduxjs/toolkit'
import ACTIONS from 'config/actions'
import CONSTANT from 'config/constant'
import { eqArraySets } from 'utils'

export interface CounterState {
    chatSidebarVisibility: boolean
    roomName: string
    userName: string
    modelIndex: Number
    socket: Object
    peers: any[]
    rooms: any[]
    msgs: any[]
    selectedIndex: number
    selectedRoom: Object // Select a room to create
    newRoomTitle: string // Room name to create
    newModelIndex: number //New model index
    createModalVisibility: boolean
    joinModalVisibility: boolean
    activeRoomTypeIndex: number
    mobileBanner: boolean
    isNewChatModal: boolean
    members: any[]
    chatLogs: any[]
    friends: any[]
    chatType: boolean
    newMsg: any
    typingState: boolean
    typingMembers: any
    selectedChatUserName: string
    chatKind: number
    selectedChat: any // Id of user who are selected for chat.
    dms: any[]
    groups: any[]
    DMChats: any[]
    sidebarState: boolean
}

const initialState: CounterState = {
    chatSidebarVisibility: false,
    roomName: '',
    userName: '',
    modelIndex: 0,
    socket: {},
    peers: [],
    rooms: [],
    msgs: [],
    selectedIndex: -1,
    selectedRoom: {},
    newRoomTitle: '',
    newModelIndex: 0,
    createModalVisibility: false,
    joinModalVisibility: false,
    activeRoomTypeIndex: 0,
    mobileBanner: false,
    isNewChatModal: false,
    members: [],
    chatLogs: [],
    friends: [],
    chatType: false,
    newMsg: {
        reply: {
            replying: false,
            replyId: '',
            replyToWhom: '',
            hisMsg: '',
        },
        myMsg: '',
        attachments: {
            fileExists: false,
            files: [],
        },
    },
    typingState: false,
    typingMembers: [],
    selectedChatUserName: '',
    chatKind: CONSTANT.GLOBAL_CHAT,
    selectedChat: {
        id: '',
        name: 'Global Chat',
    },
    dms: [],
    groups: [],
    DMChats: [],
    sidebarState: false,
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        createRoom: (state, action: PayloadAction<any>) => {
            state.roomName = action.payload.roomName
            state.userName = action.payload.userName
            state.modelIndex = action.payload.modelIndex
            localStorage.setItem('roomName', action.payload.roomName)
            localStorage.setItem('userName', action.payload.userName)
            localStorage.setItem('name', action.payload.userName)
            localStorage.setItem('modelIndex', action.payload.modelIndex)
            if (!!(window as any).socket) {
                ;(window as any).socket.emit(ACTIONS.JOIN, {
                    roomId: -1,
                    user: {
                        name: state.userName,
                        title: action.payload.title,
                        type: action.payload.type,
                        roomNo: action.payload.roomNo,
                        roomName: state.roomName,
                        modelIndex: state.modelIndex,
                        imageUrl: action.payload.imageUrl,
                    },
                })
            }
        },
        setRoom: (state, action: PayloadAction<any>) => {
            state.roomName = action.payload.roomName
            state.userName = action.payload.userName
            state.modelIndex = action.payload.modelIndex
            localStorage.setItem('roomName', action.payload.roomName)
            localStorage.setItem('userName', action.payload.userName)
            localStorage.setItem('name', action.payload.userName)
            localStorage.setItem('modelIndex', action.payload.modelIndex)
        },
        setName(state, action: PayloadAction<any>) {
            localStorage.setItem('name', action.payload)
            state.userName = action.payload
        },
        setSocket(state, action: PayloadAction<any>) {
            state.socket = action.payload
        },
        addPeer(state, action: PayloadAction<any>) {
            state.peers.push(action.payload)
        },
        addRoom(state, action: PayloadAction<any>) {
            state.rooms.push(action.payload)
        },
        setRooms(state, action: PayloadAction<any>) {
            state.rooms = action.payload
        },
        addMsg(state, action: PayloadAction<any>) {
            state.msgs.push(action.payload)
        },
        removePeer(state, action: PayloadAction<any>) {
            var peerindex = state.peers.findIndex(
                (s: any) => s.name === action.payload.name
            )
            if (peerindex !== -1) state.peers.splice(peerindex, 1)
        },
        setMsg(state, action: PayloadAction<any>) {
            state.msgs = action.payload
        },
        setPeers(state, action: PayloadAction<any>) {
            state.peers = action.payload
        },
        setRoomIndex(state, action: PayloadAction<any>) {
            state.selectedIndex = action.payload
        },
        setModel(state, action: PayloadAction<any>) {
            state.modelIndex = action.payload
        },
        setSelectedRoom(state, action: PayloadAction<any>) {
            state.selectedRoom = action.payload
        },
        setCreateModalVisibility(state, action: PayloadAction<any>) {
            state.createModalVisibility = action.payload
        },
        setJoinModalVisibility(state, action: PayloadAction<any>) {
            state.joinModalVisibility = action.payload
        },
        setNewRoomTitle(state, action: PayloadAction<any>) {
            state.newRoomTitle = action.payload
        },
        setActiveRoomTypeIndex(state, action: PayloadAction<number>) {
            state.activeRoomTypeIndex = action.payload
        },
        setNewModelIndex(state, action: PayloadAction<number>) {
            state.newModelIndex = action.payload
        },
        setMobileBanner(state, action: PayloadAction<boolean>) {
            state.mobileBanner = action.payload
        },
        setIsNewChatModal(state, action: PayloadAction<boolean>) {
            state.isNewChatModal = action.payload
        },
        setMembers: (state, action) => {
            state.members = action.payload
        },
        setNewMsg: (state, action) => {
            state.newMsg = action.payload
        },
        setUserMsg: (state, action) => {
            if (
                action.payload.groupType == CONSTANT.GLOBAL_CHAT &&
                state.chatKind == CONSTANT.GLOBAL_CHAT
            ) {
                state.chatLogs.push(action.payload)
            } else if (
                action.payload.groupType == CONSTANT.YGG_CHAT &&
                state.chatKind == CONSTANT.YGG_CHAT
            ) {
                state.chatLogs.push(action.payload)
            } else {
                if (action.payload.groupType == CONSTANT.DM_CHAT) {
                    if (
                        (state.chatKind == CONSTANT.DM_CHAT &&
                            action.payload.members[0] ==
                                state.selectedChat.id) ||
                        action.payload.members[0] ==
                            localStorage.getItem('userId')
                    ) {
                        state.chatLogs.push(action.payload)
                        state.sidebarState = !current(state).sidebarState
                        return
                    }
                    ;(window as any).socket.emit(ACTIONS.CHANGE_READ_STATE, {
                        msgId: action.payload.msgId,
                    })
                    state.sidebarState = !current(state).sidebarState
                }
            }
        },
        setDMChats: (state, action) => {
            if (action.payload.type) {
                state.DMChats = action.payload.data
            } else {
                console.log('ban')
                // state.DMChats.push(action.payload.data);
            }
        },
        clearUserMsg: (state, action) => {
            state.chatLogs = []
        },
        setFriends: (state, action) => {
            state.friends = action.payload
        },
        setOnline: (state, action) => {
            const newUser = action.payload
            state.friends.map((friend, index) => {
                if (friend.name == newUser.name) {
                    state.friends[index]['onlineFlag'] = true
                    alert('new friend joined!')
                }
            })
        },
        setTypingState: (state, action) => {
            if (action.payload.chatKind == state.chatKind) {
                if (
                    action.payload.chatKind == CONSTANT.DM_CHAT &&
                    !eqArraySets(
                        (window as any).members,
                        action.payload.members
                    )
                ) {
                    return
                }
                if (action.payload.state == 'false') {
                    const memberIndex = state.typingMembers.findIndex(
                        (s) => s == action.payload.name
                    )
                    if (memberIndex != -1) {
                        state.typingMembers.splice(memberIndex, 1)
                        if (state.typingMembers.length == 0) {
                            state.typingState = false
                        }
                    }
                } else {
                    state.typingState = true
                    const memberIndex = state.typingMembers.findIndex(
                        (s) => s == action.payload.name
                    )
                    if (memberIndex == -1) {
                        state.typingMembers.push(action.payload.name)
                    }
                }
            }
        },
        setReply: (state, action) => {
            state.newMsg.reply = {
                replying: true,
                replyToWhom: action.payload.replyToWhom,
                hisMsg: action.payload.hisMsg,
                replyId: action.payload.replyId,
            }
        },
        setSelectedChatUserName: (state, action) => {
            state.selectedChatUserName = action.payload
        },
        setChatSidebarVisibility: (state, action: PayloadAction<boolean>) => {
            state.chatSidebarVisibility = action.payload
        },
        setChatKind: (state, action: PayloadAction<number>) => {
            state.chatKind = action.payload
        },
        setSelectedChat: (state, action: PayloadAction<any>) => {
            state.selectedChat = action.payload
        },
        addDMs: (state, action: PayloadAction<any>) => {
            state.dms.push(action.payload)
        },
        setDMs: (state, action: PayloadAction<any[]>) => {
            state.dms = action.payload
        },
    },
})

export const {
    setSelectedChat,
    setChatKind,
    setCreateModalVisibility,
    setChatSidebarVisibility,
    setSelectedChatUserName,
    setReply,
    setTypingState,
    clearUserMsg,
    setUserMsg,
    setFriends,
    setOnline,
    setMembers,
    setNewMsg,
    setMobileBanner,
    setIsNewChatModal,
    setJoinModalVisibility,
    createRoom,
    setName,
    setSelectedRoom,
    setNewRoomTitle,
    setNewModelIndex,
    setActiveRoomTypeIndex,
    setSocket,
    addPeer,
    addRoom,
    setRooms,
    addMsg,
    removePeer,
    setMsg,
    setRoomIndex,
    setModel,
    setPeers,
    setRoom,
    addDMs,
    setDMs,
    setDMChats,
} = chatSlice.actions

export default chatSlice.reducer
