"use client"
import React from 'react'
import Skeleton from 'react-loading-skeleton'

const SliderSkeleton = () => {
    return (
        <div id='mainheroImage'>
            <Skeleton width="100%" height="100vh" className="skeleton_img" style={{zIndex:"-1"}} />
        </div>
    )
}

export default SliderSkeleton