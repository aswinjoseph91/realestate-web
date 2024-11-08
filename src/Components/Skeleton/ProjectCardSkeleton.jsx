"use client"
import React from 'react'
import Skeleton from 'react-loading-skeleton';

const ProjectCardSkeleton = () => {
    return (
        <div className='project_card'>
            <div className="card project_main_card">
                <div className="card-body">
                    <div className="cate_image">
                        {/* Skeleton for category image */}
                        <Skeleton className="custom-svg" width={20} height={20} />
                        <span className="project_body_title"><Skeleton width={100} /></span>
                    </div>
                    <div className="project_card_middletext">
                        {/* Skeleton for title */}
                        <Skeleton width={200} />
                        {/* Skeleton for location */}
                        <Skeleton width={100} />
                    </div>
                </div>
                <div className="cardImg_swiper">
                    {/* Skeleton for swiper */}
                    <Skeleton height={200} />
                   
                </div>
            </div>
        </div>
    );
}

export default ProjectCardSkeleton;
