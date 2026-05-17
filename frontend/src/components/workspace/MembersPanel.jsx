

const MembersPanel=({members=[]})=>{
    return(
        <div className="members-panel">
            <h3>Members</h3>
            {members.length===0 &&<p>No members</p>}

            {
                members && members.map((m)=>(
                    <div key={m.id} className="member-item">
                        <div className="avatar">
                            {m.user.email?.charAt(0).toUpperCase()}
                        </div>
                        
                        <div>
                            <p>{m.user.email}</p>
                            {/* <small>{m.role || "member"}</small> */}
                            </div>

                    </div>
                ))
            }
        </div>
    )
}
export default MembersPanel;