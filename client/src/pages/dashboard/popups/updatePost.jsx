import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import TextEditor from "../../tiptap/TipTap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import MultipleSelectCheckmarks from "../../components/multiSelect"


export default function UpdatePost  ({onValueReturn, onSetNotice, postID}){

    const [loader, setLoader] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    // const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState({
        title: "",
        slug: '',
        description: "",
        cat_id: "",
        tag_id: [],
        attachment_id: "",
        author_id: "",
        image: "",
    });
    // const [notice, setNotice] = useState({
    //     type: "",
    //     message: ""
    // });
    
    const editor = useEditor({
        extensions: [
            TextStyleKit, 
            StarterKit,
            Link.configure({
                openOnClick: false, 
                autolink: true,
                linkOnPaste: true,
            }),
            Image.configure({
                inline: true,
            }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
            setPostData(prev => ({
            ...prev,
            description: editor.getHTML(),
            }));
        },
    });
    useEffect(()=>{
        setLoader(true);
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
        const getPost = async () => {
            const postResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/post/${postID}`);
            const postData = await postResponse.json();
            if (editor) {
                editor.commands.setContent(postData.data.description);
            }
            setPreviewImage(postData.data.post_image_url);
            setPostData(postData.data);
        }  
        getPost();
        getCategories();
        getTags();
        setLoader(false);
    },[editor, postID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'title'){
            let postSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            setPostData(prevData => ({
                ...prevData,
                [name]: value,
                slug: postSlug
            }));
        }else{
            setPostData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setPostData(prevData => ({
                ...prevData,
                image: file
            }));
        }

    };
    const returnIDs = (values)=>{
        setPostData(prev => ({
            ...prev,
            cat_id: values.catIDs,
            tag_id: values.tagIDs
        }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        if (!/^[a-zA-Z0-9][a-zA-Z0-9\s]*$/.test(postData.title.trim())){
            onSetNotice({
                type: "error",
                message: "Post title is required"
            });
            onValueReturn(false);
            setLoader(false);
            return;
        }
        if(previewImage === null){
            setLoader(false);
            postData.attachment_id = null;
        }
            const formData = new FormData();

            formData.append('title', postData.title);
            formData.append('slug', postData.slug);
            formData.append('description', postData.description);
            formData.append('cat_id', postData.cat_id);
            formData.append('tag_id', postData.tag_id);
            formData.append('attachment_id', postData.attachment_id);
            formData.append('author_id', postData.author_id);
            formData.append('file', postData.image);
            
            try {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/post/update/${postID}`, {
                    method: 'PUT',
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    onSetNotice({message: data.message, type: 'success' });
                    onValueReturn(false);
                } else {
                    onSetNotice({message: data.message, type: 'error' });
                }
            } catch (error) {
                onSetNotice({message: error.message, type: 'error' });
            }finally{
                setLoader(false);
            }
        // onValueReturn(formData);
    }

    return(
        <div className="w-full p-6 space-y-6">
            <h1 className="text-2xl font-bold">Edit Post</h1>
                <div className="w-full grid grid-cols-1 gap-6">
                    {/* name input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                        <input type="text" name='title' value={postData.title} className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={handleChange} required />
                    </div>
                    {/* Content input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <TextEditor editor={editor}/>
                    </div>
                    <div className="w-full grid grid-cols-1 gap-6">
                        <div>
                            <MultipleSelectCheckmarks catsData={categories} tagsData={tags} postCats={postData.cat_id} postTags={postData.tag_id} selectedData={returnIDs}/>
                        </div>
                    </div>
                    {/* Image input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input type="file" name='attachment_id' className="hidden" onChange={handleImageChange} accept="image/*" id="imageUpload"/>
                        {
                        previewImage
                        ?
                        <div className="relative  group">
                            <img
                            src={previewImage}
                            alt="Admin"
                            className="rounded-md object-cover"
                            />
                            {/* delete button */}
                            <X size={20} className="absolute top-0 right-0 m-2 text-white bg-red-500 rounded-full p-1 cursor-pointer hover:bg-red-600 transition-colors" onClick={() => setPreviewImage(null)}/>
                        </div>
                        : 
                        (<div>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => document.getElementById("imageUpload").click()}>
                                <div className="text-4xl text-gray-400 mb-2"><Upload size={40} /></div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Click to upload image</p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF or WebP</p>
                            </div>
                            <span className="text-sm text-gray-500">No file chosen</span>
                        </div>
                        )}
                    </div>
                    {/* save button */}
                    <div className="w-full">
                        <button onClick={handleSubmit} className="w-full px-3 py-2 border bg-orange-400 text-white rounded-md">
                            {loader ? (
                            <>
                                <span className="spinner"></span>
                            </>
                            ) : (
                                'Update Post'
                            )
                            }
                        </button>
                    </div>
            </div>
            
        </div>
    );
}