import { useEffect, useState } from 'react'

const SheetData = () => {
  const [data, setData] = useState<string[][] | null>(null)

  useEffect(() => {
    fetch('/api/sheetData')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }
  console.log(data)

  return (
    <div>
      <h1>Google Sheets Data</h1>
    </div>
  )
}

export default SheetData
