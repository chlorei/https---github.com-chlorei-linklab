"use client"

import TiltedCard from '../components/UI/TiltedCard/TiltedCard'
import DecryptedText from '../components/UI/DecryptedText/DecryptedText'
import { useThemeCtx } from '@/app/providers/ThemeProvider';


const About = () => {
  const { theme } = useThemeCtx(); 
  const logoSrc = theme === "dark" ? "/fulllogo-white.png" : "/fulllogo-black.png";
  return (
    <div className="text-primary-text container mx-auto px-4">
      <div className="flex w-full flex-col items-center mt-30">
        <TiltedCard
          imageSrc={logoSrc}
          altText="Relinxr"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={30}
          scaleOnHover={1.3}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={true}
        />
        <div className=' mt-1 font-bold text-4xl self-center'>
          <DecryptedText
            text="What is Relinxr?"
            animateOn="view"
            revealDirection="center"
          />
        </div>
        <div className='w-3/5 text-center mt-5 text-2xl self-center'>
          <DecryptedText
            text="Relinxr is an open-source platform for working with links: shortening, analytics, QR codes, and custom domains in one place. It delivers the familiar set of capabilities you expect from a modern, industry-standard link shortener—focused on simplicity, speed, and an open codebase."
            animateOn="view"
            revealDirection="center"
          />
        </div>
      </div>
    </div>
  )
}

export default About
