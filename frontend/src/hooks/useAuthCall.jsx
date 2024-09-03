import axios from "axios";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchFail,
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} from "../features/authSlice";

const useAuthCall = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (userData) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/account/auth/login/`,
        userData
      );
      dispatch(loginSuccess(data));
      toastSuccessNotify("Login Successful");
      navigate("/stock"); // Ensure this is the correct path for the main page
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify(error.response?.data?.message || "Login error");
    }
  };

  const logout = async () => {
    dispatch(fetchStart());
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/account/auth/logout/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored
          },
        }
      );
      dispatch(logoutSuccess());
      toastSuccessNotify("Logout Successful");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify(error.response?.data?.message || "Logout error!");
    }
  };

  const register = async (userData) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/account/users/`,
        userData
      );
      dispatch(registerSuccess(data));
      toastSuccessNotify("User registered successfully!");
      navigate("/stock");
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify(error.response?.data?.message || "Register Error");
    }
  };

  return { login, logout, register };
};

export default useAuthCall;
