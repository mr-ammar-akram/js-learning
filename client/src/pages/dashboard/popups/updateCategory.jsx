import { useEffect, useState } from "react";
import { CSpinner } from "@coreui/react";
import TextEditor from "../../tiptap/TipTap";
import { Upload, X } from "lucide-react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Typography from '@mui/material/Typography';


export default function UpdateCategory({ cateID, onValueReturn, onSetNotice }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [loader, setLoader] = useState(false);
    const [categoryData, setCategoryData] = useState({
        cat_name:"",
        cat_slug:'',
        description:"",
    });
    const  editor = useEditor({
        extensions: [TextStyleKit, StarterKit],
        onUpdate: ({ editor }) => {
            setCategoryData(prev => ({
                ...prev,
                description: editor.getHTML(),
            }));
        },
    });


    useEffect(() => {
        const getCategories = async () => {
            setLoader(true);
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/category/${cateID}`);
            const data = await response.json();
            setCategoryData(data.data);
            if (editor) {
                editor.commands.setContent(data.data.description);
            }
            setPreviewImage(data.data.cat_image_url);
            setLoader(false);
        }
        getCategories();
    }, [editor,cateID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'cat_name'){
            let catSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            setCategoryData(prevData => ({
                ...prevData,
                [name]: value,
                cat_slug: catSlug
            }));
        }else{
            setCategoryData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setCategoryData(prevData => ({
                ...prevData,
                image: file
            }));
        }

    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoader(true);  
        if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(categoryData.cat_name.trim())){
            onSetNotice({
                type: "error",
                message: "Category name is required"
            });
            onValueReturn(false);
            setLoader(false);
            return;
        }
        if(previewImage === null){
            setLoader(false);
            categoryData.attachment_id = null;
        }
        //convert json data to form data
        const formData = new FormData();
        formData.append('file', categoryData.image);
        formData.append('cat_name', categoryData.cat_name); 
        formData.append('cat_slug', categoryData.cat_slug);
        formData.append('description', categoryData.description);
        if (categoryData.attachment_id !== null) {
            formData.append('attachment_id', categoryData.attachment_id);
        }
        
            
            try {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/category/update/${cateID}`, {
                    method: 'PUT',
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    onValueReturn(false);
                    onSetNotice({ show: true, message: data.message, type: 'success' });
                } else {
                    onSetNotice({ show: true, message: data.message, type: 'error' });
                }
            } catch (error) {
                onSetNotice({ show: true, message: error.message, type: 'error' });
            }finally{
                setLoader(false);
            }
    }

        if(loader) return <CSpinner color="primary" />;
        
        
            return(
                <div className="w-full p-6 space-y-6">
                    <h1 className="text-2xl font-bold">Edit Category</h1>
                        <div className="w-full grid grid-cols-1 gap-6">
        
                            {/* name input */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                                <input type="text" name='cat_name' value={categoryData.cat_name ? categoryData.cat_name : ""} className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={handleChange} required />
                            </div>
                            {/* description input */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                {/* <textarea name='description' className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={handleChange}></textarea> */}
                                <TextEditor editor={editor}/>
                            </div>
                            {/* image input */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input type="file" name='image' className="hidden" onChange={handleImageChange} accept="image/*" id="imageUpload"/>
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
                                <button className="w-full px-3 py-2 border bg-orange-400 text-white rounded-md" onClick={handleSubmit}>
                                    {loader ? (
                                    <>
                                        <span className="spinner"></span>
                                    </>
                                    ) : (
                                        'Update Category'
                                    )
                                    }
                                </button>
                            </div>
                            
                        </div>
                    
                </div>
            );
}