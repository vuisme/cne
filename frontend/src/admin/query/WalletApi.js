import { useMutation, useQuery } from "react-query";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiUpdate,
} from "../../utils/AxiosInstance";

export const useWalletData = (query) =>
  useQuery(["wallet", query], async () => {
    const resData = await apiGet(`admin/order/wallet?${query}`);
    return resData ? resData : {};
  });

export const useWalletUpdateStatus = () =>
  useMutation("useWalletUpdateStatus", async (props) => {
    const resData = await apiPost(`admin/order/wallet`, props);
    return resData ? resData : {};
  });

export const useWalletMasterUpdate = (id) =>
  useMutation(["useWalletMasterUpdate", id], async (props) => {
    const resData = await apiUpdate(`admin/order/wallet/${id}`, props);
    return resData ? resData : {};
  });

export const useWalletBatchDelete = () =>
  useMutation(["useWalletBatchDelete"], async (props) => {
    const resData = await apiDelete(`admin/order/wallet/delete`, props);
    return resData ? resData : {};
  });

export const useWalletTrackingInfo = (id) =>
  useQuery(["tracking_info", id], async () => {
    const resData = await apiGet(`admin/order/wallet/tracking/${id}`);
    return resData ? resData.tracking : [];
  });

export const useWalletInvoiceGenerate = () =>
  useMutation(["useWalletInvoiceGenerate"], async (props) => {
    const resData = await apiPost(`admin/order/invoice/generate`, props);
    return resData ? resData : {};
  });
