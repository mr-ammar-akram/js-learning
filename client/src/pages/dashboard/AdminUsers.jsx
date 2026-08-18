import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserCircle, Trash, Pencil, XCircle, CheckCircle } from "lucide-react";
import { useProfile } from "./global/UserContext";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import PopupModal from "./global/popupModal";
import CreateUser from './popups/createUser';
import DeleteUser from './popups/deleteUser';
import EditUser from './popups/editUser';
import NoticeComponents from "../components/noticComponents";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);


export default function AdminDashboard() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const { getProfileImage, getProfileData, loading, error } = useProfile();
    const [users, setUsers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [addUser, setAddUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [userId, setUserId] = useState("")
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );

    useEffect(() => {
        const getUsers = async () => {
            const usersReponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/users`);
            const userData = await usersReponse.json();
            setUsers(userData.data.sort((a, b) => a.id - b.id));
        }
        getUsers();

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
        setDeleteUser(value);
        setAddUser(value);
        setUpdateUser(value);
        setRefreshTrigger(prev => prev + 1);
    };
    const handlePopupModal = () => {
        setAddUser(true);
        setShowPopup(true);
    }
    const handleNotice = (notice) => {
        setNotice(notice);
    }
    const handleDelete = (userId) => {
        setUserId(userId);
        setDeleteUser(true);
        setShowPopup(true);
    }
    const handleEdit = (userId) => {
        setUserId(userId);
        setUpdateUser(true);
        setShowPopup(true);
    }
    return (
        <div className="w-full flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar />
            {/* Main */}
            <div className="flex-1">

                {/* Header */}
                <AdminHeader pageName="Users" userD={userData ? userData : {}} />

                <main className="flex-1 p-8">
                    {/* Add User Button */}
                    <button className="bg-orange-400 hover:bg-orange-500 text-white mb-8 px-4 py-2 rounded-md" onClick={handlePopupModal}>Add User</button>
                    <PopupModal
                        isOpen={showPopup}
                        onClose={
                            () => {
                                setShowPopup(false);
                                setAddUser(false);
                                setDeleteUser(false);
                                setUpdateUser(false);
                            }
                        }
                        pWidth='590'
                        popupData={
                            addUser ? <CreateUser onValueReturn={handleChildData} onSetNotice={handleNotice} />
                                : deleteUser ? <DeleteUser userId={userId} onValueReturn={handleChildData} onSetNotice={handleNotice} />
                                    : <EditUser userId={userId} onValueReturn={handleChildData} onSetNotice={handleNotice} />
                        }
                    />
                    <NoticeComponents notice={notice} setNotice={setNotice} />
                    {/* users table */}
                    <Table className="bg-white rounded-xl flex mt-2 flex-col shadow">
                        <TableHead>
                            <TableRow sx={{ fontWeight: "bold" }}>
                                <TableCell>#</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Verified</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                users.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.id ? user.id : "---"}</TableCell>
                                        <TableCell>
                                            {user.profile_picture ? (
                                                <img src={user.profile_picture} alt="" className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <UserCircle size={20} />
                                            )}

                                        </TableCell>
                                        <TableCell>{user.full_name ? user.full_name : "---"}</TableCell>
                                        <TableCell>{user.user_name ? user.user_name : "---"}</TableCell>
                                        <TableCell>{user.user_email ? user.user_email : "---"}</TableCell>
                                        <TableCell>{user.user_phone ? user.user_phone : "---"}</TableCell>
                                        <TableCell>{user.user_role ? user.user_role : "---"}</TableCell>
                                        <TableCell>{user.is_verified ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}</TableCell>
                                        <TableCell>{user.created_at ? dayjs(user.created_at).tz('Asia/Karachi').format('ddd, MMMM YYYY, hh:mm A') : "---"}</TableCell>
                                        <TableCell>
                                            <Trash size={20} onClick={() => handleDelete(user.id)} className="inline-block mx-2 hover:text-red-600 cursor-pointer" />
                                            <Pencil size={20} onClick={() => handleEdit(user.id)} className="inline-block mx-2 hover:text-blue-600 cursor-pointer" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </main>
            </div>
        </div>
    );
}
