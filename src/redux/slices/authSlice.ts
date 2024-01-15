import { getErrorMessage } from './../../utils/fetcher'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiCaller } from 'utils/fetcher'
import { setProfile } from './profileSlice'
import { startLoadingApp, stopLoadingApp } from './commonSlice'
import socket from 'utils/socket-client'
import { signMessage } from 'utils/walletHelpers'
import { extractError, showErrorToast, showSuccessToast } from 'utils'
import ACTIONS from 'config/actions'
import { Router } from 'next/router'
import { useLocalStorage } from 'hooks/useLocalStorage'

export interface CounterState {
    roomName: string
    userName: string
}

export const initialState = {
    logged: false,
    loading: false,
    checkingSession: true,
    userInfo: {
        solanaAddress: null,
        domain: null,
        title: null,
        daos: [],
        profileImage: {},
        backgroundImage: {},
        passportStyle: {
            logo: '#29b080',
            line: '#29b080',
            background: '#333333',
            text: '#FFFFFF',
        },
        badges: [],
        rooms: [],
    },
    step: 1,
    ref: '',
}

type loginProps = {
    publicKey: any
    walletType: 'solana' | 'ethereum'
    provider: any
    next?: any
}

// export const login = createAsyncThunk(
//     'auth/login',
//     async (
//         { publicKey, walletType, provider, next }: loginProps,
//         { dispatch }
//     ) => {
//         let response = false
//         try {
//             const {
//                 data: { nonce },
//             } = await apiCaller.post('/auth/login', {
//                 requestNonce: true,
//                 walletType,
//                 publicKey,
//             })
//             const signature = await signMessage(
//                 walletType,
//                 nonce,
//                 provider,
//                 publicKey
//             )
//             const {
//                 data: { profile },
//             } = await apiCaller.post('/auth/login', {
//                 publicKey,
//                 walletType,
//                 requestNonce: false,
//                 signature,
//             })

//             dispatch(setProfile(profile))
//             response = true
//             if (next) next()
//         } catch (err) {
//             console.log(err)
//             dispatch(stopLoadingApp())
//         }
//         return response
//     }
// )

export const logout = createAsyncThunk('auth/logout', async (_) => {
    try {
        await apiCaller.post('/auth/logout')
        return true
    } catch {
        return false
    }
})

// export const checkSession = createAsyncThunk(
//     'auth/checkSession',
//     async (_, { dispatch }) => {
//         let response = false
//         dispatch(startLoadingApp())
//         try {
//             if (!('socket' in window)) {
//                 ;(window as any).socket = socket()
//             }
//             const { data } = await apiCaller.get('/auth/check')
//             dispatch(setProfile(data.profile))
//             if (!!data.profile.username) {
//                 ;(window as any).socket.emit(ACTIONS.JOIN_EXTENSION, {
//                     name: data.profile.username,
//                 })
//             }
//             response = true
//         } catch {}
//         dispatch(stopLoadingApp())
//         return response
//     }
// )

export const checkUser = createAsyncThunk(
    'auth/checkUser',
    async (
        {
            publicKey,
            walletType,
        }: { publicKey: any; walletType: 'solana' | 'ethereum' },
        { dispatch }
    ) => {
        let response
        dispatch(startLoadingApp())
        try {
            const {
                data: { exist },
            } = await apiCaller.post('/auth/userExist', {
                publicKey,
                walletType,
            })

            if (exist) {
                const payload = {
                    value: publicKey,
                    type: 'solanaAddress',
                }
                dispatch(changeInfo({ payload: payload }))
            }

            response = exist
        } catch (err) {
            console.log(err)
        }
        dispatch(stopLoadingApp())
        return response
    }
)

export const changeInfo = createAsyncThunk(
    'auth/changeUserInfo',
    async ({
        payload,
        callback,
    }: {
        payload: {
            value: any
            type: String
        }
        callback?: () => void
    }) => {
        if (callback) callback()
        return payload
    }
)

export const updateUserInfo = createAsyncThunk(
    'auth/updateUserInfo',
    async ({ payload, callback }: { payload: any; callback?: any }) => {
        if (callback) callback()
        return payload
    }
)

export const goStep = createAsyncThunk(
    'auth/goStep',
    async ({ stepNum, callback }: { stepNum: number; callback?: any }) => {
        if (callback) callback()
        return stepNum
    }
)

export const jumpStep = createAsyncThunk(
    'auth/jumpStep',
    async ({ stepNum, callback }: { stepNum: number; callback?: any }) => {
        if (callback) callback()
        return stepNum
    }
)

// export const placeBid = createAsyncThunk(
//     'auth/placeBid',
//     async ({
//         data,
//         successFunction,
//         errorFunction,
//         finalFunction,
//     }: {
//         data: any
//         successFunction?: () => void
//         errorFunction?: (error: string) => void
//         finalFunction?: () => void
//     }) => {
//         let returnValue = null
//         try {
//             const { roomInfo, signed, connection } = data

//             const {
//                 data: { state },
//             } = await apiCaller.post('/profile/checkRoom', {
//                 roomNo: roomInfo.no,
//             })

//             if (state == true) {
//                 // uncomment below
//                 errorFunction('This room is already available.')
//                 return
//             }
//             try {
//                 await connection.sendRawTransaction(signed.serialize())
//             } catch (error: any) {
//                 errorFunction(error.message)
//                 return
//             }

//             const {
//                 data: { profile },
//             } = await apiCaller.post('/profile/buyRoom', {
//                 title: roomInfo.roomName,
//                 // subTitle: roomInfo.subTitle,
//                 imageUrl: roomInfo.imgUrl,
//                 currentBid: roomInfo.price,
//                 roomNo: roomInfo.no,
//             })
//             successFunction()
//             returnValue = { type: 'rooms', value: profile.rooms }
//         } catch (err) {
//             errorFunction(getErrorMessage(err))
//             returnValue = {}
//         }
//         finalFunction()
//         return returnValue
//     }
// )

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserInfo(state, action: PayloadAction<any>) {
            state.userInfo = {
                ...state.userInfo,
                [action.payload.type]: action.payload.value,
            }
        },
        setStep(state, action: PayloadAction<any>) {
            state.step = action.payload.stepNum
        },
    },
    extraReducers: (builder) => {
        // builder.addCase(login.fulfilled, (state, action) => {
        //     state.logged = action.payload
        // })
        // builder.addCase(checkSession.fulfilled, (state, action) => {
        //     state.logged = action.payload
        //     state.checkingSession = false
        // })
        builder.addCase(logout.fulfilled, (state, action) => {
            if (action.payload) {
                state.logged = false
                window.location.reload()
            }
        })
        builder.addCase(changeInfo.fulfilled, (state, action) => {
            if (action.payload) {
                authSlice.caseReducers.setUserInfo(state, action)
            }
        })
        builder.addCase(goStep.fulfilled, (state, action) => {
            if (action.payload) {
                state.step = action.payload
            }
        })
        builder.addCase(jumpStep.fulfilled, (state, action) => {
            if (action.payload) {
                state.step = action.payload
            }
        })
        builder.addCase(updateUserInfo.fulfilled, (state, action) => {
            if (action.payload) {
                state.userInfo = action.payload
            }
        })
    },
})

export const { setUserInfo, setStep } = authSlice.actions

export default authSlice.reducer
