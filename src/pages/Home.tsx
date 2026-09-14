import Hero from '../components/Hero'
import InstallSection from '../components/InstallSection'
import Switching from '../components/Switching'
import ZeroDollars from '../components/ZeroDollars'
import Features from '../components/Features'
import RagTeaser from '../components/RagTeaser'
import GoalLoop from '../components/GoalLoop'
import ServeTeaser from '../components/ServeTeaser'
import Commands from '../components/Commands'
import ThemeGallery from '../components/ThemeGallery'
import TechStrip from '../components/TechStrip'

/** Section order lives here: what it is → how to get it → what it replaces
 *  → what it does → why it's free → the things that set it apart. */
export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <InstallSection />
        <Switching />
        <Features />
        <ZeroDollars />
        <GoalLoop />
        <RagTeaser />
        <Commands />
        <ServeTeaser />
        <ThemeGallery />
        <TechStrip />
      </main>
    </>
  )
}
