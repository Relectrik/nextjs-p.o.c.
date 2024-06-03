'use client'

import { useState } from 'react'
import styles from '@/app/page.module.css'

const space = '\u00A0'
export default function Home() {
  const [loading, setLoading] = useState(false)
  const fetchDataFromAPI = async () => {
    try {
      setLoading(true)
      const response = await fetch('api/backendTest', {
        headers: {
          accept: 'application/json',
          method: 'GET',
        },
      })
      if (response) {
        const data = await response.json()
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className={styles.main}>
      <div className={styles.default}>
        <h2>Proof of Concept 1</h2>
        <p>
          Let&apos;s see if we can demonstrate how to do API/server-side code in NextJS with App Router We&apos;re going
          to store some example data (I just decided to use a random set of weights from Forney&apos;s final for cog
          sys) then reference and call from the front end.
        </p>
      </div>
      <div className={styles.default}>
        <button className={styles.card} onClick={() => fetchDataFromAPI()}>
          {' '}
          {loading ? 'Loading...' : 'Check the console after you click this button.'}
        </button>
      </div>

      <div>
        <a className={styles.card} href="./">
          Home
        </a>
      </div>
    </main>
  )
}
