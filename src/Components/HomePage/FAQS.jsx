"use client"
import { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { translate } from "@/utils";
import Link from 'next/link';

const FAQS = ({ language, data }) => {
  const [activeKey, setActiveKey] = useState(null);

  const handleToggle = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  return (
    <>
      {data && data?.length > 0 &&
        <section id="faqs">
          <div className="container">
            <div className="main_details">
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <div className="left_side">
                    <span className="title">
                      {translate("gotQueAbout")}
                    </span>
                    <span className="desc">
                      {translate("stillHaveQue")}
                    </span>
                    {data?.length > 5 &&
                      <Link href={'/faqs'}>
                        <button className="learn-more" id="viewall">
                          <span aria-hidden="true" className="circle">
                            <div className="icon_div">
                              <span className="icon arrow">
                                {language.rtl === 1 ? <BsArrowLeft size={24} /> : <BsArrowRight size={24} />}
                              </span>
                            </div>
                          </span>
                          <span className="button-text">{translate("seeAllFaqs")}</span>
                        </button>
                      </Link>
                    }
                  </div>
                </div>
                <div className="col-sm-12 col-md-6">
                  <div className="accordion">
                    <Accordion activeKey={activeKey}>
                      {data.map((item) => (
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
                    {data?.length > 5 &&
                      <div className="visible">
                        <Link href={'/faqs'}>
                          <button className="learn-more" id="viewall">
                            <span aria-hidden="true" className="circle">
                              <div className="icon_div">
                                <span className="icon arrow">
                                  {language.rtl === 1 ? <BsArrowLeft /> : <BsArrowRight />}
                                </span>
                              </div>
                            </span>
                            <span className="button-text">{translate("seeAllFaqs")}</span>
                          </button>
                        </Link>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    </>

  );
};

export default FAQS;
