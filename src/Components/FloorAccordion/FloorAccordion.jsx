"use client"
import { placeholderImage } from '@/utils';
import Image from 'next/image';
import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CustomToggle = ({ children, eventKey, isOpen, onToggle }) => {
    return (
        <div
            className={`custom-toggle ${isOpen ? 'open' : ''}`}
            onClick={() => onToggle(eventKey)}
        >
            {/* Customize the icons and styles here */}
            {isOpen ? (
                <div className="toggle-icon-minus"> <FaMinus /></div>

            ) : (
                <div className="toggle-icon-plus"><FaPlus /></div>
            )
            }
        </div>
    );
};

const FloorAccordion = ({ plans }) => {
    const [activeKey, setActiveKey] = useState("");

    const handleToggle = (eventKey) => {
        setActiveKey(activeKey === eventKey ? null : eventKey);
    };

    return (
        <>


            <Accordion activeKey={activeKey} onSelect={handleToggle}>
                {plans && plans.map((ele, index) => (
                    <Accordion.Item eventKey={ele?.id} key={index}>
                        <Accordion.Header>
                            <span>{ele?.title}</span>
                            <CustomToggle eventKey={ele?.id} isOpen={activeKey === ele?.id} onToggle={handleToggle} />
                        </Accordion.Header>
                        <Accordion.Body>
                           <div className="floor_img">
                            <Image src={ele?.document} alt='floor' width={250} height={250} onError={placeholderImage}/>
                           </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    );
};

export default FloorAccordion;
