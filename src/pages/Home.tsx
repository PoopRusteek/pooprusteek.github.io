import Hero from '../components/Hero'
import InstallSection from '../components/InstallSection'
import ZeroDollars from '../components/ZeroDollars'
import Features from '../components/Features'
import RagTeaser from '../components/RagTeaser'
import GoalLoop from '../components/GoalLoop'
import ServeTeaser from '../components/ServeTeaser'
import Commands from '../components/Commands'
import ThemeGallery from '../components/ThemeGallery'
import TechStrip from '../components/TechStrip'

/** Section order lives here: what it is → how to get it → why it's free →
 *  what it does → the three things nothing else in the terminal does. */
export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <InstallSection />
        <ZeroDollars />
        <Features />
        <RagTeaser />
        <GoalLoop />
        <ServeTeaser />
        <Commands />
        <ThemeGallery />
        <TechStrip />
      </main>
    </>
  )
}
