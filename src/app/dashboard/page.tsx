'use client'

import Image from 'next/image'
import { Avatar, CircularProgress, IconButton } from '@mui/material'
import { useSupabaseUserMetadata } from '@/hooks/useSupabaseUserMetadata'
import { useRouter } from 'next/navigation'
import { supabase } from '@/clients/supabaseClient'
import styles from '@/app/page.module.css'
import { useState, useEffect } from 'react'

interface UserData {
  id: string
  name: string
}

export default function Home() {
  const router = useRouter()
  const { avatarUrl, fullName, loading: metadataLoading } = useSupabaseUserMetadata()
  const [userData, setUserData] = useState<UserData[] | null>(null)
  const [sheetData, setSheetData] = useState<any | null>(null)

  const handleClick = async () => {
    router.push('/')
    await supabase.auth.signOut()
  }

  const handleSignIn = async () => {
    const response = await fetch('/api/checkAuth')
    if (response.status === 200) {
      await fetchData()
    } else {
      window.open('/api/auth/google', '_blank', 'width=500,height=600')
    }

    const checkAuth = setInterval(async () => {
      const cookies = await fetch('/api/checkAuth')
      if (cookies.ok) {
        console.log('Auth cookie found, fetching data...')
        clearInterval(checkAuth)
        await fetchData()
      }
    }, 1000) // Poll every 500 milliseconds
  }

  const fetchData = async () => {
    try {
      const driveResponse = await fetch('/api/drive')
      if (!driveResponse.ok) {
        throw new Error('Failed to fetch drive data')
      }
      const data: UserData[] = await driveResponse.json()
      console.log('User Data:', data)
      setUserData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchSheetData = async (sheetId: string) => {
    try {
      const sheetsResponse = await fetch(`/api/sheets?sheetId=${sheetId}`)
      if (!sheetsResponse.ok) {
        throw new Error('Failed to fetch sheets data')
      }
      const data = await sheetsResponse.json()
      console.log('Sheet Data:', data)
      setSheetData(data)
    } catch (error) {
      console.error('Error fetching sheets data:', error)
    }
  }

  useEffect(() => {
    console.log('User Data Updated:', userData)
  }, [userData])

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Google Sheets Proof of Concept</h1>
        <div>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleClick}>
            Logout: {metadataLoading ? <CircularProgress /> : <Avatar alt={fullName} src={avatarUrl} />}
          </IconButton>
        </div>
      </div>

      <div className={styles.center}>
        <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
      </div>

      <div className={styles.grid}>
        <a className={styles.card} onClick={handleSignIn}>
          Sign in to access your drive!
        </a>
      </div>
      <div className={styles.main}>
        {userData && (
          <div className={styles.jsonDisplay}>
            <h2>Fetched Data:</h2>
            {userData.map(entry => (
              <>
                <br />
                <button className={styles.card} key={entry.id} onClick={() => fetchSheetData(entry.id)}>
                  {entry.name}
                </button>
              </>
            ))}
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {sheetData && (
          <div className={styles.jsonDisplay}>
            <h2>Sheet Data:</h2>
            <pre>{JSON.stringify(sheetData, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  )
}
