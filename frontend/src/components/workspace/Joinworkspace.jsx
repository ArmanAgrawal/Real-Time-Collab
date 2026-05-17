import { useState } from "react";
import { useDispatch } from "react-redux";
import { joinWorkspaces } from "../../redux/slices/WorkspaceSlice.js";


const Joinworkspace=()=>{
    const [join_code,setJoin_code]=useState("");
    const dispatch=useDispatch();
    const handleJoin=()=>{
        dispatch(joinWorkspaces({join_code}));
    }
    return(
        <div>
            <input type="text" placeholder="Enter code to join workspace" 
                value={join_code} onChange={e=>setJoin_code(e.target.value)}/>
            <button onClick={handleJoin}>Join</button>
            <button>cancel</button>
        </div>
    )
}

export default Joinworkspace;