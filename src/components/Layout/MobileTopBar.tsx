import Image from 'next/image'

import { LogoSVGImg } from 'components/Common/Images'
import {
    MenuIcon,
    MobileMenuCloseIcon,
    NotificationIcon,
} from 'components/icons'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

type MobileTopBarProps = {
    mobileMenuToggler: boolean
    onClick: any
}

const MobileTopBar = (props: MobileTopBarProps) => {
    return (
        <div
            className="sm:hidden xs:flex h-[80px] w-full py-[19px] px-[24px] justify-between border-[1px] border-[#1d1f1f]
                        items-center z-[1001]"
        >
                <div className="border-[1px] border-[#f3f3f3] rounded-[20px] w-10 h-10 cursor-pointer">
                    <Image src={LogoSVGImg} width={40} height={40} alt={"image"}/>
                </div>
                <WalletMultiButton
                    style={{
                        fontSize: '18px',
                        padding: '15px 20px',
                        borderRadius: '10px',
                    }}
                />
        </div>
    )
}

export default MobileTopBar
