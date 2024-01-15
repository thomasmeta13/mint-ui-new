import { HomePage } from 'modules/HomePage'
import HomePageHeader from 'components/HomePageHeader'
import { useEffect, useState } from 'react'

const Home = () => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }
    return (
        <HomePageHeader>
            <div className="py-2">
                <main className="max-w-[93vw] mx-auto flex-1 px-5 sm:px-11">
                    <HomePage />
                </main>
            </div>
        </HomePageHeader>
    )
}
export default Home
