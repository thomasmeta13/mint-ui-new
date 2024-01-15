import React from 'react'
import { useRouter } from 'next/router'

import { SmallButton } from 'components/Common/Buttons'

export type SliderType = {
    title: string
    backgroundImage: string
    content: any
    button?: string
    path?: string
}

const Slider = (props: SliderType) => {
    const router = useRouter()
    const gotoPath = () => {
        router.push('/iframe/joinModal/Solarity Hub')
    }

    return (
        <div className="h-[89vh]">
            <img
                src={props.backgroundImage}
                className="rounded-b-[40px]"
                width={664}
                height={664}
                alt={props.title}
            />
            <div className={`px-10 ${props.button ? 'py-20 pt-6' : 'py-16'}`}>
                <h2 className="text-[25px] font-[700] title-color pb-6">
                    {props.title}
                </h2>
                <p
                    className={`center text-[15px] font-[500] content-color ${
                        props.button ? 'pb-4' : 'pb-12'
                    }`}
                >
                    {props.content}
                </p>
                {props.button && (
                    <SmallButton caption={props.button} onClick={gotoPath} />
                )}
            </div>
        </div>
    )
}

export default Slider
