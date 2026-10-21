import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { useProfile } from "./global/UserContext";
import PopupModal from "./global/popupModal";
import CreatePost from "./popups/createPost";
import DeletePost from "./popups/deletePost";
import UpdatePost from "./popups/updatePost";
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

export default function AdminPosts() {
    const navigate = useNavigate();
    const [setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const { getProfileImage } = useProfile();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [addPost, setAddPost] = useState(false);
    const [deletePost, setDeletePost] = useState(false);
    const [updatePost, setUpdatePost] = useState(false);
    const [userId, setUserId] = useState("");
    const [postId, setPostId] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {

        const getPosts = async () => {
            const postsResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/posts`);
            const postsData = await postsResponse.json();
            setPosts(postsData.data.sort((a, b) => b.id - a.id));
        }  
        const getCategories = async()=>{
            try{
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/categories`);
                const data = await response.json();
                if(response.ok){
                    setCategories(data.data);
                }
            }catch(error){
                console.log(error);
            }
        }
        const getTags = async()=>{
            try{
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/tags`);
                const data = await response.json();
                if(response.ok){
                    setTags(data.data);
                }
            }catch(error){
                console.log(error);
            }
        }
        getCategories();
        getTags();
        getPosts();

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
        setDeletePost(value);
        setAddPost(value);
        setUpdatePost(value);
        setRefreshTrigger(prev => prev + 1);
    };

    const handlePopupModal = () => {
        setAddPost(true);
        setShowPopup(true);
    }

    const handleDeletePost = (post_id, post_title)=>{
        setPostTitle(post_title);
        setPostId(post_id);
        setDeletePost(true);
        setShowPopup(true);
    }

    const handleUpdatePost = (post_id)=>{
        setPostId(post_id);
        setUpdatePost(true);
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
                <AdminHeader pageName="Posts" userD={userData ? userData : {}} />

                {/* CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Add User Button */}
                    <button className="bg-orange-400 hover:bg-orange-500 text-white mb-8 px-4 py-2 rounded-md"
                        onClick={handlePopupModal}
                    >
                        Add Post
                    </button>
                    <PopupModal
                        isOpen={showPopup}
                        onClose={
                            () => {
                                setShowPopup(false);
                                setAddPost(false);
                                setDeletePost(false);
                                setUpdatePost(false);
                            }
                        }
                        pWidth='690'
                        popupData={
                            addPost ? <CreatePost onValueReturn={handleChildData} onSetNotice={handleNotice} userId={userId}/> :
                            deletePost ? <DeletePost onValueReturn={handleChildData} onSetNotice={handleNotice} postID={postId} postTitle={postTitle} /> :
                            updatePost ? <UpdatePost onValueReturn={handleChildData} onSetNotice={handleNotice} postID={postId} /> :
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
                                <TableCell>Title</TableCell>
                                <TableCell>Slug</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Tags</TableCell>
                                <TableCell sx={{ width: "25%" }}>Content</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {posts.map((post, index) => (
                                <TableRow key={post.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{post.id}</TableCell>
                                    <TableCell>{post.title}</TableCell>
                                    <TableCell>{post.slug}</TableCell>
                                    <TableCell>{post.author_id === userData.id ? userData.user_name : post.author_id}</TableCell>
                                    <TableCell>
                                        {categories
                                            .filter(cat => String(post.cat_id).split(',').map(s => s.trim()).includes(String(cat.id)))
                                            .map(cat => cat.cat_name)
                                            .join(', ') || '—'}
                                    </TableCell>
                                    <TableCell>
                                        {tags
                                            .filter(tag => String(post.tag_id).split(',').map(s => s.trim()).includes(String(tag.id)))
                                            .map(tag => tag.tag_name)
                                            .join(', ') || '—'}
                                    </TableCell>
                                    <TableCell className="post-description" sx={{ overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: post.description }} />
                                    <TableCell>{dayjs(post.created_at).tz('Asia/Kolkata').format('ddd, MMMM YYYY, hh:mm A')}</TableCell>
                                    <TableCell sx={{ width: "10%" }}>
                                        <Pencil onClick={()=>handleUpdatePost(post.id)} className="inline-block mx-1 hover:text-blue-600 cursor-pointer" />
                                        <Trash onClick={()=>handleDeletePost(post.id, post.title)} className="inline-block mx-1 hover:text-red-600 cursor-pointer" />
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