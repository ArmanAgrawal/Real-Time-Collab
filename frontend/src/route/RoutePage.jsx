        import { Route, Routes } from "react-router-dom";
        import Register from "../components/auth/register/Register";
        import ProtectedRoute from "./ProtectedRoute";
        import CreateWorkspace from "../components/workspace/Createworkspace";
        import Joinworkspace from "../components/workspace/Joinworkspace";
        import WorkSpacePage from "../pages/workspacePage/WorkspacePage";
        import CreateDocument from "../components/document/CreateDocument";
        import PresentationEditor from "../pages/presentationEditor/PresentationEditor";
        import Home from "../pages/home/Home";
        import Login from "../components/auth/login/Login";

        export default function RoutePage(){
            return(
                <div>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Home/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/workspace/create" element={
                            <ProtectedRoute>
                                <CreateWorkspace/>
                            </ProtectedRoute>
                        }/><Route path="/workspace/join" element={
                            <ProtectedRoute>
                                <Joinworkspace/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/workspace/:id/" element={
                            <ProtectedRoute>
                                <WorkSpacePage/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/workspace/:id/create" element={
                            <ProtectedRoute>
                                <CreateDocument/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/workspace/:id/presentations/:pId" element={
                            <ProtectedRoute>
                                <PresentationEditor/>
                            </ProtectedRoute>
                        }/>
                    </Routes>
                </div>
            )
        }