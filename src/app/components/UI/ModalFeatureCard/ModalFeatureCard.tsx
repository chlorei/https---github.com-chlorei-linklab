import React from 'react'
import Image from 'next/image'
    
type ModalFeatureCardProps   = {
    title: string,
    count: number | string,
    image: string
}
const ModalFeatureCard = (props: ModalFeatureCardProps) => {
    return (
        <div className='border w-1/3 transition-transform duration-300 hover:scale-110 text-primary-text p-5 h-45 rounded-3xl xl:w-2/7 sm:w-1/4'>
            <Image src={props.image} alt="Link Icon" width={30} height={30} className='mt-3 ml-3' />

            <div className="ml-3">
                <p className='text-sm text-gray-500 mt-2'>{props.title}</p>
                <h3 className='text-lg mt-4 font-semibold'>{props.count}</h3>
            </div>
            
        </div>
    );
}

export default ModalFeatureCard;
