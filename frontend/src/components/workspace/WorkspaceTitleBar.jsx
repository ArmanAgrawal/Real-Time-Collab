

const WorkspaceTitleBar=({workspace,onMembersClick})=>{
    if(!workspace) return null;
    return(
        <div className="workspace-header">

            <div className="workspace-info">
                <h2>{workspace.name}</h2>
                <p>{workspace.description}</p>
            </div>

            <div className="workspace-actions">
                    <button onClick={onMembersClick}>
                        Members ({workspace.members?.length || 0})
                    </button>
            </div>

            <div className="workspace-code">
                Code: <strong>{workspace.join_code}</strong>
            </div>

        </div>
    )
}
export default WorkspaceTitleBar;