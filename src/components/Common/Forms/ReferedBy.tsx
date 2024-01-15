import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { initialState } from 'redux/slices/authSlice'

const ReferredBy = (props) => {
    const { changeValue, caption } = props
    // const { query: { title } } = useRouter();
    const [stateInfo, setStateInfo] = useLocalStorage('stateInfo', initialState)
    
    const [classFocus, setClassFocus] = useState('text-white/60')
    const [classBorder, setClassBorder] = useState('border-white/10')
    const [refValue, setRefValue] = useState<any>(stateInfo.ref)
    const focusInput = () => {
        setClassFocus('top-[-15%] !text-[12px] text-primary')
        setClassBorder('border-primary')
    }
    const unFocusInput = () => {
        if (!refValue) {
            setClassFocus('text-white/60')
            setClassBorder('border-white/10')
        } else {
        }
    }

    useEffect(() => {
        if (refValue) {
            setClassFocus('top-[-15%] !text-[12px] text-primary')
            setClassBorder('border-primary')
        }
    }, [refValue])

    return (
        <div className="w-full">
            <div
                className={`relative flex items-center rounded-[18px] border-[1.5px] p-1 sm:p-2 ${classBorder}`}
            >
                <span
                    className={`absolute bg-[#141416] text-[14px] sm:text-[18px] px-2 tracking-[0.02rem] z-10 ${classFocus}`}
                >
                    {caption}
                </span>
                <input
                    className="appearance-none  text-[14px] sm:text-[18px] tracking-[0.02rem] bg-transparent z-50 w-full h-[48px] text-white/60 mr-3 py-1 px-2 leading-tight"
                    onFocus={focusInput}
                    onBlur={unFocusInput}
                    disabled={true}
                    onChange={(e) => {
                        setRefValue(e.target.value)
                        changeValue(e.target.value, 'ref')
                    }}
                    value={refValue}
                />
            </div>
        </div>
    )
}

export default ReferredBy
