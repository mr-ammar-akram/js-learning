import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import CreateTag from "./popups/createTag"
import UpdateTag from "./popups/updateTag"
import DeleteTag from "./popups/deleteTag"
import { useProfile } from "./global/UserContext";
import PopupModal from "./global/popupModal";
import { Trash, Pencil } from "lucide-react";
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

export default function AdminTags() {
    const navigate = useNavigate();
    const [setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const [tags, setTags] = useState([]);
    const { getProfileImage } = useProfile();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [addTag, setAddTag] = useState(false);
    const [deleteTag, setDeleteTag] = useState(false);
    const [updateTag, setUpdateTag] = useState(false);
    const [tagId, setTagId] = useState("");
    const [tagName, setTagName] = useState("");
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );

    useEffect(() => {
        const getTags = async () => {
            const tagsResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/tags`);
            const tagsData = await tagsResponse.json();
            // sort by recent first
            setTags(tagsData.data.sort((a, b) => b.id - a.id));
        }
        getTags();

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
    }, [navigate, refreshTrigger, getProfileImage, setToken]);

    // 1. Callback function that expects a value from the child
    const handleChildData = (value) => {
        setShowPopup(value);
        setDeleteTag(value);
        setAddTag(value);
        setUpdateTag(value);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleUpdateTag = (id) => {
        setTagId(id);
        setUpdateTag(true);
        setShowPopup(true);
    }

    const handleDeleteTag = (id, name) => {
        setTagId(id);
        setTagName(name);
        setDeleteTag(true);
        setShowPopup(true);
    }

    const handlePopupModal = () => {
        setAddTag(true);
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
                <AdminHeader pageName="Tags" userD={userData ? userData : {}} />

                {/* CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Add User Button */}
                    <button className="bg-orange-400 hover:bg-orange-500 text-white mb-8 px-4 py-2 rounded-md"
                        onClick={handlePopupModal}
                    >
                        Add Tag
                    </button>
                    <PopupModal
                        isOpen={showPopup}
                        onClose={
                            () => {
                                setShowPopup(false);
                                setAddTag(false);
                                setDeleteTag(false);
                                setUpdateTag(false);
                            }
                        }
                        pWidth='590'
                        popupData={
                            addTag ? <CreateTag onValueReturn={handleChildData} onSetNotice={handleNotice} /> :
                            deleteTag ? <DeleteTag onValueReturn={handleChildData} onSetNotice={handleNotice} postTagID={tagId} tagName={tagName} /> : 
                            updateTag ? <UpdateTag onValueReturn={handleChildData} onSetNotice={handleNotice} postTagID={tagId} />:
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
                                <TableCell>Slug</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tags && tags.length > 0 ? (
                                tags.map((tag, index) => (
                                    <TableRow key={tag.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{tag.id}</TableCell>
                                        <TableCell>{tag.tag_name}</TableCell>
                                        <TableCell>{tag.tag_slug}</TableCell>
                                        <TableCell>{tag.description}</TableCell>
                                        <TableCell>{dayjs(tag.created_at).tz('Asia/Karachi').format('ddd, MMMM YYYY, hh:mm A')}</TableCell>
                                        <TableCell>
                                            <Pencil onClick={() => handleUpdateTag(tag.id)} className="inline-block mx-2 hover:text-blue-600 cursor-pointer" />
                                            <Trash onClick={() => handleDeleteTag(tag.id, tag.tag_name)} className="inline-block mx-2 hover:text-red-600 cursor-pointer" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">No tags found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                </main>

            </div>
        </div>
    );
}