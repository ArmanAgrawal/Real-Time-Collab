import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import WorkspaceTitleBar from "../../components/workspace/WorkspaceTitleBar.jsx";
import MembersPanel from "../../components/workspace/MembersPanel.jsx";

import { getSingleWorkspace } from "../../redux/slices/WorkspaceSlice.js";
import './workspacePage.css'
import Document from "../../components/document/DocumentList.jsx";


const WorkSpacePage=()=>{
    const {id}=useParams();
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const {singleWorkspace,loading}=useSelector(
        (state)=>state.workspace
    )
    const [showMembers, setShowMembers]=useState(false);

    useEffect(()=>{
        dispatch(getSingleWorkspace(id));
    }, 
    [id, dispatch]);

    if (loading || !singleWorkspace) return <p>Loading workspace...</p>;

    const handleCreate=()=>{
        
        navigate(`/workspace/${id}/create`);
    }

    return(
        <div className="workspace-page">
            <WorkspaceTitleBar
                workspace={singleWorkspace}
                onMembersClick={()=>setShowMembers(!showMembers)}
            />

            {
                showMembers && (
                    <MembersPanel members={singleWorkspace.members || []}/>
                    
                )
            }

            <button className="create-doc-btn" onClick={handleCreate}>
                + Create Document
            </button>

            <Document presentations={singleWorkspace.presentations}/>

        </div>
    )
}
export default WorkSpacePage;