import Link from 'next/link'
import styles from "../page.module.css";


export default function dashboard() {
    return (
        <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>src/app/page.tsx</code>
          </p>
          <div>
            <a href="./">home</a>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
            </a>
          </div>
        </div>
        </main>

    );
  }