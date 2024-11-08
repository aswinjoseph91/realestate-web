"use client"
import React, { useEffect, useState } from 'react'
import { AiOutlineUnorderedList } from "react-icons/ai";
import { RiGridFill } from "react-icons/ri";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { GetAllArticlesApi } from "@/store/actions/campaign";
import ArticleCard from "@/Components/Cards/ArticleCard";
import Skeleton from "react-loading-skeleton";
import ArticleCardSkeleton from "@/Components/Skeleton/ArticleCardSkeleton";
import ArticleHorizonatalCard from "@/Components/Cards/ArticleHorizonatalCard";
import { translate } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { languageData } from "@/store/reducer/languageSlice";
import { settingsData } from "@/store/reducer/settingsSlice";
import NoData from "@/Components/NoDataFound/NoData";
import { articlecachedataCategoryId, categoriesCacheData } from "@/store/reducer/momentSlice";
import Layout from '../Layout/Layout';

const Articles = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [expandedStates, setExpandedStates] = useState([]);
    const [grid, setGrid] = useState(false);

    const [getArticles, setGetArticles] = useState([]);
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true); // Track if more data is available
    const limit = 3;
    const lang = useSelector(languageData);
    const Categorydata = useSelector(categoriesCacheData);
    const ArticleCateId = useSelector(articlecachedataCategoryId);

    const toggleGrid = () => {
        setGrid(!grid);
    }

    useEffect(() => {
        loadArticles(true);
    }, [ArticleCateId, lang, grid]);

    const loadArticles = (reset = false, cateID = ArticleCateId) => {
        setIsLoading(true);
        const offset = reset ? 0 : offsetdata;
        GetAllArticlesApi({
            category_id: cateID ? cateID : "",
            limit,
            offset,
            onSuccess: (response) => {
                const Articles = response.data;
                    setTotal(response.total);
                setIsLoading(false);
                if (reset) {
                    setGetArticles(Articles);
                } else {
                    setGetArticles(prevArticles => [...prevArticles, ...Articles]);
                }
                setExpandedStates(new Array(offset + Articles.length).fill(false));
                setOffsetdata(offset + limit);
                setHasMoreData(Articles.length === limit);
            },
            onError: (error) => {
                console.log(error);
                setIsLoading(false)
            }
        });
    };

    const SettingsData = useSelector(settingsData);
    const PlaceHolderImg = SettingsData?.web_placeholder_logo;

    const getArticleByCategory = (cateId) => {
        setOffsetdata(0);
        loadArticles(true, cateId);
    };

    const getGeneralArticles = () => {
        setOffsetdata(0);
        loadArticles(true);
    };

    return (
        <Layout>
            <Breadcrumb title={translate("articles")} />
            <div className="all-articles">
                <div id="all-articles-content">
                    <div className="container">
                        <div className="row" id="main-content">
                            <div className="col-12 col-md-6 col-lg-9">
                                <div className="all-article-rightside">
                                    {total ? (
                                        <>
                                            <div className="card">
                                                <div className="card-body" id="all-article-headline-card">
                                                    <div>
                                                        <span>
                                                            {total > 0 ? total : 0} {translate("articleFound")}
                                                        </span>
                                                    </div>
                                                    <div className="grid-buttons">
                                                        <button id="layout-buttons" onClick={toggleGrid}>
                                                        {grid ? <AiOutlineUnorderedList size={25} /> : <RiGridFill size={25} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                      null
                                    )}
                                    {getArticles && getArticles.length > 0 ? (
                                        !grid ? (
                                            // Row cards
                                            <div className="all-prop-cards" id="rowCards">
                                                <div className="row" id="all-articles-cards">
                                                    {isLoading
                                                        ? // Show skeleton loading when data is being fetched
                                                        Array.from({ length: getArticles ? getArticles.length : 6 }).map((_, index) => (
                                                            <div className="col-sm-12 col-md-6 col-lg-4 loading_data" key={index}>
                                                                <ArticleCardSkeleton />
                                                            </div>
                                                        ))
                                                        : getArticles?.map((ele, index) => (
                                                            <div className="col-12 col-md-6 col-lg-4" key={index}>
                                                                <ArticleCard ele={ele} expandedStates={expandedStates} language={lang}/>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div id="columnCards">
                                                <div className="row">
                                                    {isLoading
                                                        ? // Show skeleton loading when data is being fetched
                                                        Array.from({ length: getArticles ? getArticles.length : 6 }).map((_, index) => (
                                                            <div className="col-sm-12 col-md-6 col-lg-4 loading_data" key={index}>
                                                                <ArticleCardSkeleton />
                                                            </div>
                                                        ))
                                                        : getArticles?.map((ele, index) => (
                                                            <div className="col-12 " id="horizonatal_articles" key={index}>
                                                                <ArticleHorizonatalCard ele={ele} expandedStates={expandedStates} index={index} PlaceHolderImg={PlaceHolderImg} />
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="noDataFoundDiv">
                                            <NoData />
                                        </div>
                                    )}
                                    {hasMoreData && (
                                        <div className="col-12 loadMoreDiv" id="loadMoreDiv">
                                            <button className='loadMore' onClick={() => loadArticles(false)}>{translate("loadmore")}</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="all-articles-leftside">
                                    <div className="cate-card">
                                        <div className="card">
                                            <div className="card-header">{translate("categories")}</div>
                                            <div className="card-body">
                                                <div className="cate-list">
                                                    <span>{translate("General")}</span>
                                                    {lang?.rtl === 1 ? (

                                                            <IoMdArrowDropleft size={25} className="cate_list_arrow" onClick={getGeneralArticles} />
                                                        ):(

                                                            <IoMdArrowDropright size={25} className="cate_list_arrow" onClick={getGeneralArticles} />
                                                        )
                                                    }
                                                </div>
                                                {Categorydata &&
                                                    Categorydata.map((elem, index) => (
                                                        <div className="cate-list" key={index}>
                                                            <span>{elem.category}</span>
                                                            {lang?.rtl === 1 ? (
                                                                <IoMdArrowDropleft
                                                                    size={25}
                                                                    className="cate_list_arrow"
                                                                    onClick={() => {
                                                                        getArticleByCategory(elem.id);
                                                                    }}
                                                                />
                                                            ):(
                                                                <IoMdArrowDropright
                                                                    size={25}
                                                                    className="cate_list_arrow"
                                                                    onClick={() => {
                                                                        getArticleByCategory(elem.id);
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Articles
