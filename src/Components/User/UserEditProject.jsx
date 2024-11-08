"use client"
import { translate } from "@/utils";
import dynamic from "next/dynamic.js";
import React from "react";

// import VerticleLayout from "@/Components/AdminLayout/VerticleLayout";
import EditProjectTabs from "@/Components/EditProjectTabs/EditProjectTabs";

const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false })

const UserEditProject = () => {
   
    return (
        <VerticleLayout>
            <div className="container">
                <div className="dashboard_titles">
                    <h3>{translate("editProject")}</h3>
                </div>
                <div className="card" id="add_prop_tab">
                    <EditProjectTabs />
                </div>
            </div>
        </VerticleLayout>
    );
};

export default UserEditProject;
