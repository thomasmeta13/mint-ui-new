'use client'
import React, { useEffect, useState } from 'react'

import Layout from 'components/Layout'
import LeaderBoardTable from 'modules/Leaderboard'
import { apiCaller } from 'utils/fetcher'
import { showErrorToast } from 'utils'

const LeaderBoard = () => {
    const [sidebarToggler, setSidebarToggler] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        setHasMounted(true)
    }, [])

    useEffect(() => {
        if (hasMounted){
        getLeaderboard()
    }
    }, [hasMounted])

    const getLeaderboard = () => {
        apiCaller
            .get(`leaderboard`)
            .then((response) => {
                // console.log(response.data)
                const result = response.data.data
                // console.log(result)
                setUsers(result)
            })
            .catch((err) => {
                const message = "Something went wrong"
                showErrorToast(message)
            })
    }

    if (!hasMounted) {
        return null
    }

    return (
        <>
        <Layout
            sidebarToggler={sidebarToggler}
            banner={<></>}
            onClick={() => setSidebarToggler(!sidebarToggler)}
        >
        </Layout>
        <LeaderBoardTable users={users}/>
        </>
    )
}

export default LeaderBoard
