// pages/index.tsx
"use client"

import { useState, useEffect } from "react";
import styles from "../page.module.css";

const Home = () => {
  const [data, setData] = useState<string[][] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/poc_2/api'); // Assuming your API route is named poc_2
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError('Failed to fetch data from Google Sheets');
      }
    };

    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.default}>
        <h2>Proof of Concept 2</h2>
        <p>Displaying some data from my gym spreadsheet stored in Google Sheets.</p>
      </div>
      <div className={styles.default}>
        {data ? (
          <pre className={styles.card}>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>Loading...</p>
        )}
        {error && <p className={styles.card}>{error}</p>}
      </div>
      <div>
        <a className={styles.card} href="./">
          Home
        </a>
      </div>
    </main>
  );
};

export default Home;
