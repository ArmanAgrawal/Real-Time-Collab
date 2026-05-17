  import { useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { getWorkspaces } from "../../redux/slices/WorkspaceSlice.js";
  import "../../pages/home/home.css";
  import { useNavigate } from "react-router-dom";

  const WorkspaceList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.workspace);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getWorkspaces());
  }, [dispatch]);

  return (
    <div className="home-container">
      <h2 className="home-title">My Workspaces</h2>

      {loading && <p className="loading-text">Loading...</p>}

      <div className="workspace-grid">
        {list?.map((ws, index) => (
          <div
            key={ws.id || ws._id || index}
            className="workspace-card"
            onClick={() => navigate(`/workspace/${ws.id || ws._id}/`)}
          >
            <div
              className="workspace-color"
              style={{ background: ws.color }}
            />

            <div className="workspace-name">{ws.name}</div>
            <div className="workspace-desc">{ws.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
  export default WorkspaceList;
