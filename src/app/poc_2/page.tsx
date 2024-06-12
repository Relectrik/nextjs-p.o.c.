// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'

const Dashboard = () => {
  const [data, setData] = useState<string[][] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/sheets', {
        headers: {
          Authorization: `Bearer ${new URLSearchParams(window.location.search).get('access_token')}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setData(data)
      }
    }

    fetchData()
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Google Sheets Data</h1>
      <table>
        <thead>
          <tr>
            {data[0].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
