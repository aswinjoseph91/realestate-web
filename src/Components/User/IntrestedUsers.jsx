"use client"

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { getIntrestedUserApi } from "@/store/actions/campaign";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Pagination from "@/Components/Pagination/ReactPagination";
import { translate } from "@/utils/index.js";
import { languageData } from "@/store/reducer/languageSlice.js";
import Loader from "@/Components/Loader/Loader";
import { useRouter } from "next/router.js";
import dynamic from "next/dynamic.js";
const VerticleLayout = dynamic(() => import('../../../src/Components/AdminLayout/VerticleLayout.jsx'), { ssr: false })

const IntrestedUsers = () => {

    const router = useRouter()
    const slug_id = router?.query?.slug

    const lang = useSelector(languageData);
    const [Data, setData] = useState([]);

    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const limit = 10;
    useEffect(() => { }, [lang]);

    // api call
    useEffect(() => {
        if (!router.isReady) return;
        setIsLoading(true)
        getIntrestedUserApi({
            slug_id: slug_id,
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (res) => {
                setTotal(res.total)
                setData(res.data)
                setIsLoading(false)

            },
            onError: (err) => {
                toast.error(err.message);
            }
        });

    }, [router.isReady]);
    // handle page change
    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };
    // format date
    function formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }


    return (
        <VerticleLayout>
            <div className="container">
                <div className="tranction_title">
                    <h1>{translate("intresteduserDetails")}</h1>
                </div>
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
                                    background: "#f5f5f4",
                                    borderRadius: "12px",
                                }}
                            >
                                <TableRow
                                    sx={{
                                        // padding:"20px",
                                        background: "#f5f5f5",
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: "600" }} align="left">
                                        {translate("ID")}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "600" }} align="left">
                                        {translate("Name")}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "600" }} align="left">
                                        {translate("email")}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "600" }} align="left">
                                        {translate("mobileno")}
                                    </TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <div>
                                                <Loader />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : Data.length > 0 ? (
                                    Data.map((elem, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell align="left">{elem?.name}</TableCell>
                                            <TableCell align="left" className="intrested_contact">
                                                <a href={`mailto:${elem?.email}}`}>
                                                    {elem?.email}
                                                </a>
                                            </TableCell>
                                            <TableCell align="left" className="intrested_contact">
                                                <a href={`tel:${elem?.mobile}}`}>
                                                    {elem?.mobile}
                                                </a>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="left">
                                            <p>{translate("noDataAvailabe")}</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {total > limit ? (
                            <div id="pagination_div" className="row">
                                <div className="col-12">
                                    <Pagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                                </div>
                            </div>
                        ) : null}
                    </TableContainer>
                </div>
            </div>
        </VerticleLayout>
    );
};

export default IntrestedUsers;
