import { useMutation, useQuery } from "react-query";
import { apiDelete, apiGet } from "../../utils/AxiosInstance";



const useInvoice = (query = {}) => {

    const list = useQuery(["invoice_list", query], async () => {
        const resData = await apiGet(`admin/order/invoice?${query}`);
        return resData ? resData : {};
    });

    const trash = useMutation(["useWalletBatchDelete"], async (props) => {
      const resData = await apiDelete(`admin/order/invoice/delete`, props);
      return resData ? resData : {};
    });

    return {
        list,
        trash,
    }
}

export default useInvoice