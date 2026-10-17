import { useState } from "react";
import { useDispatch } from "react-redux";
import { createDocument } from "../../redux/slices/Document";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";   

const CreateDocument = () => {

    const [title, setTitle] = useState("");
    const [documentType, setDocumentType] = useState("ppt");

    const dispatch = useDispatch();
    const { id } = useParams();

const handleCreate = async () => {

    if (documentType === "ppt") {

        await dispatch(
            createDocument({
                workspaceId: id,
                title: title,
            })
        );

    } else {

        await axiosInstance.post(
            "/api/code-documents/",
            {
                workspace: id,
                title: title
            }
        );
    }
};

    return (
        <div>

            <h3>Create Document</h3>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
            >
                <option value="ppt">PPT</option>
                <option value="code">Code</option>
            </select>

            <button onClick={handleCreate}>
                Create
            </button>

        </div>
    );
};

export default CreateDocument;