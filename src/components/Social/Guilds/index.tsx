import React from 'react'
import { GUILDS } from '../../../data/Community'
import Item from '../../Community/Communities/Item'

const Guilds = () => {
    return (
        <div>
            <div className='text-[28px] text-[#F3F3F3] font-["outfit"] font-[500] gap-2'>
                Guilds <span className="text-[#474749]">{GUILDS.length}</span>
            </div>
            <div className="grid custom-2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 gap-[32px] mt-[24px]">
                {GUILDS.map((community, index) => (
                    <Item
                        key={index}
                        id={index}
                        avatarUrl={community.avatarUrl}
                        backUrl={community.backUrl}
                        communityName={community.communityName}
                        memberNumber={community.memberNumber}
                        icon={community.icon}
                    />
                ))}
            </div>
        </div>
    )
}

export default Guilds
