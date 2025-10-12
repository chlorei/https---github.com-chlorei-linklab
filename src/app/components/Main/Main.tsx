import React from 'react'
import TextType from '../UI/TextType/TextType';
import InteractivePart from '../InteractivePart/InteractivePart';

const Main = () => {
  // const [activeLink, setActiveLink] = useState
  return (
    <div className="container mx-auto px-4">
      <div className="flex w-full flex-col items-center uppercase">
        <TextType 
          text={["Improve your links in only one click completely for free with LinkLab"]}
          typingSpeed={25}
          pauseDuration={1500}
          showCursor
          cursorCharacter="|"
          className="text-4xl font-bold text-black text-center"
        />

        <div className="mt-20 w-full max-w-2xl self-center rounded-2xl border-2 p-10">
          <h1 className="mb-3 font-bold">Shorten your link</h1>
          <InteractivePart/>
        </div>
      </div>
    </div>
  )
}

export default Main
