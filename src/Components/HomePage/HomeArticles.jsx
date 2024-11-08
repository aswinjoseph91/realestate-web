"use client"
import React from 'react'
import MobileHeadline from '../MobileHeadlines/MobileHeadline'
import ArticleCard from '../Cards/ArticleCard'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { translate } from '@/utils'
import ArticleCardSkeleton from '../Skeleton/ArticleCardSkeleton'
import Link from 'next/link'

const HomeArticles = ({isLoading, getArticles, language}) => {
    return (
        <div>
            {isLoading ? (
                // Show loading state while data is being fetched
                <div className="container">
                    <div className="article_headline mt-4">
                        <div>
                            <h3 className="headline">
                                {translate("our")}{" "}
                                <span>
                                    <span className="">{translate("articles")}</span>
                                </span>
                            </h3>
                        </div>
                        <div className="rightside_article_headlin">
                            {getArticles.length > 4 ? (
                                <Link href="/articles">
                                    <button className="learn-more" id="viewall">
                                        <span aria-hidden="true" className="circle">
                                            <div className="icon_div">
                                                <span className="icon arrow">
                                                    {language.rtl === 1 ? <BsArrowLeft /> : <BsArrowRight />}
                                                </span>
                                            </div>
                                        </span>
                                        <span className="button-text">{translate("seeAllArticles")}</span>
                                    </button>
                                </Link>
                            ) : null}
                        </div>
                    </div>
                    <div className="mobile-headline-view">
                        <MobileHeadline
                            data={{
                                text: translate("ourArticles"),
                                link: getArticles.length > 4 ? "/articles" : "",
                            }}
                        />
                    </div>
                    <div className="row mt-5 mb-5" >
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="col-sm-12 col-md-6 col-lg-3 loading_data">
                                <ArticleCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Render articles when data is loaded
                getArticles && getArticles?.length > 0 ? (
                    <section id="articles">
                        <div className="container">
                            <div className="article_headline">
                                <div>
                                    <h3 className="headline">
                                        {translate("our")}{" "}
                                        <span>
                                            <span className="">{translate("articles")}</span>
                                        </span>
                                    </h3>
                                </div>
                                <div className="rightside_article_headlin">
                                    {getArticles && getArticles?.length > 4 ? (
                                        <Link href="/articles">
                                            <button className="learn-more" id="viewall">
                                                <span aria-hidden="true" className="circle">
                                                    <div className="icon_div">
                                                        <span className="icon arrow">
                                                            {language.rtl === 1 ? <BsArrowLeft /> : <BsArrowRight />}
                                                        </span>
                                                    </div>
                                                </span>
                                                <span className="button-text">{translate("seeAllArticles")}</span>
                                            </button>
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mobile-headline-view">
                                <MobileHeadline
                                    data={{
                                        text: translate("ourArticles"),
                                        link: getArticles.length > 4 ? "/articles" : "",
                                    }}
                                />
                            </div>
                            <div className="row" id="article_cards">
                                {getArticles?.slice(0, 4).map((ele, index) => (
                                    <div key={index} className="col-12 col-md-6 col-lg-3">
                                        <ArticleCard ele={ele} language={language}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : null
            )}
        </div>
    )
}

export default HomeArticles
