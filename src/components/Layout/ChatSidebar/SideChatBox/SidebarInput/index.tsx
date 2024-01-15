import React, { useEffect, useState } from 'react'
import EmojiList from '../../../../Experience/RoomInterior/ChattingBox/EmojiList'

import TextareaAutosize from 'react-textarea-autosize'
import SendButton from '../../../../Experience/RoomInterior/ChattingBox/SendButton'
import EmojiButton from '../../../../Experience/RoomInterior/ChattingBox/EmojiButton'
import UploadButton from '../../../../Experience/RoomInterior/ChattingBox/UploadButton'
import ReplyPart from '../../../../Experience/RoomInterior/ChattingBox/ReplyPart'
import FileListPart from '../../../../Experience/RoomInterior/ChattingBox/FileListPart'
import TypingNotification from '../../../../Experience/RoomInterior/ChattingBox/TypingNotification'
import { useRouter } from 'next/router'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import ACTIONS from 'config/actions'
import { setNewMsg } from 'redux/slices/chatSlice'

type SidebarInputType = {
    isSocial?: boolean
    focusState: boolean
    setFocusState: any
    newMsgDataState: any
    setNewMsgDataState: any
}

const SidebarInput = (props: SidebarInputType) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const {
        profileData,
        members,
        chatKind,
        newMsg,
        typingState,
        typingMembers,
    } = useSelector((state: RootStateOrAny) => ({
        profileData: state.profile.data,
        members: state.chat.members,
        chatKind: state.chat.chatKind,
        newMsg: state.chat.newMsg,
        typingState: state.chat.typingState,
        typingMembers: state.chat.typingMembers,
    }))
    const { rid } = router.query

    const [showEmoji, setShowEmoji] = useState(false)
    const [scrollBarDisp, setScrollBarDisp] = useState(false)

    // =============================================
    const [selectedFile, setSelectedFile] = useState([])
    const [preview, setPreview] = useState([])
    // =============================================

    const setScrollBarVisibility = (height) => {
        parseInt(height) == 240
            ? setTimeout(() => setScrollBarDisp(true), 200)
            : setScrollBarDisp(false)
    }

    const getReadyEmoji = () => {
        setShowEmoji(!showEmoji)
        ;(document as any).getElementById('chatting_input').focus()
    }

    const getReadyUpload = () => {
        let file_dlg = document.getElementById('file_dlg')
        if (file_dlg) {
            file_dlg.dispatchEvent(new MouseEvent('click'))
        }
    }

    const readFiles = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile([])

            return
        }
        let fileNameArray = []
        for (const file of e.target.files) {
            fileNameArray.push(file.name)
        }
        setSelectedFile(e.target.files)
    }

    useEffect(() => {
        if (!selectedFile) {
            setPreview([])
            return
        }
        let previewUrlArray = []
        for (let k of selectedFile) {
            const objectUrl = URL.createObjectURL(k)
            previewUrlArray.push(objectUrl)
        }

        setPreview(previewUrlArray)
        previewUrlArray = []
        // free memory when ever this component is unmounted
        return () => {
            for (let j of preview) URL.revokeObjectURL(j)
        }
    }, [selectedFile])

    // Init
    useEffect(() => {
        ;(window as any).typingCounts = 0
    }, [])

    const enterKeyCapture = (e) => {
        if ((window as any).typingCounts == 0) {
            ;(window as any).socket.emit(ACTIONS.TYPING_STATE, {
                members,
                name: profileData.username,
                state: 'true',
                chatKind,
            })
        }
        ;(window as any).typingCounts++
        setTimeout(() => {
            ;(window as any).typingCounts--
            if ((window as any).typingCounts == 0) {
                ;(window as any).socket.emit(ACTIONS.TYPING_STATE, {
                    members,
                    name: profileData.username,
                    state: 'false',
                    chatKind,
                })
            }
        }, 1000)
        if (e.key === 'Enter') {
            if (
                (e.keyCode === 13 && e.shiftKey) ||
                (e.keyCode === 13 && e.ctrlKey)
            ) {
                return
            }
            e.preventDefault()
            let current_val = e.target.value
            current_val = current_val.replace(/[\r\n]/gm, '')
            current_val = current_val.replace(/[\n]/gm, '')
            current_val = current_val.replace(/[ ]/gm, '')
            current_val = current_val.replace(/[\t]/gm, '')
            if (current_val === '') {
                return
            }

            let files = []
            for (var i = 0; i < selectedFile.length; i++) {
                files.push({
                    name: selectedFile[i].name,
                    url: preview[i],
                })
            }
            ;(window as any).socket.emit(ACTIONS.SEND_MSG_EXTENSION, {
                groupType: chatKind,
                daoId: null,
                members: members,
                content: e.target.value,
                reply: newMsg.reply,
                attachments: {
                    fileExists: files.length != 0,
                    files,
                },
                date: Date(),
                editState: false,
                deleteState: false,
            })
            setSelectedFile([])
            e.target.value = ''
            dispatch(
                setNewMsg({
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
                })
            )
        } else if (e.key == 'Tab') {
            e.preventDefault()
            var start = e.target.selectionStart
            var end = e.target.selectionEnd

            // set textarea value to: text before caret + tab + text after caret
            e.target.value =
                e.target.value.substring(0, start) +
                '\t' +
                e.target.value.substring(end)

            // put caret at right position again
            e.target.selectionStart = e.target.selectionEnd = start + 1
        }
    }

    const send = () => {
        let chatting_input = document.getElementById(
            'chatting_input'
        ) as HTMLTextAreaElement
        let current_val = chatting_input.value
        current_val = current_val.replace(/[\r\n]/gm, '')
        current_val = current_val.replace(/[\n]/gm, '')
        current_val = current_val.replace(/[ ]/gm, '')
        current_val = current_val.replace(/[\t]/gm, '')
        if (current_val === '') {
            return
        }
        let files = []
        for (var i = 0; i < selectedFile.length; i++) {
            files.push({
                name: selectedFile[i].name,
                url: preview[i],
            })
        }

        ;(window as any).socket.emit(ACTIONS.SEND_MSG_EXTENSION, {
            groupType: chatKind,
            daoId: null,
            members: members,
            content: chatting_input.value,
            reply: newMsg.reply,
            attachments: {
                fileExists: files.length != 0,
                files,
            },
            date: Date(),
            editState: false,
            deleteState: false,
        })

        setSelectedFile([])
        chatting_input.value = ''

        dispatch(
            setNewMsg({
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
            })
        )
    }

    return (
        <div
            className={` flex flex-col rounded-[15px] border-[1.2px] ${
                props.focusState ? 'border-primary' : 'border-[#272829]'
            } 
            mx-[18px]
            absolute bottom-[32px] ${
                props.isSocial ? 'w-[43%] bg-[#19191a]' : 'w-[85%]'
            } bg-globalBgColor shadow-[0_-35px_10px_10px_rgba(19,19,20,1)]`}
            id="chatting_input_container"
            onDragStart={(e) => e.preventDefault()}
        >
            {/* <div className=" absolute top-[-51px] right-[0px] custom-2xl:h-[30px] xs:h-[50px] w-full bg-gradient-to-t from-[#131314] via-[#131314] to-transparent"></div> */}
            {/* <TypingNotification who={["Eugene", "Alex1440", "Eugene", "Alex1440"]} /> */}
            {typingState && <TypingNotification who={[typingMembers]} />}
            <ReplyPart
                newMsgDataState={props.newMsgDataState}
                setNewMsgDataState={props.setNewMsgDataState}
            />

            <div className="flex flex-row  justify-between items-start gap-[12px] bg-globalBgColor px-[16px] py-[18px] pb-[12px] rounded-[15px]">
                <UploadButton onClick={() => getReadyUpload()} />
                <input
                    type="file"
                    className="hidden"
                    id="file_dlg"
                    name="fileList"
                    multiple
                    onChange={(e) => readFiles(e)}
                />

                <div
                    className={`flex ${
                        props.isSocial ? 'w-[85%]' : 'w-[70%]'
                    } `}
                >
                    <TextareaAutosize
                        minRows={1}
                        maxRows={10}
                        className={`${
                            scrollBarDisp ? '' : 'tas'
                        } bg-[#131314] text-[#f3f3f3] border-transparent resize-none box-border
                          mt-[-5px] h-[26px] w-[100%] overflow-visible font-['Outfit'] font-[400] text-[16px] `}
                        id="chatting_input"
                        placeholder="Write something"
                        wrap="hard"
                        onFocus={() => props.setFocusState(true)}
                        onBlur={() => props.setFocusState(false)}
                        onKeyDown={(e) => enterKeyCapture(e)}
                        onHeightChange={(height) =>
                            setScrollBarVisibility(height)
                        }
                    />
                </div>

                <EmojiButton
                    onClick={() => getReadyEmoji()}
                    showEmoji={showEmoji}
                />
                <SendButton
                    onClick={() => send()}
                    focusState={props.focusState}
                />
            </div>
            <FileListPart
                newMsgDataState={props.newMsgDataState}
                setNewMsgDataState={props.setNewMsgDataState}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                preview={preview}
            />
        </div>
    )
}

export default SidebarInput
