import { Route, Switch } from "react-router-dom";
import Default404 from "./pages/404/Default404";
import Landing from "./pages/landing/Landing";
import PriceSetting from "./pages/settings/price/PriceSetting";
import CustomerOrders from "./pages/content/order/CustomerOrders";
import CustomerWallet from "./pages/content/wallet/CustomerWallet";

const Routing = () => {


    return (
        <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/admin/order" exact component={CustomerOrders} />
            <Route path="/admin/order/wallet" exact component={CustomerWallet} />
            <Route path="/admin/setting/price" exact component={PriceSetting} />
            <Route path="*" exact component={Default404} />
        </Switch>
    );
};

export default Routing;
