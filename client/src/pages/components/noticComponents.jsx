import { useState, useEffect } from "react";
import { CheckCircle, XIcon, XCircle, AlertTriangle, InfoIcon } from "lucide-react";

function NoticeComponents(props) {
    const {type, message, action} = props.notice;
    const setNotice = props.setNotice;
    const [bgcolor, setBgColor] = useState("");
    const [tcolor, setTColor] = useState("");
    const [show, setShow]= useState(type ? true : false);
    useEffect(()=>{
        switch(type){
            case "success":
                setBgColor("bg-green-200");
                setTColor("#56976e");
                setShow(true);
                break;
            case "error":
                setBgColor("bg-red-200");
                setTColor("#ef4444");
                setShow(true);
                break;
            case "warning":
                setBgColor("bg-orange-200");
                setTColor("#c39a38ff");
                setShow(true);
                break;
            case "info":
                setBgColor("bg-blue-200");
                setTColor("#3b82f6");
                setShow(true);
                break;
            default:
                setShow(false);
        }
    },[type])  
    const closeNotice = () => {
        setShow(false);

    }
        return (
            show && (
            <div className="w-full mx-auto py-4 space-y-8">
                {/* <!-- Success Alert --> */}
                    <div style={{ boxShadow:`0 0 0 1px ${tcolor}, -8px -8px 16px #ffffff, 8px 8px 16px #b8b9be`}} className={`relative flex gap-2 items-center ${bgcolor} justify-left px-4 py-5 rounded-2xl`}>
                        <div className={`flex items-center justify-center font-bold`}>
                            {type === 'success' ? <CheckCircle size={28} color={tcolor} strokeWidth={3} /> : type === 'error' ? <XCircle size={28} color={tcolor} strokeWidth={3} /> : type === 'warning' ? <AlertTriangle size={28} color={tcolor} strokeWidth={3} /> : type === 'info' ? <InfoIcon size={28} color={tcolor} strokeWidth={3} /> : null} 
                        </div>
                        <div className=" flex flex-col items-left justify-center ">
                            <span style={{color: tcolor}} className={`font-semibold text-left text-[14px]`}>
                                <span className="uppercase">{type}</span>: {message}
                            </span>
                            {action ? action : ''}
                        </div>
                        <XIcon style={{ boxShadow:`0 0 0 1px ${tcolor}, -8px -8px 16px #ffffff, 8px 8px 16px #b8b9be`}} size={28} color={tcolor} strokeWidth={3} onClick={() => { closeNotice(); setNotice({type:"", nIcon:"", message:""}); }} className="absolute top-[-10px] right-[-10px] p-1 bg-white-100 hover:bg-white/70 rounded-full cursor-pointer text-lg"/>
                    </div>
            </div>
            )
    );
}

export default NoticeComponents;