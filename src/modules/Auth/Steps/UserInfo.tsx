import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import * as yup from 'yup'

import {
    WalletButton,
    PrimaryButton,
    BackButton,
} from 'components/Common/Buttons'
import { DomainInput, SharedInput } from 'components/Common/Forms'
import { showErrorToast } from 'utils'
import { useDebounce } from 'use-debounce'
import { apiCaller, getErrorMessage } from 'utils/fetcher'

import { initialState } from 'redux/slices/authSlice'
import { StepTitle, WalletAddress } from './Components'
import ReferredBy from 'components/Common/Forms/ReferedBy'
import { useLocalStorage } from 'hooks/useLocalStorage'

const UserInfo = (props) => {
    const {
        query: { domain, title, ref },
    } = useRouter()
    const [error, setError] = useState(null)
    const [stateInfo, setStateInfo] = useLocalStorage('stateInfo', initialState)
    const [step, setUserStep] = useLocalStorage('step', 1)

    const [inputValue, setInputValue] = useState<string>()
    const [debouncedValue] = useDebounce(inputValue, 1000)

    useEffect(() => {
        // console.log(step)
        setUserStep(1)
    }, [stateInfo])

    useEffect(() => {
        // if (!domain) {
        //   setError("Please input your domain name.");
        //   return;
        // }
        if (stateInfo.userInfo.domain !== null) {
            let formatted = stateInfo.userInfo.domain.toLowerCase()
            formatted = formatted.replace(' ', '')
            formatted = formatted.substr(0, formatted.lastIndexOf('.'))
            // console.log(formatted)
            setInputValue(formatted)
        }
    }, [stateInfo.userInfo.domain])

    useEffect(() => {
        if (domain) {
            setStateInfo((prev) => ({
                ...prev,
                userInfo: {
                    ...prev.userInfo,
                    domain: domain,
                },
            }))
        }
    }, [domain])

    useEffect(() => {
        if (title) {
            setStateInfo((prev) => ({
                ...prev,
                userInfo: {
                    ...prev.userInfo,
                    title: title,
                },
            }))
        }
    }, [title])

    useEffect(() => {
        if (ref) {
            setStateInfo((prev) => ({
                ...prev,
                ref: ref,
            }))
        }
    }, [ref])

    useEffect(() => {
        checkDomainAvailability()
    }, [debouncedValue])

    const checkDomainAvailability = () => {
        apiCaller
            .get(`auth/domain-availability/${debouncedValue}`)
            .then((response) => {
                // console.log(response.data)
                const result = response.data
                if (result.available) {
                    setError(null)
                } else {
                    setError(result.reason)
                }
            })
            .catch((err) => {
                const message = getErrorMessage(err)
                showErrorToast(message)
            })
    }

    const changeInfoValue = (value, type) => {
        if (type === 'domain') {
            setStateInfo((prev) => ({
                ...prev,
                userInfo: {
                    ...prev.userInfo,
                    domain: value,
                },
            }))
        } else {
            setStateInfo((prev) => ({
                ...prev,
                userInfo: {
                    ...prev.userInfo,
                    title: value,
                },
            }))
        }
    }

    const onContinue = () => {
        setUserStep(2)
    }

    const onUndo = () => {
        setStateInfo((prev) => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                domain: null,
                title: null,
            },
        }))
        setUserStep(1)
    }

    return (
        <>
            <div className="flex items-center justify-between pt-8 pl-5 pr-5 lg:px-5 lg:pt-8 lg:pb-0 rounded-t">
                <h3 className="hidden lg:block text-[22px] sm:text-[30px] text-white font-medium tracking-[0.02em]">
                    General
                </h3>
                <div className="block lg:hidden">
                    <StepTitle caption={'General'} />
                </div>
                <WalletAddress />
            </div>
            <div className="relative px-5 sm:pt-5 lg:px-5 lg:pt-10 flex-auto">
                <div>
                    <DomainInput
                        changeValue={changeInfoValue}
                        isError={error ? true : false}
                        initValue={stateInfo.userInfo.domain}
                        setError={setError}
                    />
                    {error ? (
                        <div className="text-[16px] text-rose-600">{error}</div>
                    ) : null}
                </div>
                <div className="mt-10 mb-10">
                    <SharedInput
                        changeValue={changeInfoValue}
                        initValue={stateInfo.userInfo.title}
                        caption="Input your bio"
                    />
                </div>
                <div className="mt-10 mb-5">
                    {stateInfo.ref && (
                        <ReferredBy
                            changeValue={changeInfoValue}
                            caption="Referred by"
                        />
                    )}
                </div>
            </div>
            <div className="w-full px-5 py-5 lg:px-5 lg:py-5 flex-auto flex items-end">
                <div className="inline-block w-[20%] pr-2">
                    <BackButton
                        onClick={() => onUndo()}
                        styles="rounded-[15px]"
                    />
                </div>
                <div className="inline-block w-[80%] pl-2">
                    <PrimaryButton
                        caption="Continue"
                        icon=""
                        bordered={false}
                        onClick={() => onContinue()}
                        disabled={
                            error ||
                            error !== null ||
                            !stateInfo.userInfo.domain
                                ? true
                                : false
                        }
                        styles="rounded-[15px]"
                    />
                </div>
            </div>
        </>
    )
}

export default UserInfo
