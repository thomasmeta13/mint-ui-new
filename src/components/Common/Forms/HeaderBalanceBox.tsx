import React, { useEffect, useState } from 'react'
import { WalletBalanceData } from 'data/WalletBalanceData'
import { UpArrow, DownArrow } from 'components/icons'
import { RootStateOrAny, useSelector } from 'react-redux'
import { getWalletBalances } from 'hooks'

const BalanceBox = (props) => {
    const { profileData } = useSelector((state: RootStateOrAny) => ({
        profileData: state.profile.data,
    }))

    const { coins, tokens, loading, error } = getWalletBalances({
        solanaAddress: profileData.solanaAddress,
        ethereumAddress: profileData.ethereumAddress,
    })

    const [totalBalance, setTotalBalance] = useState(0)

    useEffect(() => {
        var balance = 0
        for (var i = 0; i < coins.length; i++) {
            balance += coins[i].usdValue
        }
        for (var i = 0; i < tokens.length; i++) {
            balance += tokens[i].usdValue
        }
        setTotalBalance(balance)
    }, [coins, tokens])

    return (
        <div
            className="group select-none pr-5 h-full flex flex-col justify-center pl-[12px]
                        custom-2xl:pr-[22px] xl:pr-[12px] lg:pr-[22px] md:pr-[20px] xs:pr-[20px]
                        cursor-pointer relative text-[14px] font-400"
            onMouseEnter={props.onEnter}
            onMouseLeave={props.onLeave}
        >
            <div className="text-[#929298]">Balance</div>
            <div className="flex flex-row items-center  font-500">
                <span className="text-[#F3F3F3]">
                    {totalBalance.toFixed(3)}
                </span>
                <span className="text-[#929298] px-[12px]">USD</span>
                <div className="rounded-[10px] px-[10px] py-[8px] flex flex-row py-[6px] font-500 text-[#f3f3f3]">
                    {profileData.score}
                    <div className="text-[#929298] ml-[5px] ">{'XP'}</div>
                </div>
                <div>{props.openState ? <UpArrow /> : <DownArrow />}</div>
            </div>

            <div
                className={`duration-300 px-[16px] group-hover:py-[8px] p-[0px] flex flex-col items-start absolute
                            top-[50px] opacity-0 left-[-12px] h-[0px] w-full bg-[#131314]
                            border-[#1d1f1f] border-[2px] rounded-[12px] text-white z-[1000] group-hover:h-auto group-hover:opacity-100 overflow-hidden
                            `}
            >
                {coins.map((coin, index) => (
                    <div
                        className="rounded-[10px] hover:bg-[#1d1d1f] bg-transparent px-[10px] py-[8px] w-full flex flex-row py-[6px] font-500 text-[#f3f3f3] group-hover:flex hidden hover:text-primary"
                        key={index + 1}
                    >
                        {coin.balance}
                        <div className="text-[#929298] ml-[5px] ">
                            {coin.symbol}
                        </div>
                    </div>
                ))}
                {tokens.map((token, index) => {
                    if (token.symbol != 'MBC') {
                        return (
                            <div
                                className="rounded-[10px] hover:bg-[#1d1d1f] bg-transparent px-[10px] py-[8px] w-full flex flex-row py-[6px] font-500 text-[#f3f3f3] group-hover:flex hidden hover:text-primary"
                                key={index + coins.length + 1}
                            >
                                {token.balance}
                                <div className="text-[#929298] ml-[5px] ">
                                    {token.symbol}
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default BalanceBox
