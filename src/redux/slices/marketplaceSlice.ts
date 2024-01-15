import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import ACTIONS from 'config/actions'
import { apiCaller, getErrorMessage } from 'utils/fetcher'
import { RoomItemProps } from 'components/Marketplace/Rooms/Items/Item'

export interface MarketplaceState {
    selectedRoom: any
    selectedNft: any
}

const initialState: MarketplaceState = {
    selectedRoom: {},
    selectedNft: {},
}

export const selectRoom = createAsyncThunk(
    'auth/selectRoom',
    async ({ roomData, next }: { roomData: any; next?: () => void }) => {
        if (next) next()
        return roomData
    }
)

export const selectNft = createAsyncThunk(
    'auth/selectNft',
    async ({ nftData, next }: { nftData: any; next?: () => void }) => {
        if (next) next()
        return nftData
    }
)

export const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setRoom: (state, action: PayloadAction<RoomItemProps>) => {
            state.selectedRoom = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(selectRoom.fulfilled, (state, action) => {
            if (action.payload) {
                marketplaceSlice.caseReducers.setRoom(state, action)
            }
        })
        builder.addCase(selectNft.fulfilled, (state, action) => {
            if (action.payload) {
                state.selectedNft = action.payload
            }
        })
    },
})

export const { setRoom } = marketplaceSlice.actions

export default marketplaceSlice.reducer
