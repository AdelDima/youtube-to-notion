import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Y2NSection } from '@/components/y2n-section'

export default async function Home() {
  return (
    <main>
      <Header />
      <Y2NSection />
      <Footer />
    </main>
  )
}
