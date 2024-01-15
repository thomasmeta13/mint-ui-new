import React, { useEffect, useState } from 'react'
import { CheckIcon } from 'components/icons'
import { useLocalStorage } from '@solana/wallet-adapter-react'

const passportSteps = [
    'General',
    'Claim Daos',
    'Profile Picture',
    'Select Badges',
    'Edit Style & Mint',
]

const roomSteps = ['Buy Room', 'Edit with your NFT', 'Place on Twitter & share']

const ProgressBar = (props) => {
    const { step } = props
    const [currentStep, setCurrentStep] = useState(step)

    useEffect(() => {
        // console.log(step)
        setCurrentStep(step)
    }, [step])

    return (
        <div className="p-5">
            {passportSteps.map((item, index) => (
                <div
                    className="flex flex-row justify-start items-center mb-[25px] relative"
                    key={index}
                >
                    {currentStep >= index + 1 && (
                        <div className="text-white text-[20px] bg-primary rounded-full h-[40px] w-[40px] flex justify-center items-center">
                            {step == index + 1 ? index + 1 : <CheckIcon />}
                        </div>
                    )}
                    {currentStep < index + 1 && (
                        <div className="text-[#333] text-[20px] bg-transparent rounded-full h-[40px] w-[40px] bg-[#999] flex justify-center items-center">
                            {index + 1}
                        </div>
                    )}
                    <span
                        className={`${
                            currentStep > index ? 'text-white' : 'text-[#333]'
                        } text-[20px] ml-5`}
                    >
                        {item}
                    </span>
                    <div
                        className={`absolute ${
                            currentStep > index + 1 ? 'h-[25px]' : 'h-0'
                        } w-[2px] bg-primary top-[40px] left-[19px]`}
                    ></div>
                </div>
            ))}
        </div>
    )
}

export default ProgressBar
