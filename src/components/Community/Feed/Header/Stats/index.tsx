import React, { useEffect, useState } from 'react'
import axios from 'axios'
import StatsItem from './StatsItem'
import { MembersIcon } from 'components/Community/Feed/Header/Stats/icons/MembersIcon'
import { TotalSupplyIcon } from 'components/Community/Feed/Header/Stats/icons/TotalSupplyIcon'
import { FloorPriceIcon } from 'components/Community/Feed/Header/Stats/icons/FloorPriceIcon'
import { communities, games, stats } from '../../../../../data/Community'

type StatsType = {
    id: number
    type: string
}

function Stats(props: StatsType) {
    const [community, setCommunity] = useState<any>({})
    const [floorPrice, setFloorPrice] = useState(0)

    useEffect(() => {
        var tmp
        if (props.type == 'community') {
            setCommunity(communities[props.id])
            tmp = communities[props.id]
        } else {
            setCommunity(games[props.id])
            tmp = games[props.id]
        }
        async function fetchNFTDetail() {
            const { data } = await axios.get(
                `https://api-mainnet.magiceden.dev/v2/collections/${tmp.collectionName}/stats`
            )

            setFloorPrice(data.floorPrice / 1.0 / 1000000000)
        }
        fetchNFTDetail()
    }, [])

    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 gap-[24px]">
            <StatsItem
                key={0}
                icon={<MembersIcon />}
                count={community.memberNumber}
                name={'Members'}
            />
            <StatsItem
                key={1}
                icon={<TotalSupplyIcon />}
                count={community.totalSupply}
                name={'Total supply'}
            />
            <StatsItem
                key={2}
                icon={<FloorPriceIcon />}
                count={floorPrice}
                unit={'SOL'}
                name={'Floor price'}
            />
        </div>
    )
}

export default Stats
