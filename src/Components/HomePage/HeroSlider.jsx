"use client"
import React from 'react'
import SliderComponent from '../HomeSlider/SliderComponent'
import SearchTab from '../SearchTab/SearchTab'
import SliderSkeleton from '../Skeleton/SliderSkeleton'

const HeroSlider = ({isLoading, sliderData, Categorydata}) => {
    return (
        <>
            {isLoading ? (
                <SliderSkeleton />
            ) : (
                sliderData && sliderData?.length > 0 ? (
                    <section id="mainheroImage">
                        <div>
                            <SliderComponent sliderData={sliderData} />
                        </div>
                        {/* Sell Rent  */}

                        <SearchTab getCategories={Categorydata} />
                    </section>
                ) : (
                    null
                )
            )}
        </>
    )
}

export default HeroSlider