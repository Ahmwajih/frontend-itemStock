import axios from "axios";
import { fetchFail, fetchStart, getStockSuccess } from "../features/stockSlice";
import { useDispatch, useSelector } from "react-redux";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useStockCall = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const getStockData = async (url) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/stock/${url}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(getStockSuccess({ data, url }));
      console.log(`Data fetched from ${url}:`, data);
    } catch (error) {
      dispatch(fetchFail());
      console.error(`Error fetching data from ${url}:`, error.response || error.message);
      toastErrorNotify(`Failed to fetch ${url} data`);
    }
  };

  const deleteStockData = async (url, id) => {
    dispatch(fetchStart());
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/stock/${url}/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toastSuccessNotify(`${url.slice(0, -1)} successfully deleted`);
      getStockData(url); // Refresh the data after deletion
    } catch (error) {
      dispatch(fetchFail());
      console.error(`Error deleting ${url.slice(0, -1)}:`, error.response || error.message);
      toastErrorNotify(`Failed to delete ${url.slice(0, -1)}`);
    }
  };

  return { getStockData, deleteStockData };
};

export default useStockCall;
