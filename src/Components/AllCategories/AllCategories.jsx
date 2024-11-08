"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import CategoryCard from "@/Components/Cards/CategoryCard";
import NoData from "@/Components/NoDataFound/NoData";
import CustomCategorySkeleton from "@/Components/Skeleton/CustomCategorySkeleton";
import { languageData } from "@/store/reducer/languageSlice";
import { translate } from "@/utils";
import Link from "next/link";
import { useSelector } from "react-redux";
import Layout from '../Layout/Layout';
import { GetAllCategorieApi } from '@/store/actions/campaign';

const AllCategories = () => {

    const lang = useSelector(languageData);
    useEffect(() => { }, [lang]);
    
    const [isLoading, setIsLoading] = useState(false);
    const limit = 6
    const [CategoryData, setCategoryData] = useState([])
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true); // Track if there's more data to load


    const fetchAllCategory = () => {
        setIsLoading(true)
        try {
            GetAllCategorieApi({
                offset: offsetdata.toString(),
                limit: limit.toString(),
                has_property: true,
                onSuccess: (response) => {
                    
                    setTotal(response.total);
                    setIsLoading(false)
                    const cateData = response.data;
                    setCategoryData(prevListings => [...prevListings, ...cateData]);
                    setHasMoreData(cateData.length === limit);
                },
                onError: (error) => {
                    setIsLoading(false)
                    console.log(error)

                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchAllCategory()
    }, [offsetdata])
    const handleLoadMore = () => {
        const newOffset = offsetdata + limit;
        setOffsetdata(newOffset);
    };
    return (
        <Layout>
            <Breadcrumb title={translate("allCategories")} />
            <section id="view_all_cate_section">
                <div className="cate_section">
                    {CategoryData?.length > 0 && CategoryData.some(ele => ele.properties_count !== 0 && ele.properties_count !== "") ? (
                        <div className="container">
                            <div className="row">
                                {isLoading
                                    ? // Show skeleton loading when data is being fetched
                                    Array.from({ length: CategoryData ? CategoryData.length : 6 }).map((_, index) => (
                                        <div className="col-sm-12 col-md-6 col-lg-2 loading_data" key={index}>
                                            <CustomCategorySkeleton />
                                        </div>
                                    ))
                                    : CategoryData &&
                                    CategoryData?.map((ele, index) =>
                                        ele.properties_count !== 0 && ele.properties_count !== "" ? (
                                            <div className="col-sm-12 col-md-6 col-lg-2" key={index}>
                                                <Link href={`/properties/categories/${ele.slug_id}`}>
                                                    <CategoryCard ele={ele} />
                                                </Link>
                                            </div>
                                        ) : null
                                    )}
                            </div>
                            {CategoryData && CategoryData.length > 0 && hasMoreData ? (
                                <div className="col-12 loadMoreDiv" id="loadMoreDiv">
                                    <button className='loadMore' onClick={handleLoadMore}>{translate("loadmore")}</button>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="noDataFoundDiv">
                            <NoData />
                        </div>
                    )}


                </div>
            </section>
        </Layout>
    )
}

export default AllCategories
