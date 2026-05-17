import { useState } from "react";
import { useDispatch } from "react-redux";
import { createDocument } from "../../redux/slices/Document";
import { useParams } from "react-router-dom";

const CreateDocument=()=>{
    const [title,setTitle]=useState("");
    const dispatch=useDispatch();
    const { id } = useParams(); 

    const handleCreate = async () => {
        console.log("hii")
        const res = await dispatch(
          createDocument({
            workspaceId:id,
            title:title
          })
        );
        console.log(res)
    }
    return(
        <div>
            <h3>Create Document</h3>
            <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
            <button onClick={handleCreate}>Create</button>
        </div>
    )
}

export default CreateDocument;