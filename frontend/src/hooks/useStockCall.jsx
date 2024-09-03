import {
  fetchFail,
  fetchStart,
  getStockSuccess,
  getProdCatBrandsSuccess,
} from "../features/stockSlice";
import { useDispatch } from "react-redux";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import useAxios from "./useAxios";

const useStockCall = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();

  const getStockData = async (url) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get(`/stock/${url}/`);
      dispatch(getStockSuccess({ data, url }));
      toastSuccessNotify(`${url} data successfully fetched`);
    } catch (error) {
      dispatch(fetchFail());
      console.error(`Error fetching ${url} data:`, error);
      toastErrorNotify(`${url} data cannot be fetched`);
    }
  };

  const deleteStockData = async (url, id) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`/stock/${url}/${id}/`);
      toastSuccessNotify(`${url.slice(0, -1)} successfully deleted`);
      getStockData(url); // Refresh data after deletion
    } catch (error) {
      dispatch(fetchFail());
      console.error(`Error deleting ${url.slice(0, -1)}:`, error);
      toastErrorNotify(`${url.slice(0, -1)} cannot be deleted`);
    }
  };

  const postStockData = async (url, info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`/stock/${url}/`, info);
      toastSuccessNotify(`${url.slice(0, -1)} successfully posted`);
      getStockData(url); // Refresh data after posting
    } catch (error) {
      dispatch(fetchFail());
      console.error(`Error posting ${url.slice(0, -1)}:`, error);
      toastErrorNotify(`${url.slice(0, -1)} cannot be posted`);
    }
  };

  const putStockData = async (url, info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.put(`/stock/${url}/${info.id}/`, info);
      toastSuccessNotify(`${url.slice(0, -1)} successfully updated`);
      getStockData(url); // Refresh data after updating
    } catch (error) {
      dispatch(fetchFail());
      console.error(`Error updating ${url.slice(0, -1)}:`, error);
      toastErrorNotify(`${url.slice(0, -1)} cannot be updated`);
    }
  };

  // Fetch products, categories, and brands simultaneously
  const getProdCatBrands = async () => {
    dispatch(fetchStart());
    try {
      const [products, categories, brands] = await Promise.all([
        axiosWithToken.get("stock/products/"),
        axiosWithToken.get("stock/categories/"),
        axiosWithToken.get("stock/brands/"),
        axiosWithToken.get("stock/firms/"),
        axiosWithToken.get("stock/sales/"),
        axiosWithToken.get("stock/purchases/"),
        axiosWithToken.get("stock/"),
      ]);

      dispatch(
        getProdCatBrandsSuccess({
          products: products?.data,
          categories: categories?.data,
          brands: brands?.data,
        })
      );
      toastSuccessNotify("Products, categories, and brands successfully fetched");
    } catch (error) {
      console.error("Error fetching product, category, and brand data:", error);
      dispatch(fetchFail());
      toastErrorNotify("Products, categories, and brands cannot be fetched");
    }
  };

  return {
    getStockData,
    deleteStockData,
    postStockData,
    putStockData,
    getProdCatBrands,
  };
};

export default useStockCall;
