'use client'

import SheetData from '../../../components/SheetData'
import { useState } from 'react'
import styles from '../page.module.css'

const space = '\u00A0'
export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.default}>
        <h2>Proof of Concept 2</h2>
        <p>...</p>
      </div>
      <div className={styles.default}>
        <SheetData />
      </div>

      <div>
        <a className={styles.card} href="./">
          Home
        </a>
      </div>
    </main>
  )
}
