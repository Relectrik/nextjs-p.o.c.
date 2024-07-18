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
  const [currentEntryId, setCurrentEntryId] = useState<string>('default' ?? '')
  const [userData, setUserData] = useState<UserData[] | null>(null)
  const [sheetData, setSheetData] = useState<any | null>(null)
  const [isSpreadsheetIdUpdated, setIsSpreadsheetIdUpdated] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const handleClick = async () => {
    router.push('/')
    await supabase.auth.signOut()
  }

  const updateSpreadsheetId = () => {
    // Logic to update spreadsheetId
    setIsSpreadsheetIdUpdated(true)
  }

  const updateSignInStatus = () => {
    // Logic to update sign in status
    setIsSignedIn(true)
  }

  const handleSignIn = async () => {
    // const response = await fetch('/api/checkAuth')
    // if (response.status === 200) {
    //   await fetchData()
    // } else {
    //   window.open('/api/auth/google', '_blank', 'width=500,height=600')
    // }
    window.open('/api/auth/google', '_blank', 'width=500,height=600')
    const checkAuth = setInterval(async () => {
      const cookies = await fetch('/api/checkAuth')
      if (cookies.status == 200) {
        console.log('Auth cookie found, fetching data...')
        clearInterval(checkAuth)
        await fetchData()
      }
    }, 1000) // Poll every 500 milliseconds
    updateSignInStatus()
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
      setCurrentEntryId(sheetId)
      const sheetsResponse = await fetch(`/api/sheets?sheetId=${sheetId}`)
      if (!sheetsResponse.ok) {
        throw new Error('Failed to fetch sheets data')
      }
      const data = await sheetsResponse.json()
      console.log('Sheet Data:', data)
      updateSpreadsheetId()
      setSheetData(data)
    } catch (error) {
      console.error('Error fetching sheets data:', error)
    }
  }

  async function addNewSheet(sheetId: string) {
    try {
      const response = fetch(`/api/addSheet?sheetId=${sheetId}`, { method: 'POST' })
      if (response) {
        // Handle success response
        console.log(response)
      } else {
        // Handle non-success responses
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function createSpreadsheet() {
    try {
      const response = fetch(`/api/createSpreadsheet`, { method: 'POST' })
      if (response) {
        // Handle success response
        console.log(response)
      } else {
        // Handle non-success responses
        console.log(response)
      }
    } catch (error) {
      console.log(error)
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
        {isSpreadsheetIdUpdated && (
          <a onClick={() => addNewSheet(currentEntryId)} className={styles.addButton}>
            Add New Sheet with Hello World!
          </a>
        )}
        {isSignedIn && (
          <a onClick={createSpreadsheet} className={styles.addButton}>
            Create New Spreadsheet{' '}
          </a>
        )}
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
      <div></div>
    </main>
  )
}
