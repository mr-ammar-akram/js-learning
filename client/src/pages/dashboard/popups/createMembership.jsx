import * as Icons from "lucide-react";
import IconPicker from "../components/IconPicker";
import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import TextEditor from "../../tiptap/TipTap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


export default function CreateMembership  ({onValueReturn, onSetNotice}){

    const [loader, setLoader] = useState(false);
    const [icon, setIcon] = useState("");
    const [planId, setPlanId] = useState('');
    const [amount, setAmount] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);
    const [membershipData, setMembershipData] = useState({
        title: "",
        description: "",
        price: amount,
        plan: planId,
        duration:'',
        file: "",
    });

    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const getPlans = async () => {
            const plansResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/membership-plans`);
            const plansData = await plansResponse.json();
            setPlans(plansData.data.sort((a, b) => b.id - a.id));
        }
        getPlans();
    }, []);
    const editor = useEditor({
        extensions: [TextStyleKit, StarterKit],
        content: "",
        onUpdate: ({ editor }) => {
            setMembershipData(prev => ({
            ...prev,
            description: editor.getHTML(),
            }));
        },
        });
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setMembershipData(prevData => ({
                ...prevData,
                file: file
            }));
        }

    };
    const handleSubmitMembership = async (e) => {
        e.preventDefault();
        setLoader(true);
            const formData = new FormData();
            formData.append('title', membershipData.title);
            formData.append('description', membershipData.description);
            formData.append('price', membershipData.price);
            formData.append('plan', membershipData.plan);
            formData.append('duration', membershipData.duration);
            formData.append('file', membershipData.file);
            try {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/membership/add`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    onValueReturn(false);
                    onSetNotice({message: data.message, type: 'success' });
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
            <h1 className="text-2xl font-bold">Create Membership</h1>
                <div className="w-full grid grid-cols-1 gap-6">
                    {/* name input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                        <input type="text" name='title' className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={handleChange} required />
                    </div>
                    {/* Content input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <TextEditor editor={editor}/>
                    </div>
                    {/* icon input */}
                    <div style={{ margin: "20px 0" }}>
                        <IconPicker value={icon} onChange={setIcon} />
                        <p>Selected Icon: {icon}</p>
                    </div>
                    <Box sx={{ minWidth: 120, display:"flex", justifyContent:"space-between", gap:"1rem" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Plan</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="plan"
                        value={planId}
                        label="Plan"
                        onChange={handleChange}
                        >
                            {plans.map((plan) => (
                                <MenuItem key={plan.id} value={plan.id}>{plan.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Price</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={amount}
                        label="Amount"
                        onChange={handleChange}
                        >
                            <MenuItem value={amount}>{amount}</MenuItem>
                        </Select>
                    </FormControl>
                    </Box>

                    {/* Duration Input */}
                    <Box sx={{ minWidth: 120, display:"flex", justifyContent:"space-between", gap:"1rem" }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Duration</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="duration"
                                value={membershipData.duration}
                                label="Duration"
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>One Time</MenuItem>
                                <MenuItem value={30}>Monthly</MenuItem>
                                <MenuItem value={90}>Quarterly</MenuItem>
                                <MenuItem value={180}>Half Yearly</MenuItem>
                                <MenuItem value={365}>Yearly</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Image input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input type="file" name='file' className="hidden" onChange={handleImageChange} accept="image/*" id="imageUpload"/>
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
                        <button onClick={handleSubmitMembership} className="w-full px-3 py-2 border bg-orange-400 text-white rounded-md">
                            {loader ? (
                            <>
                                <span className="spinner"></span>
                            </>
                            ) : (
                                'Add Membership'
                            )
                            }
                        </button>
                    </div>
            </div>
            
        </div>
    );
}