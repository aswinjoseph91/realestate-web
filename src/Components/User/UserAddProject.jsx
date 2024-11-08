"use client"
import { translate } from "@/utils";
import dynamic from "next/dynamic.js";
import React from "react";

// import VerticleLayout from "@/Components/AdminLayout/VerticleLayout";
import AddProjectsTabs from "@/Components/AddProjectsTabs/AddProjectsTabs";

const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false })

const UserAddProject = () => {
   
    return (
        <VerticleLayout>
            <div className="container">
                <div className="dashboard_titles">
                    <h3>{translate("addProject")}</h3>
                </div>
                <div className="card" id="add_prop_tab">
                    <AddProjectsTabs />
                </div>
            </div>
        </VerticleLayout>
    );
};

export default UserAddProject;
