"use client"
import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import { translate } from '@/utils'
import { Accordion } from 'react-bootstrap';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import { getFAQSApi } from '@/store/actions/campaign'
import NoData from '../NoDataFound/NoData'


const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="accordion-item">
      <div
        className={`accordion-header ${isOpen ? 'open' : ''}`}
        onClick={onClick}
      >
        <h3>{question}</h3>
        {isOpen ? <FiMinusCircle size={24} /> : <FiPlusCircle size={24} />
        }
      </div>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  )
}


const AllFAQs = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [faqs, setFaqs] = useState([])
  const [activeKey, setActiveKey] = useState(null);

  const handleToggle = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };
  const [total, setTotal] = useState()
  const [offsetdata, setOffsetdata] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true); // Track if there's more data to load

  const limit = 5;
  const fetchFAQs = () => {
    try {
      getFAQSApi({
        limit: limit.toString(),
        offset: offsetdata?.toString(),
        onSuccess: (res) => {
          setTotal(res.total);
          const faqs = res.data
          setFaqs(prevListings => [...prevListings, ...faqs])
          setHasMoreData(faqs.length === limit);

        },
        onError: (err) => {
          setIsLoading(false)
          console.log(err)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleLoadMore = () => {
    const newOffset = offsetdata + limit;
    setOffsetdata(newOffset);
  };
  useEffect(() => {
    fetchFAQs()
  }, [offsetdata])

  return (
    <Layout>
      <Breadcrumb title={translate("faqs")} />


      <section id="all_faqs">
        <div className="container">
          {faqs?.length > 0 ? (

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <div className="main_details">

                  <span className="title">
                    {translate("gotQueAbout")}
                  </span>
                  <span className="desc">
                    {translate("stillHaveQue")}
                  </span>
                </div>
                <div>

                  <div className="accordion">

                    <Accordion activeKey={activeKey}>
                      {faqs.map((item) => (
                        <Accordion.Item
                          eventKey={item.id}
                          key={item.id}
                          className={activeKey === item.id ? "active-accordion" : ""}
                        >
                          <Accordion.Header
                            onClick={() => handleToggle(item.id)}
                            className={`d-flex justify-content-between align-items-center ${activeKey === item.id ? "open" : ""}`}
                          >
                            <span>
                              {item.question}
                            </span>
                            <div>
                              {activeKey === item.id ? <FiMinusCircle size={24} /> : <FiPlusCircle size={24} />}
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            {item.answer}
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                </div>
                {faqs && faqs.length > 0 && hasMoreData ? (
                  <div className="col-12 loadMoreDiv" id="loadMoreDiv">
                    <button className='loadMore' onClick={handleLoadMore}>{translate("loadmore")}</button>
                  </div>
                ) : null}
              </div>
            </div>
          )
            : (
              <>
                <NoData />
              </>
            )
          }
        </div>
      </section>
    </Layout>
  )
}

export default AllFAQs