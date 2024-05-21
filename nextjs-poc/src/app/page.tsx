import Image from "next/image";
import Link from 'next/link'

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>
          HEY MASAO
        </h1>
        <div>
          <a
            href="https://github.com/relectrik"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/relectrik.png"
              alt="Vercel Logo"
              width={65}
              height={65}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="poc_1"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2>
            P.O.C. #1 <span>-&gt;</span>
          </h2>
          <p>API/Server Side Code in NextJS with App Router</p>
        </a>

        <a
          href="poc_2"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2>
            P.O.C. #2 <span>-&gt;</span>
          </h2>
          <p>Demo of listing my gym stuff from Google Sheets</p>
        </a>

        <a
          href="poc_3"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2>
            P.O.C. #3 <span>-&gt;</span>
          </h2>
          <p>Extract the data from the sheets, and (maybe do some processing?) display it.</p>
        </a>

        <a
          href="poc_4"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2>
            P.O.C. #4 <span>-&gt;</span>
          </h2>
          <p>
            Connects to Google Translate, and does an example translation.
          </p>
        </a>
      </div>
    </main>
  );
}
