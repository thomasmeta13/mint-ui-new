import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { NftDemo } from './Steps';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shaga.xyz"

const SuccessModal = (props) => {
    const message = `I just minted ${props.username} Shaga Passport via @Web3Shaga!

Use my referral link!

${SITE_URL}/?ref=${props.username && props.username.replace(".shaga", "")}

#gaming #shaga #web3`;

    const handleClick = async () => {
        const encodedMessage = encodeURIComponent(message);
        const url = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
        window.open(url, "_blank");
    };

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[120] outline-none focus:outline-none">
                <div
                    className="relative w-auto my-12 mx-auto max-w-2xl"
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                >
                    {/*content*/}
                    <div className="rounded-[30px] shadow-lg relative flex flex-col w-full bg-[#141416] outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between pt-5 px-4 sm:px-8 rounded-t">
                            <h3 className="text-[22px] sm:text-[26px] text-white font-medium tracking-[0.02em]">
                                Mint Success
                            </h3>
                        </div>

                        {/*body*/}
                        <div className="relative p-4 sm:p-8 flex-auto">
                            <div className="py-3">
                                <button
                                    onClick={handleClick}
                                    className={`font-light py-[22px] px-[22px] rounded-[14px] text-white w-full h-[56px] text-[16px] sm:text-[20px] text-center tracking-wider border-none outline outline-primary hover:bg-focusbackground hover:outline-1 hover:outline-primary inline-flex items-center bg-[#1d1e20] justify-between`}
                                    title="Share on twitter"
                                >
                                    <span>
                                        <svg
                                            className="w-auto h-4 mr-2 fill-current text-[#1D9BF9]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                        >
                                            <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                                        </svg>
                                    </span>
                                    Share on Twitter
                                </button>
                            </div>
                            <div className="py-3">
                                <button
                                    className={`font-light py-[22px] px-[22px] rounded-[14px] text-white w-full h-[56px] text-[16px] sm:text-[20px] text-center tracking-wider border-none outline outline-primary hover:bg-focusbackground hover:outline-1 hover:outline-primary inline-flex items-center bg-[#1d1e20] justify-between`}
                                >
                                    <span className="">Referral link</span>
                                    <div className="text-right flex flex-row items-center gap-3">
                                        {/* <Image src={wallet.adapter.icon} width={28} height={28} /> */}
                                    </div>
                                </button>
                            </div>
                            <div className="py-3">
                                <button
                                    className={`font-light py-[22px] px-[22px] rounded-[14px] text-white w-full h-[56px] text-[16px] sm:text-[20px] text-center tracking-wider border-none outline outline-primary hover:bg-focusbackground hover:outline-1 hover:outline-primary inline-flex items-center bg-[#1d1e20] justify-between`}
                                >
                                    <span className="">Skip</span>
                                    <div className="text-right flex flex-row items-center gap-3">
                                        {/* <Image src={wallet.adapter.icon} width={28} height={28} /> */}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black/70 backdrop-blur-sm fixed inset-0 z-[100]"></div>
        </>
    )
}

export default SuccessModal
