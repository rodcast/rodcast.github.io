import dynamic from 'next/dynamic';
import Toggle from '@/components/Toggle';
import Article from '@/components/Article';
import styles from '@/styles/page.module.css';

const Header = dynamic(() => import('@/components/Header'), {
  ssr: false,
});

const Sidebar = dynamic(() => import('@/components/Sidebar'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <Toggle />
      <div className={styles.main}>
        <Sidebar />
        <Article />
      </div>
    </div>
  );
}
