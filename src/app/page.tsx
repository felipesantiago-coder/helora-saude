'use client'

import { useAppStore } from '@/stores/helora-store'
import { Header } from '@/components/helora/Header'
import { HeroSection } from '@/components/helora/HeroSection'
import { OrganicDivider } from '@/components/helora/OrganicDivider'
import { ConceptSection } from '@/components/helora/ConceptSection'
import { ServicesSection } from '@/components/helora/ServicesSection'
import { TeamSection } from '@/components/helora/TeamSection'
import { TestimonialsSection } from '@/components/helora/TestimonialsSection'
import { CTASection } from '@/components/helora/CTASection'
import { Footer } from '@/components/helora/Footer'
import BookingWizard from '@/components/helora/BookingWizard'
import AdminLogin from '@/components/helora/AdminLogin'
import AdminPanel from '@/components/helora/AdminPanel'

function PublicPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <OrganicDivider variant="sage" />
        <ConceptSection />
        <ServicesSection />
        <OrganicDivider variant="sage" />
        <TeamSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default function Home() {
  const view = useAppStore((s) => s.view)

  if (view === 'booking') {
    return (
      <div className="min-h-screen flex flex-col">
        <BookingWizard />
      </div>
    );
  }

  if (view === 'admin-login') {
    return <AdminLogin />
  }

  if (view === 'admin') {
    return <AdminPanel />
  }

  return <PublicPage />
}