import { useEffect, useState } from "react";
import TextEditor from "../../tiptap/TipTap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";


export default function CreatePlan  ({onValueReturn, onSetNotice}){

    const [loader, setLoader] = useState(false);
    const [planData, setPlanData] = useState({
        name: "",
        amount: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlanData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoader(true);
        try{
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/plan/add`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(planData)
            })
            const data = await response.json();
            if (response.ok) {
                onValueReturn(false);
                onSetNotice({
                    type: 'success',
                    message: data.message
                });
            } else {
                onSetNotice({
                    type: 'error',
                    message: data.message
                })
            }
        } catch (error) {
                onSetNotice({
                    type: "error",
                    message: error.message
                })
        } finally {
            setLoader(false);
        }
    }
    return(
        <div className="w-full p-6 space-y-6">
            <h1 className="text-2xl font-bold">Create Plan</h1>
                <div className="w-full grid grid-cols-1 gap-6">

                    {/* name input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                        <input type="text" name='name' className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={handleChange} required />
                    </div>
                    {/* amount input */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Amount <span className="text-red-500">*</span></label>
                        <input type="number" name='amount' className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={handleChange} required />
                    </div>
                    {/* save button */}
                    <div className="w-full">
                        <button className="w-full px-3 py-2 border bg-orange-400 text-white rounded-md" onClick={handleSubmit}>
                            {loader ? (
                            <>
                                <span className="spinner"></span>
                            </>
                        ) : (
                            'Add Plan'
                        )
                        }
                        </button>
                    </div>
                    
                </div>
            
        </div>
    );
}