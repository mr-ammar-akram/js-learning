import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { useProfile } from "./global/UserContext";
import PopupModal from "./global/popupModal";
import CreateMembership from "./popups/createMembership";
import DeleteMembership from "./popups/deleteMembership";
import UpdateMembership from "./popups/updateMembership";
import NoticeComponents from "../components/noticComponents";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import { Trash, Pencil } from "lucide-react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function AdminMembership() {
    const navigate = useNavigate();
    const [setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const { getProfileImage } = useProfile();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [addMembership, setAddMembership] = useState(false);
    const [deleteMembership, setDeleteMembership] = useState(false);
    const [updateMembership, setUpdateMembership] = useState(false);
    const [userId, setUserId] = useState("");
    const [membershipId, setMembershipId] = useState("");
    const [membershipName, setMembershipName] = useState("");
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );
    const [memberships, setMemberships] = useState([]);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const getPlans = async () => {
            const plansResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/membership-plans`);
            const plansData = await plansResponse.json();
            // sort by recent first
            setPlans(plansData.data.sort((a, b) => b.id - a.id));
        }
        const getMemberships = async () => {
            const membershipsResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/memberships`);
            const membershipsData = await membershipsResponse.json();
            setMemberships(membershipsData.data.sort((a, b) => b.id - a.id));
        }  
        getMemberships();
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
                    setUserId(user_id);
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
    }, [navigate, refreshTrigger, getProfileImage, setToken]);
    // 1. Callback function that expects a value from the child
    const handleChildData = (value) => {
        setShowPopup(value);
        setDeleteMembership(value);
        setAddMembership(value);
        setUpdateMembership(value);
        setRefreshTrigger(prev => prev + 1);
    };

    const handlePopupModal = () => {
        setAddMembership(true);
        setShowPopup(true);
    }

    const handleDeleteMembership = (membership_id, membership_name)=>{
        setMembershipName(membership_name);
        setMembershipId(membership_id);
        setDeleteMembership(true);
        setShowPopup(true);
    }

    const handleUpdateMembership = (membership_id)=>{
        setMembershipId(membership_id);
        setUpdateMembership(true);
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
                <AdminHeader pageName="Memberships" userD={userData ? userData : {}} />

                {/* CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Add User Button */}
                    <button className="bg-orange-400 hover:bg-orange-500 text-white mb-8 px-4 py-2 rounded-md"
                        onClick={handlePopupModal}
                    >
                        Add Membership
                    </button>
                    <PopupModal
                        isOpen={showPopup}
                        onClose={
                            () => {
                                setShowPopup(false);
                                setAddMembership(false);
                                setDeleteMembership(false);
                                setUpdateMembership(false);
                            }
                        }
                        pWidth='690'
                        popupData={
                            addMembership ? <CreateMembership onValueReturn={handleChildData} onSetNotice={handleNotice} userId={userId}/> :
                            deleteMembership ? <DeleteMembership onValueReturn={handleChildData} onSetNotice={handleNotice} membershipID={membershipId} membershipName={membershipName} /> :
                            updateMembership ? <UpdateMembership onValueReturn={handleChildData} onSetNotice={handleNotice} membershipID={membershipId} /> :
                            null
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
                                <TableCell>Description</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Plan</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {memberships.map((membership, index) => (
                                <TableRow key={membership.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{membership.id}</TableCell>
                                    <TableCell>{membership.title}</TableCell>
                                    <TableCell className="post-description" sx={{ overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: membership.description }} />
                                    <TableCell>
                                        {plans.map((plan) => (
                                            <span key={plan.id}>{membership.plan == plan.id ? plan.amount : ''}</span>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        {plans.map((plan) => (
                                            <span key={plan.id}>{membership.plan == plan.id ? plan.name : ''}</span>
                                        ))}
                                    </TableCell>

                                    <TableCell>{
                                        membership.duration == 1 ? 'One Time' : membership.duration == 30 ? 'Monthly' : membership.duration == 90 ? 'Quarterly' : membership.duration == 180 ? 'Half Yearly' : membership.duration == 365 ? 'Yearly' : ''
                                    }</TableCell>
                                    <TableCell sx={{ width: "10%" }}>
                                        <Pencil onClick={()=>handleUpdateMembership(membership.id)} className="inline-block mx-1 hover:text-blue-600 cursor-pointer" />
                                        <Trash onClick={()=>handleDeleteMembership(membership.id, membership.title)} className="inline-block mx-1 hover:text-red-600 cursor-pointer" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </main>

            </div>
        </div>
    );
}