'use client'
import React from 'react'

function dispatchStorageEvent(key: string, newValue: any) {
    window.dispatchEvent(new StorageEvent('storage', { key, newValue }))
}

const setLocalStorageItem = (key: string, value: any) => {
    const stringifiedValue = JSON.stringify(value)
    window.localStorage.setItem(key, stringifiedValue)
    dispatchStorageEvent(key, stringifiedValue)
}

const removeLocalStorageItem = (key: string) => {
    window.localStorage.removeItem(key)
    dispatchStorageEvent(key, null)
}

const getLocalStorageItem = (key: string) => {
    return window.localStorage.getItem(key)
}

const useLocalStorageSubscribe = (callback: any) => {
    window.addEventListener('storage', callback)
    return () => window.removeEventListener('storage', callback)
}

const getLocalStorageServerSnapshot = () => ''

export function useLocalStorage(key: string, initialValue: any) {
    const getSnapshot = () => getLocalStorageItem(key)

    const store = React.useSyncExternalStore(
        useLocalStorageSubscribe,
        getSnapshot,
        getLocalStorageServerSnapshot
    )

    const setState = React.useCallback(
        (v) => {
            try {
                const nextState =
                    typeof v === 'function' ? v(JSON.parse(store)) : v

                if (nextState === undefined || nextState === null) {
                    removeLocalStorageItem(key)
                } else {
                    setLocalStorageItem(key, nextState)
                }
            } catch (e) {
                console.warn(e)
            }
        },
        [key, store]
    )

    React.useEffect(() => {
        if (
            getLocalStorageItem(key) === null &&
            typeof initialValue !== 'undefined'
        ) {
            setLocalStorageItem(key, initialValue)
        }
    }, [key, initialValue])

    if (store) {
        // console.log(store)
        return [JSON.parse(store), setState]
    }
    return [initialValue, setState]
}
