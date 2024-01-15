import { Connection, clusterApiUrl } from '@solana/web3.js'
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz'
import { RootStateOrAny, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { apiCaller } from '../utils/fetcher'
import { Promise } from 'bluebird'
import axios from 'axios'
import { useConnection } from '@solana/wallet-adapter-react'

export const getNfts = (
    solanaAddress?: string,
    manual?: boolean
): [
    nfts: any[],
    loading: Boolean,
    error: Boolean,
    fetchNfts: () => Promise<void>
] => {
    const [solNfts, setSolNfts] = <any[]>useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const { logged, profileData } = useSelector((state: RootStateOrAny) => ({
        logged: state.auth.logged,
        profileData: state.profile.data,
    }))

    if (!solanaAddress && logged) {
        solanaAddress = profileData.solanaAddress
    }

    const getSolanaNfts = async () => {
        if (!solanaAddress) return
        setSolNfts([])

        const HELIUS_API = process.env.NEXT_PUBLIC_HELIUS_API
        let page = 1
        let hasMore = true
        let allNfts = []

        while (hasMore) {
            try {
                const response = await fetch(HELIUS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        APIKey: 'Your-API-Key', // Replace with your actual API Key
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: 'my-id',
                        method: 'getAssetsByOwner',
                        params: {
                            ownerAddress: solanaAddress,
                            page: page,
                            limit: 1000,
                        },
                    }),
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const { result } = await response.json()
                // Filter NFTs by verified collections and add to allNfts array
                const filteredNfts = result.items
                    .filter(
                        (nft) => nft.content?.metadata?.symbol !== 'Passport'
                    )
                    .map((nft) => ({
                        name: nft.content?.metadata.name || '',
                        uri: nft.content?.json_uri || '',
                        description: nft.content?.metadata?.description || '',
                        symbol: nft.content?.metadata?.symbol || '',
                        type: 'Solana',
                        image: nft.content?.files[0]?.uri || '',
                        collectionName: nft.content?.metadata.name || '',
                        collectionAddress: nft.grouping[0]?.group_value || '',
                    }))
                allNfts.push(...filteredNfts)

                if (result.items.length == 0) {
                    hasMore = false
                    break
                } else {
                    hasMore = true
                }
                page++
            } catch (error) {
                console.error('Error occurred:', error)
                break
            }
        }
        setSolNfts(allNfts)
    }

    const getAllData = async () => {
        setLoading(true)
        setError(false)
        if (solNfts && solNfts.length == 0) {
            try {
                await Promise.all([getSolanaNfts()])
            } catch (err) {
                setError(true)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!manual) {
            getAllData()
        }
    }, [])
    return [solNfts, loading, error, getAllData]
}
