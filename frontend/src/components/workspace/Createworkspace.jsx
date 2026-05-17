import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWorkspace } from "../../redux/slices/WorkspaceSlice.js";
import '../../css/createworkspace.css'
import { useNavigate } from "react-router-dom";

const colors = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

const CreateWorkspace = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.workspace);

    const onClose = ()=>{
        navigate("/");
    }
  const handleCreate = async () => {


    const res = await dispatch(
      createWorkspace({
        name,
        description: desc,
        color: selectedColor,
      })
      
    );


    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");

    }
  };

  

  return (
    <div className="modal-overlay">
      <div className="workspace-modal">
        
        {/* HEADER */}
        <div className="modal-header">
          <h2>Create New Workspace</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* NAME */}
        <label>Workspace Name</label>
        <input
          className="input"
          placeholder="Enter workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          className="textarea"
          placeholder="Describe what this workspace is for"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* COLOR */}
        <label>Color</label>
        <div className="color-row">
          {colors.map((c) => (
            <div
              key={c}
              className={`color-circle ${
                selectedColor === c ? "selected" : ""
              }`}
              style={{ background: c }}
              onClick={() => setSelectedColor(c)}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="create-btn" onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Workspace"}
      </button>
        </div>

      </div>
    </div>
  );
};

export default CreateWorkspace;
