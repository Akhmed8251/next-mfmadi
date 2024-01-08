import Hero from '@/components/Hero'
import Advertising from '@/components/Advertising'
import Partners from '@/components/Partners'
import MainNews from '@/components/MainNews'
import Map from '@/components/Map'
import About from '@/components/About'
import Contacts from '@/components/Contacts'
import dynamic from 'next/dynamic'
import Loader from '@/components/ui/Loader'

const Header = dynamic(() => import('@/components/Header'), {ssr: false, loading: () => <Loader />})
const Footer = dynamic(() => import('@/components/Footer'), {ssr: false, loading: () => <Loader />})


const Main = () => {
  return (
    <>
      <Header />
      <Hero />
      <Advertising />
      <MainNews />
      <About />
      <Partners />
      <Contacts />
      <Map />
      <Footer />
    </>
  )
}

export default Main