import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import CreatePlan from "./popups/createPlan"
import UpdatePlan from "./popups/updatePlan"
import DeletePlan from "./popups/deletePlan"
import { useProfile } from "./global/UserContext";
import PopupModal from "./global/popupModal";
import { Trash, Pencil, XCircle, CheckCircle } from "lucide-react";
import NoticeComponents from "../components/noticComponents";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function AdminPlans() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const [plans, setPlans] = useState([]);
    const { getProfileImage, getProfileData, loading, error } = useProfile();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [addPlan, setAddPlan] = useState(false);
    const [deletePlan, setDeletePlan] = useState(false);
    const [updatePlan, setUpdatePlan] = useState(false);
    const [planId, setPlanId] = useState("");
    const [planName, setPlanName] = useState("");
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );

    useEffect(() => {
        const getPlans = async () => {
            const plansResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/membership-plans`);
            const plansData = await plansResponse.json();
            // sort by recent first
            setPlans(plansData.data.sort((a, b) => b.id - a.id));
        }
        getPlans();

        const checkToken = async () => {
            //get token value
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith(`token=`))
                ?.split('=')[1];
            if (token) {
                const decoded = jwtDecode(token);
                if (decoded.user_role === "admin") {
                    // user detail 
                    const user_id = decoded.id;
                    const profileImage = await getProfileImage(user_id);
                    if (profileImage) {
                        setUserData(profileImage.data);
                    } else {
                        setUserData(decoded);
                    }
                    setToken(token);
                } else {
                    navigate('/homepage');
                }
            } else {
                navigate('/login');
            }
        }
        checkToken();
    }, [navigate, refreshTrigger, getProfileImage]);

    // 1. Callback function that expects a value from the child
    const handleChildData = (value) => {
        setShowPopup(value);
        setDeletePlan(value);
        setAddPlan(value);
        setUpdatePlan(value);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleUpdatePlan = (id) => {
        setPlanId(id);
        setUpdatePlan(true);
        setShowPopup(true);
    }

    const handleDeletePlan = (id, name) => {
        setPlanId(id);
        setPlanName(name);
        setDeletePlan(true);
        setShowPopup(true);
    }

    const handlePopupModal = () => {
        setAddPlan(true);
        setShowPopup(true);
    }

    const handleNotice = (notice) => {
        setNotice(notice);
    }
    return (
        <div className="w-full flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <AdminHeader pageName="Membership Plans" userD={userData ? userData : {}} />

                {/* CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Add User Button */}
                    <button className="bg-orange-400 hover:bg-orange-500 text-white mb-8 px-4 py-2 rounded-md"
                        onClick={handlePopupModal}
                    >
                        Add Plan
                    </button>
                    <PopupModal
                        isOpen={showPopup}
                        onClose={
                            () => {
                                setShowPopup(false);
                                setAddPlan(false);
                                setDeletePlan(false);
                                setUpdatePlan(false);
                            }
                        }
                        pWidth='590'
                        popupData={
                            addPlan ? <CreatePlan onValueReturn={handleChildData} onSetNotice={handleNotice} /> :
                            deletePlan ? <DeletePlan onValueReturn={handleChildData} onSetNotice={handleNotice} postPlanID={planId} planName={planName} /> : 
                            updatePlan ? <UpdatePlan onValueReturn={handleChildData} onSetNotice={handleNotice} postPlanID={planId} />:
                            <></>
                        }
                    />
                    <NoticeComponents notice={notice} setNotice={setNotice} />
                    {/* users table */}
                    <Table className="bg-white rounded-xl flex mt-2 flex-col shadow">
                        <TableHead>
                            <TableRow sx={{ fontWeight: "bold" }}>
                                <TableCell>#</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans && plans.length > 0 ? (
                                plans.map((plan, index) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{plan.id}</TableCell>
                                        <TableCell>{plan.name}</TableCell>
                                        <TableCell>{plan.amount}</TableCell>
                                        <TableCell>{dayjs(plan.created_at).tz('Asia/Karachi').format('ddd, MMMM YYYY, hh:mm A')}</TableCell>
                                        <TableCell>
                                            <Pencil onClick={() => handleUpdatePlan(plan.id)} className="inline-block mx-2 hover:text-blue-600 cursor-pointer" />
                                            <Trash onClick={() => handleDeletePlan(plan.id, plan.name)} className="inline-block mx-2 hover:text-red-600 cursor-pointer" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">No membership plans found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                </main>

            </div>
        </div>
    );
}