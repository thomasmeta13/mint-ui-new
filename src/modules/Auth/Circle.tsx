import React, { useEffect, useState } from 'react'
import { useLocalStorage } from '@solana/wallet-adapter-react'

const Circle = (props) => {
    const { step } = props
    const [percent, setPercent] = useState<number>(0)

    useEffect(() => {
        let temp = percent
        var timer = setInterval(() => {
            if (temp == (step - 1) * 20) clearInterval(timer)
            setPercent(temp)
            if (temp < (step - 1) * 20) temp++
            if (temp > (step - 1) * 20) temp--
        }, 10)
    }, [step])

    return (
        <div className="px-5">
            <div className={`relative h-full w-full`}>
                <div className="w-[210px] h-[210px] m-auto">
                    <div className="text-white items-center flex h-full">
                        <div className="text-center m-auto h-full w-full">
                            <div className="register-progress relative h-full w-full register">
                                <svg className="circle-loading-bar hidden sm:block w-full h-full">
                                    <circle cx="105" cy="105" r="100"></circle>
                                    <circle
                                        cx="105"
                                        cy="105"
                                        r="100"
                                        style={{ '--percent': percent }}
                                    ></circle>
                                </svg>
                                <div
                                    className={`absolute ${
                                        percent < 10
                                            ? 'sm:left-[80px]'
                                            : 'sm:left-[66px]'
                                    } top-[50px] left-[65px]`}
                                >
                                    <h2 className="loading-status text-[40px] sm:text-[54px] font-bold font-['Outfit']">
                                        {percent}
                                        <span className="text-[32px]">%</span>
                                    </h2>
                                    <span className="text-xs sm:text-lg">
                                        {(step - 1) * 20}/100
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Circle
