import React from "react";
// import Categories from "@/Components/Properties/Categories";
import { GET_CATEGORES } from "@/utils/api";
import Meta from "@/Components/Seo/Meta";
import axios from "axios";
import dynamic from 'next/dynamic'

const Categories = dynamic(
  () => import('@/Components/Properties/Categories'),
  { ssr: false })
// This is seo api
const fetchDataFromSeo = async (slug) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_CATEGORES}?slug_id=${slug}`
        );

        const SEOData = response.data;


        return SEOData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};


const Index = ({ seoData, currentURL }) => {

    return (
        <>
            <Meta
                title={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_title}
                description={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_description}
                keywords={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_keywords}
                ogImage={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_image}
                pathName={currentURL}
            />
            <Categories />
        </>
    );
};
let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { req } = context; // Extract query and request object from context
        const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
        // Accessing the slug property
        const slugValue = params.slug;


        const currentURL = process.env.NEXT_PUBLIC_WEB_URL + '/properties/categories/' + slugValue + '/';


        // const currentURL = `${req.headers.host}${req.url}`;

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

export default Index