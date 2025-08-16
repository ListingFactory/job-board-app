import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import StatsSection from '@/components/StatsSection';
import FeaturedJobs from '@/components/FeaturedJobs';
import FeaturedCompanies from '@/components/FeaturedCompanies';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <SearchSection />
      <StatsSection />
      <FeaturedJobs />
      <FeaturedCompanies />
      <Footer />
    </main>
  );
}