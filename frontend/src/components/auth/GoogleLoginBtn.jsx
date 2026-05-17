import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const GoogleLoginBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (res) => {
    const token = res.credential;

    const result = await dispatch(googleLogin(token));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
};

export default GoogleLoginBtn;
