import Link from 'next/link'
import styles from "../page.module.css";


export default function dashboard() {
    return (
        <main className={styles.main}>
        <div className={styles.center}>
          <h3>
            Proof of Concept 2:
          </h3>
          <p>{'\u00A0'} Not yet implemented! Come back soon!</p>
        </div>
        <div className={styles.description}>
            <a href="./">Home</a>
          </div>
        </main>

    );
  }