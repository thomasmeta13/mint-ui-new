import React, { Suspense } from 'react'
import Model from '../Model'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { initialState } from 'redux/slices/authSlice'

const NftDemo = (props) => {
    const { modelRef } = props
    const [stateInfo] = useLocalStorage('stateInfo', initialState)

    return (
        <>
            <Canvas
                className={`!h-[250px] sm:!w-[600px] sm:!h-[500px] lg:!w-[80vw] lg:!h-[70vh] lg:top-[15vh] xl:!w-[85vw] xl:!h-[80vh] xl:!top-[10vh] custom-2xl:!w-[100vw] custom-2xl:!h-[100vh] lg:!absolute lg:!right-0 m-auto lg:pl-[170px] xl:pl-[270px] custom-2xl:pl-[500px] custom-2xl:!top-0 overflow-visible`}
                camera={{ fov: 40, position: [0, 0, 20] }}
            >
                <pointLight position={[0, 40, 100]} />
                <pointLight position={[0, 40, -100]} />
                <pointLight
                    position={[-0.83, 1.77, 0.54]}
                    color={stateInfo.userInfo.passportStyle.logo}
                    intensity={0.01}
                    rotation={[0, 0, Math.PI / 2]}
                />
                <ambientLight intensity={0.5} />
                <Suspense fallback={null}>
                    <Model
                        modelRef={modelRef}
                        domain={stateInfo.userInfo.domain}
                        title={stateInfo.userInfo.title}
                        profileImage={
                            stateInfo.userInfo.profileImage
                                ? stateInfo.userInfo.profileImage.link
                                : ''
                        }
                        passportStyle={stateInfo.userInfo.passportStyle}
                        daos={stateInfo.userInfo.daos}
                        badges={stateInfo.userInfo.badges}
                        links={stateInfo.userInfo.links}
                        backgroundImage={stateInfo.userInfo.backgroundImage}
                    />
                    <OrbitControls />
                </Suspense>
            </Canvas>
        </>
    )
}

export default NftDemo
