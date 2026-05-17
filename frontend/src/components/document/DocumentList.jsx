
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";


const Document = ({ presentations }) => {
  const { id } = useParams();
  
  const navigate=useNavigate();
  async function handleExport(pId) {
    try {
      console.log("Exporting:", pId);

      const res = await axiosInstance.get(
        `/api/workspaces/${id}/presentations/${pId}/export/`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(res.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = "presentation.pptx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }
  const fullPresentation=(pId)=>{
    navigate(`/workspace/${id}/presentations/${pId}`)
  }
  return (
    <div className="home-container">
      <h2 className="home-title">My presentations</h2>

      <div className="workspace-grid">
        {Array.isArray(presentations) &&
          presentations.map((p) => (
            <div key={p.id} className="workspace-card" onClick={()=>fullPresentation(p.id)}>
              <button onClick={() => handleExport(p.id)}>
                Export
              </button>

              <div className="workspace-name">{p.title}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Document;