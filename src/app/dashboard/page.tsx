'use client'

import Image from 'next/image'
import { Avatar, CircularProgress, IconButton } from '@mui/material'
import { useSupabaseUserMetadata } from '@/hooks/useSupabaseUserMetadata'
import { useRouter } from 'next/navigation'
import { supabase } from '@/clients/supabaseClient'
import styles from '@/app/page.module.css'
import { useState, useEffect } from 'react'

interface UserData {
  range: string;
  majorDimension: string;
  values: string[][];
}

export default function Home() {
  const router = useRouter()
  const { avatarUrl, fullName, loading: metadataLoading } = useSupabaseUserMetadata()
  const [userData, setUserData] = useState<UserData | null>(null)

  const handleClick = async () => {
    router.push('/')
    await supabase.auth.signOut()
  }

  const handleSignIn = () => {
    const authWindow = window.open('/api/auth/google', '_blank', 'width=500,height=600')

    const messageListener = async (event: MessageEvent) => {
      // if (event.origin !== window.location.origin) {
      //   return // Only accept messages from the same origin
      // }

      if (event.data.status === 'authenticated') {
        // Add a delay before fetching data (e.g., 500 milliseconds)
        setTimeout(async () => {
          await fetchData();
        }, 500); // Adjust delay time as needed
  
        window.removeEventListener('message', messageListener); // Remove listener after fetching data
      }
    }

    window.addEventListener('message', messageListener, { once: true })
  }

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sheets')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data: UserData = await response.json()
      console.log('User Data:', data)
      setUserData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    console.log('User Data Updated:', userData)
  }, [userData])

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>HEY MASAO</h1>
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
        <button onClick={handleSignIn}>Sign in to access your drive!</button>
        {userData && (
        <div className={styles.jsonDisplay}>
          <h2>Fetched Data:</h2>
          <pre>{JSON.stringify(userData, null, 0)}</pre>
        </div>
      )}
      </div>

      
    </main>
  )
}
