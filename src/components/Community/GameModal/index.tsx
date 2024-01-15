import React, { useEffect, useState } from 'react'
import { CloseIcon } from '../../icons'
import { Rnd } from 'react-rnd'
import { useDispatch } from 'react-redux'
import { setGameModalVisibility } from 'redux/slices/commonSlice'

type GameModalType = {
    title: string
    websiteUrl: string
}

const GameModal = (props: GameModalType) => {
    const dispatch = useDispatch()
    const [status, setStatus] = useState<any>({})

    useEffect(() => {
        const innerWidth = (window as any).innerWidth
        const innerHeight = (window as any).innerHeight
        var defaultStatus = {}
        var localStatus = localStorage.getItem('modal-position')
        if (localStatus == '' || !localStatus || localStatus == '{}') {
            defaultStatus = {
                width: (((innerHeight * 85) / 100) * 16) / 9,
                height: (innerHeight * 85) / 100,
                x: (innerWidth - (((innerHeight * 85) / 100) * 16) / 9) / 2,
                y: (innerHeight * (100 - 85)) / 100 / 2,
            }
            localStorage.setItem(
                'modal-position',
                JSON.stringify(defaultStatus)
            )
        } else {
            defaultStatus = JSON.parse(localStorage.getItem('modal-position'))
        }
        console.log(defaultStatus)
        setStatus(defaultStatus)
    }, [])

    useEffect(() => {
        localStorage.setItem('modal-position', JSON.stringify(status))
    }, [status])

    const closeFunc = () => {
        dispatch(setGameModalVisibility(false))
    }

    const enabledResizing = {
        bottom: false,
        bottomLeft: true,
        bottomRight: true,
        left: false,
        right: false,
        top: false,
        topLeft: true,
        topRight: true,
    }

    const closeDlg = (e) => {
        const innerWidth = (window as any).innerWidth
        const innerHeight = (window as any).innerHeight

        const defaultStatus = {
            width: (((innerHeight * 85) / 100) * 16) / 9,
            height: (innerHeight * 85) / 100,
            x: (innerWidth - (((innerHeight * 85) / 100) * 16) / 9) / 2,
            y: (innerHeight * (100 - 85)) / 100 / 2,
        }
        localStorage.setItem('modal-position', JSON.stringify(defaultStatus))
        setStatus(defaultStatus)
        closeFunc()
    }

    return (
        <div className="fixed z-[10000] top-0 left-0">
            {status.width && status.x && (
                <Rnd
                    className="transition-none"
                    size={{ width: status.width, height: status.height }}
                    position={{ x: status.x, y: status.y }}
                    onDragStop={(e, d) => {
                        setStatus({ ...status, x: d.x, y: d.y })
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        setStatus({
                            width: Number(ref.style.width.replace('px', '')),
                            height: Number(ref.style.height.replace('px', '')),
                            ...position,
                        })
                    }}
                    lockAspectRatio={16 / 9}
                    minHeight={'281'}
                    maxHeight={'90vh'}
                    minWidth={'500'}
                    maxWidth={'90vw'}
                    dragHandleClassName={`${'handleDraggling'}`}
                    enableResizing={enabledResizing}
                >
                    <div
                        className={`modal-content w-[100%] h-[100%] flex flex-col relative bg-globalBgColor border-[1px] border-[#3d3f3f] rounded-[10px] resize select-none ${'px-[10px] pb-[10px] pt-[30px]'}`}
                    >
                        <div
                            className={`${'handleDraggling'} m-auto right-0 h-[30px] w-[95%] absolute top-0 left-0 z-[10000] rounded-[50px] overflow-hidden cursor-move`}
                        ></div>
                        <div
                            className="absolute top-[10px] right-[12px] cursor-pointer text-white z-[10001]"
                            onClick={closeDlg}
                        >
                            <CloseIcon />
                        </div>
                        <iframe
                            src={props.websiteUrl}
                            frameBorder="0"
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </Rnd>
            )}
        </div>
    )
}

export default GameModal
