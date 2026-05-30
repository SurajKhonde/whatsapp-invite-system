import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div
        className={styles.blob}
        style={{
          width: 500,
          height: 500,
          left: "-15%",
          top: "-15%",
          background: "#e91e8c",
          opacity: 0.06,
        }}
      />
      <div
        className={styles.blob}
        style={{
          width: 300,
          height: 300,
          right: "-8%",
          bottom: "5%",
          background: "#9c27b0",
          opacity: 0.05,
          animationDelay: "7s",
        }}
      />
      <div className={styles.grid} />

      <div className={styles.card}>
        <div className={styles.big}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>
          The page you're looking for doesn't exist or was moved. Let's get you back on track.
        </p>
        <div className={styles.actions}>
          <a href="/dashboard" className={styles.btnPrimary}>
            🏠 Go to Dashboard
          </a>
          <a href="/events" className={styles.btnGhost}>
            📅 My Events
          </a>
        </div>
        <a href="/" className={styles.logo}>
          <span className={styles.logoP}>పి</span>
          <span className={styles.logoRest}>looopu</span>
        </a>
      </div>
    </div>
  );
}