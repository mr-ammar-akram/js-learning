import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { useProfile } from "./global/UserContext";
import PopupModal from "./global/popupModal";
import NoticeComponents from "../components/noticComponents";
import CreateCategory from "./popups/createCategory"
import DeleteCategory from "./popups/deleteCategory"
import UpdateCategory from "./popups/updateCategory"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import { Trash, Pencil, XCircle, CheckCircle } from "lucide-react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function AdminCategories() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const { getProfileImage, getProfileData, loading, error } = useProfile();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [addCategory, setAddCategory] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState(false);
    const [updateCategory, setUpdateCategory] = useState(false);
    const [catId, setCatId] = useState();
    const [catName, setCatName] = useState("");
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        const getCategories = async () => {
            const categoriesResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/categories`);
            const categoriesData = await categoriesResponse.json();
            // sort by recent first
            setCategories(categoriesData.data.sort((a, b) => b.id - a.id));
        }
        getCategories();

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
        setDeleteCategory(value);
        setAddCategory(value);
        setUpdateCategory(value);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDelete = async (id, name) => {
        setCatId(id);
        setCatName(name);
        setDeleteCategory(true);
        setShowPopup(true);
    }

    const handleUpdate = async (id) => {
        setUpdateCategory(true);
        setShowPopup(true);
        setCatId(id);
    }
    

    const handlePopupModal = () => {
        setAddCategory(true);
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
                <AdminHeader pageName="Categories" userD={userData ? userData : {}} />

                {/* CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Add User Button */}
                    <button className="bg-orange-400 hover:bg-orange-500 text-white mb-8 px-4 py-2 rounded-md"
                        onClick={handlePopupModal}
                    >
                        Add Category
                    </button>
                    <PopupModal
                        isOpen={showPopup}
                        onClose={
                            () => {
                                setShowPopup(false);
                                setAddCategory(false);
                                setDeleteCategory(false);
                                setUpdateCategory(false);
                            }
                        }
                        pWidth='590'
                        popupData={
                            addCategory ? <CreateCategory onValueReturn={handleChildData} onSetNotice={handleNotice}/> : 
                            deleteCategory ? <DeleteCategory onValueReturn={handleChildData} onSetNotice={handleNotice} cateID={catId} catName={catName}/> :
                            updateCategory ? <UpdateCategory onValueReturn={handleChildData} onSetNotice={handleNotice} cateID={catId}/> :
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
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Slug</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="overflow-y-auto">
                            {categories.map((category, index) => (
                                <TableRow key={category.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell><img src={`${category.cat_image_url}`} alt={category.cat_name} className="w-12 h-12" /></TableCell>
                                    <TableCell>{category.cat_name}</TableCell>
                                    <TableCell>{category.cat_slug}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>{dayjs(category.created_at).tz('Asia/Karachi').format('ddd, MMMM YYYY, hh:mm A')}</TableCell>
                                    <TableCell>
                                        <Pencil onClick={() => handleUpdate(category.id)} className="inline-block mx-2 hover:text-blue-600 cursor-pointer" />
                                        <Trash onClick={() => handleDelete(category.id, category.cat_name)} className="inline-block mx-2 hover:text-red-600 cursor-pointer" />
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