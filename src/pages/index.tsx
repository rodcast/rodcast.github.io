import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Article from '@/components/Article';
import styles from '@/styles/page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <Sidebar />
        <Article />
      </div>
    </div>
  );
}
