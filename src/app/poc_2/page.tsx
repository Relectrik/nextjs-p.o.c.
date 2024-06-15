// app/dashboard/page.tsx
'use client'

import { useSupabaseSession } from '@/hooks/useSupabaseSession'
import { useEffect, useState } from 'react'


const Dashboard = () => {
  const { session, loading: sessionLoading } = useSupabaseSession()
  const [data, setData] = useState<string[][] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const res = await fetch('/api/sheets', {
          headers: {
            method: 'GET',
            Authorization: `${session.access_token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setData(data)
          console.log(data)
        }
      }
    }

    fetchData()
  }, [session])
}

export default Dashboard
