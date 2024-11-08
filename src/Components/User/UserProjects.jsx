"use client"
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { deleteProjectApi, getAllprojectsApi } from "@/store/actions/campaign";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Menu, Dropdown, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useRouter } from "next/router";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactPagination from "../../../src/Components/Pagination/ReactPagination.jsx";
import Loader from "../../../src/Components/Loader/Loader.jsx";
import toast from "react-hot-toast";

import { placeholderImage, translate } from "@/utils/index.js";
import { languageData } from "@/store/reducer/languageSlice.js";
import Swal from "sweetalert2";
import Image from "next/image";
import dynamic from "next/dynamic.js";


const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false })
const UserProjects = () => {

    const limit = 8;

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [getProjects, setGetProjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [propertyIdToDelete, setPropertyIdToDelete] = useState(null);
    const [propertyId, setPropertyId] = useState(null);



    const startIndex = total > 0 ? (offsetdata * limit) + 1 : 0;
    const endIndex = Math.min((offsetdata + 1) * limit, total);
    const SettingsData = useSelector(settingsData);


    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);

    const handleClickEdit = (projectId) => {
        router.push(`/user/edit-project/${projectId}`);
    };
    const handleClickDelete = (projectId) => {

        if (SettingsData.demo_mode === true) {
            Swal.fire({
                title: translate("opps"),
                text: translate("notAllowdDemo"),
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: translate("ok"),
            });
            return false;
        }
        Swal.fire({
            icon: "warning",
            title: translate("areYouSure"),
            text: translate("youWantToDeleteProject"),
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
            },

        }).then((result) => {
            if (result.isConfirmed) {
                // setPropertyIdToDelete(projectId);
                setIsLoading(true);
                deleteProjectApi(
                    projectId,
                    (response) => {
                        setIsLoading(true);
                        toast.success(response.message);

                        getAllprojectsApi({
                            offset: offsetdata.toString(),
                            limit: limit.toString(),
                            userid: isLoggedIn ? userCurrentId : "",
                            onSuccess: (response) => {
                                setTotal(response.total);
                                setView(response.total_clicks);
                                const ProjectData = response.data;
                                setIsLoading(false);
                                setGetProjects(ProjectData);
                            },
                            onError: (error) => {
                                setIsLoading(false);
                                console.log(error);
                            }
                        }
                        );
                    },
                    (error) => {
                        setIsLoading(false);
                        toast.error(error);
                    }
                );
            }
        })
    };



    const systemSetttings = useSelector(settingsData);
    const hasSubscription = SettingsData?.subscription

    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const userData = isLoggedIn && isLoggedIn?.data?.data?.name;

    useEffect(() => {
        setIsLoading(true);
        getAllprojectsApi({
            offset: offsetdata.toString(),
            limit: limit.toString(),
            userid: isLoggedIn ? userCurrentId : "",
            onSuccess: (response) => {
                setTotal(response.total);
                setView(response.total_clicks);
                const ProjectData = response.data;
                setIsLoading(false);
                setGetProjects(ProjectData);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        }
        );
    }, [offsetdata, isLoggedIn, propertyIdToDelete]);

    useEffect(() => { }, [propertyId, propertyIdToDelete]);

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };

    return (
        <VerticleLayout>
            <div className="container">
                <div className="dashboard_titles">
                    <h3>{translate("myProjects")}</h3>
                </div>
                <div className="row" id="dashboard_top_card">

                    <div className="col-12">
                        <div className="table_content card bg-white">
                            <TableContainer
                                component={Paper}
                                sx={{
                                    background: "#fff",
                                    padding: "10px",
                                }}
                            >
                                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                    <TableHead
                                        sx={{
                                            background: "#f5f5f5",
                                        }}
                                    >
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "600" }}>{translate("listingTitle")}</TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("category")}
                                            </TableCell>
                                            {/* <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("views")}
                                            </TableCell> */}
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("postedOn")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("status")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("action")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    {/* Centered loader */}
                                                    <div>
                                                        <Loader />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : getProjects && getProjects.length > 0 ? (
                                            getProjects.map((elem, index) => (

                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row" sx={{ width: "40%" }}>
                                                        <div className="card" id="listing_card">
                                                            <div className="listing_card_img">
                                                                <Image loading="lazy" src={elem?.image} onError={placeholderImage} alt="no_img" id="main_listing_img" width={150} height={0} style={{ height: "auto" }} />
                                                            </div>
                                                            <div className="listing_card_body">
                                                                <span className="listing_prop_title">{elem.title}</span>
                                                                <span className="listing_prop_pirce">{elem?.type === "upcoming" ? "Upcoming" : "Under Construction"}</span>
                                                                <span className="listing_prop_loc">
                                                                    {elem.city}{elem.state ? "," : ""} {elem.state}{elem.country ? "," : ""} {elem.country}
                                                                </span>

                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">{elem?.category?.category}</TableCell>
                                                    {/* <TableCell align="center">{elem.total_view}</TableCell> */}

                                                    <TableCell align="center">{elem.created_at}</TableCell>
                                                    <TableCell align="center">
                                                        {elem.status === 1 ?
                                                            <span className="active_status">{translate("active")}</span> : <span className="inactive_status">{translate("inactive")}</span>
                                                        }</TableCell>
                                                    <TableCell align="center">
                                                        <Dropdown
                                                            visible={anchorEl === index}
                                                            onVisibleChange={(visible) => {
                                                                if (visible) {
                                                                    setAnchorEl(index);
                                                                } else {
                                                                    setAnchorEl(null);
                                                                }
                                                            }}
                                                            overlay={
                                                                <Menu>
                                                                    {hasSubscription &&
                                                                    <Menu.Item key="edit" onClick={() => handleClickEdit(elem.slug_id)}>
                                                                        <Button type="text" icon={<EditOutlined />}>
                                                                            {translate("edit")}
                                                                        </Button>
                                                                    </Menu.Item>
                                                                    }

                                                                    <Menu.Item key="delete" onClick={() => handleClickDelete(elem?.id)}>
                                                                        <Button type="text" icon={<DeleteOutlined />} >
                                                                            {translate("delete")}
                                                                        </Button>
                                                                    </Menu.Item>
                                                                </Menu>
                                                            }
                                                        >
                                                            <Button id="simple-menu">
                                                                <BsThreeDotsVertical />
                                                            </Button>
                                                        </Dropdown>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    <p>{translate("noDataAvailabe")}</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>


                            {total > limit ? (
                                <div className="col-12">

                                    <ReactPagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} startIndex={startIndex} endIndex={endIndex} total={total} />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </VerticleLayout>

    )
}

export default UserProjects
