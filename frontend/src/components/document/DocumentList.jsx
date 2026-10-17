import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";

const Document = ({ presentations }) => {

  const { id } = useParams();

  const navigate = useNavigate();

  async function handleExport(presentationId) {

    try {

      const res = await axiosInstance.get(
        `/api/workspaces/${id}/presentations/${presentationId}/export/`,
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

  const openDocument = (document) => {

    if (document.document_type === "ppt") {

      navigate(
        `/workspace/${id}/presentations/${document.presentation_id}`
      );

    } else if (document.document_type === "code") {

      navigate(
        `/workspace/${id}/code/${document.code_document_id}`
      );
    }
  };

  return (
    <div className="home-container">

      <h2 className="home-title">
        My Documents
      </h2>

      <div className="workspace-grid">

        {Array.isArray(presentations) &&
          presentations.map((p) => (
            console.log(p),
            <div
              key={p.id}
              className="workspace-card"
              onClick={() => openDocument(p)}
            >

              {p.document_type === "ppt" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport(p.presentation_id);
                  }}
                >
                  Export
                </button>
              )}

              <div className="workspace-name">
                {p.title}
              </div>

              <div>
                {p.document_type}
              </div>

            </div>
          ))}
      </div>
    </div>
  );
};

export default Document;