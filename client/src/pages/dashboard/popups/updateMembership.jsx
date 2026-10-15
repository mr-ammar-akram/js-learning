import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import TextEditor from "../../tiptap/TipTap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function UpdateMembership  ({onValueReturn, onSetNotice, membershipID}){

    const [loader, setLoader] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [membershipData, setMembershipData] = useState({
        title: "",
        description: "",
        price: "",
        plan: "",
        attachment_id:'',
        file: null,
    });
    const [planId, setPlanId] = useState('');
    const [amount, setAmount] = useState('');
    const [isloaded, setIsLoaded] = useState(false);
    const [duration, setDuration] = useState('');
    const [plans, setPlans] = useState([]);
    
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
            setMembershipData(prev => ({
            ...prev,
            description: editor.getHTML(),
            }));
        },
    });
    useEffect(()=>{
        setLoader(true);
        const getPlans = async () => {
            const plansResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/membership-plans`);
            const plansData = await plansResponse.json();
            setPlans(plansData.data.sort((a, b) => b.id - a.id));
        }
        getPlans();
        const getMembership = async () => {
            const membershipResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/membership/${membershipID}`);
            const membershipData = await membershipResponse.json();
            if(plans.length > 0 && !isloaded){
                plans.map(plan=> {
                    if(plan.id == membershipData.data.plan){
                        setAmount(plan.amount);
                    }
                })
                setPreviewImage(membershipData.data.file_url);
                setIsLoaded(true);
                if (editor) {
                    editor.commands.setContent(membershipData.data.description);
                }
                setMembershipData(prevData => ({
                    ...prevData,
                    title: membershipData.data.title,
                    price: membershipData.data.price,
                    plan: membershipData.data.plan,
                    duration: membershipData.data.duration,
                    attachment_id: membershipData.data.attachment_id,
                }));
                setPlanId(membershipData.data.plan);
                setDuration(membershipData.data.duration);
            }
        }
        getMembership();
        setLoader(false);
    },[editor, isloaded, plans, membershipID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'plan'){
            const selectedPlan = plans.find(plan => plan.id === value);
            setAmount(selectedPlan.amount);
            setMembershipData(prevData => ({
                ...prevData,
                price: selectedPlan.amount,
                plan: selectedPlan.id,
            }));
            setPlanId(value);
        }else if(name === 'duration'){
            setMembershipData(prevData => ({
                ...prevData,
                duration: value,
            }));
        }else{
            setMembershipData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setMembershipData(prevData => ({
                ...prevData,
                file: file
            }));
        }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        if (!/^[a-zA-Z0-9][a-zA-Z0-9\s]*$/.test(membershipData.title.trim())){
            onSetNotice({
                type: "error",
                message: "Membership title is required"
            });
            onValueReturn(false);
            setLoader(false);
            return;
        }
        // checking if price is more than 2 digits after decimal
        if (!/^\d+(\.\d{1,2})?$/.test(membershipData.price)) {
            onSetNotice({
                type: "error",
                message: "Price must be a number with at most 2 digits after decimal"
            });
            onValueReturn(false);
            setLoader(false);
            return;
        }
        // checking if plan is empty
        if(planId === ''){
            onSetNotice({
                type: "error",
                message: "Plan is required"
            });
            onValueReturn(false);
            setLoader(false);
            return;
        }
        // checking if file is empty
        if(previewImage === null){
            setLoader(false);
            membershipData.attachment_id = null;
        }
            const formData = new FormData();

            formData.append('title', membershipData.title);
            formData.append('description', membershipData.description);
            formData.append('plan', membershipData.plan);
            formData.append('duration', membershipData.duration);
            if (membershipData.attachment_id !== null) {
                formData.append('attachment_id', membershipData.attachment_id);
            }
            formData.append('file', membershipData.file);
            
            try {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/membership/update/${membershipID}`, {
                    method: 'PUT',
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    onSetNotice({message: data.message, type: 'success' });
                    onValueReturn(false);
                } else {
                    onSetNotice({message: data.message, type: 'error' });
                    onValueReturn(false);
                }
            } catch (error) {
                onSetNotice({message: error.message, type: 'error' });
                onValueReturn(false);
            }finally{
                setLoader(false);
            }
        // onValueReturn(formData);
    }

    return(
        <div className="w-full p-6 space-y-6">
            <h1 className="text-2xl font-bold">Edit Membership</h1>
                <div className="w-full grid grid-cols-1 gap-6">
                    {/* name input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                        <input type="text" name='title' value={membershipData.title} className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={handleChange} required />
                    </div>
                    {/* Content input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <TextEditor editor={editor}/>
                    </div>

                    <Box sx={{ minWidth: 120, display:"flex", justifyContent:"space-between", gap:"1rem" }}>
                        <FormControl fullWidth>
                            <InputLabel id="membership-plan-select">Plan</InputLabel>
                            <Select
                                labelId="membership-plan-select"
                                id="membership-plan-select"
                                name="plan"
                                value={planId ?? ""}
                                label="Plan"
                                onChange={handleChange}
                            >
                                {plans.map((plan) => (
                                    <MenuItem key={plan.id} value={plan.id}>{plan.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="membership-price-select">Price</InputLabel>
                            <Select
                                labelId="membership-price-select"
                                id="membership-price-select"
                                value={amount ?? ""}
                                label="Amount"
                                onChange={handleChange}
                            >
                                <MenuItem value={amount}>{amount}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {/* duration input */}
                    <Box sx={{ minWidth: 120, display:"flex", justifyContent:"space-between", gap:"1rem" }}>
                        <FormControl fullWidth>
                            <InputLabel id="membership-duration-select">Duration<span className="text-red-500">*</span></InputLabel>
                            <Select
                                labelId="membership-duration-select"
                                id="membership-duration-select"
                                name="duration"
                                value={membershipData.duration ?? ""}
                                label="Duration"
                                onChange={handleChange}
                            >
                                {/* auto select when during edit */}
                                <MenuItem value={1} selected={duration === 1}>One Time</MenuItem>
                                <MenuItem value={30} selected={duration === 30}>Monthly</MenuItem>
                                <MenuItem value={90} selected={duration === 90}>Quarterly</MenuItem>
                                <MenuItem value={180} selected={duration === 180}>Half Yearly</MenuItem>
                                <MenuItem value={365} selected={duration === 365}>Yearly</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {/* Image input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input type="file" name='file' className="hidden" onChange={handleFileChange} accept="image/*" id="imageUpload"/>
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
                                'Update Membership'
                            )
                            }
                        </button>
                    </div>
            </div>
            
        </div>
    );
}