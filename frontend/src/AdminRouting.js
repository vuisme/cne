import React from "react";
import AdminRoute from "./routers/AdminRoute";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import RecentOrder from "./admin/pages/order/recent/RecentOrder";
import WalletIndex from "./admin/pages/order/wallet/WalletIndex";
import ManageInvoice from "./admin/pages/order/invoice/ManageInvoice";
import ManageTracking from "./admin/pages/order/tracking/ManageTracking";
import ManageProducts from "./admin/pages/products/ManageProducts";
import CouponLogs from "./admin/pages/coupon/logs/CouponLogs";
import CouponList from "./admin/pages/coupon/list/CouponList";
import CustomerIndex from "./admin/pages/customer/CustomerIndex";
import TaxonomyIndex from "./admin/pages/taxonomy/TaxonomyIndex";
import MenuIndex from "./admin/pages/menu/MenuIndex";
import ContactIndex from "./admin/pages/contact/ContactIndex";
import PageIndex from "./admin/pages/pages/PageIndex";
import FaqIndex from "./admin/pages/faqs/FaqIndex";
import TopNoticeIndex from "./admin/pages/front-setting/top-notice/TopNoticeIndex";

const AdminRouting = () => {
    return (
        <>
            <AdminRoute path="/manage/dashboard" exact component={AdminDashboard}/>

            <AdminRoute path="/manage/order/recent" exact component={RecentOrder}/>
            <AdminRoute path="/manage/order/wallet" exact component={WalletIndex}/>
            <AdminRoute path="/manage/order/invoice" exact component={ManageInvoice}/>
            <AdminRoute
                path="/manage/order/tracking"
                exact
                component={ManageTracking}
            />
            <AdminRoute path="/manage/product/list" exact component={ManageProducts}/>
            <AdminRoute path="/manage/coupon/logs" exact component={CouponLogs}/>
            <AdminRoute path="/manage/coupon/list" exact component={CouponList}/>
            <AdminRoute path="/manage/customer" exact component={CustomerIndex}/>
            <AdminRoute path="/manage/menu" exact component={MenuIndex}/>
            <AdminRoute path="/manage/taxonomy" exact component={TaxonomyIndex}/>
            <AdminRoute path="/manage/contact" exact component={ContactIndex}/>
            <AdminRoute path="/manage/pages" exact component={PageIndex}/>
            <AdminRoute path="/manage/faqs" exact component={FaqIndex}/>
            <AdminRoute
                path="/manage/front-setting/top-notice"
                exact
                component={TopNoticeIndex}
            />
            <AdminRoute
                path="/manage/front-setting/announcement"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/front-setting/banner"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/front-setting/promo-banner"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/front-setting/sections"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/front-setting/image-loading"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/general"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/price"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/order-limit"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/popup"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/block-words"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/messages"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/cache-control"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/bkash-api-response"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/setting/general"
                exact
                component={AdminDashboard}
            />
            <AdminRoute path="/manage/user" exact component={AdminDashboard}/>
            <AdminRoute path="/manage/role" exact component={AdminDashboard}/>
            <AdminRoute path="/manage/bkash/refund" exact component={AdminDashboard}/>
            <AdminRoute
                path="/manage/log/dashboard"
                exact
                component={AdminDashboard}
            />
            <AdminRoute
                path="/manage/log/error-list"
                exact
                component={AdminDashboard}
            />
        </>
    );
};

export default AdminRouting;
