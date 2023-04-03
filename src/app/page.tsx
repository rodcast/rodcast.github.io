import styles from '@/styles/page.module.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Article from '@/components/Article';

export default function Home() {
  // const handleDarkTheme = () => {
  //   const getTheme: string = localStorage.getItem('theme') || 'light';
  //   const theme: string = getTheme === 'dark' ? 'light' : 'dark';
  //   document.documentElement.classList.add(theme);
  //   localStorage.setItem('theme', theme);
  // };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <Sidebar />
        <Article />
      </main>
    </div>
  );
}
