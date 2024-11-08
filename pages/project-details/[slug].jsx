import React from 'react'
// import ProjectDetails from '@/Components/ProjectDetails/ProjectDetails'
import axios from "axios";
import { GET_PROJECTS } from "@/utils/api";
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const ProjectDetails = dynamic(
  () => import('@/Components/ProjectDetails/ProjectDetails'),
  { ssr: false })
// This is seo api
const fetchDataFromSeo = async (slug) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_PROJECTS}?slug_id=${slug}`
        );

        const SEOData = response.data;

        return SEOData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};


const index = ({ seoData, currentURL }) => {
    return (
        <>
            <Meta
                title={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_title}
                description={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_description}
                keywords={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_keywords}
                ogImage={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_image}
                pathName={currentURL}
            />
            <ProjectDetails />
        </>
    )
}
let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { req } = context; // Extract query and request object from context
        const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
        // Accessing the slug property
        //  const currentURL = req[Symbol.for('NextInternalRequestMeta')].__NEXT_INIT_URL;

        // const currentURL = `${req.headers.host}${req.url}`;
        const slugValue = params.slug;

        const currentURL = process.env.NEXT_PUBLIC_WEB_URL + '/project-details/' + slugValue + '/';

        const seoData = await fetchDataFromSeo(slugValue);
        return {
            props: {
                seoData,
                currentURL,
            },
        };
    };
}
export const getServerSideProps = serverSidePropsFunction;
export default index
