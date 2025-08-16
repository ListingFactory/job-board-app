import FirebaseHeader from '@/components/FirebaseHeader';
import SearchSection from '@/components/SearchSection';
import FirebaseStatsSection from '@/components/FirebaseStatsSection';
import FirebaseFeaturedJobs from '@/components/FirebaseFeaturedJobs';
import FeaturedCompanies from '@/components/FeaturedCompanies';
import Footer from '@/components/Footer';
import { FirebaseAuthProvider } from '@/components/FirebaseAuthContext';

export default function FirebasePage() {
  return (
    <FirebaseAuthProvider>
      <main className="min-h-screen">
        <FirebaseHeader />
        <SearchSection />
        <FirebaseStatsSection />
        <FirebaseFeaturedJobs />
        <FeaturedCompanies />
        <Footer />
      </main>
    </FirebaseAuthProvider>
  );
}