import React, {useEffect} from 'react'
import {Link, withRouter} from 'react-router-dom'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loadBestSellingProducts} from "../../../../../store/actions/InitAction";
import ProductSectionSkeleton from "../../../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "../recentProduct/includes/RecentItems";

const BestSellingProducts = (props) => {
  const {best_product_loading, best_selling} = props;

  useEffect(() => {
    props.loadBestSellingProducts();
  }, []);

  return (
      <div className="container deal-section">
        <h3 className="title mt-5">Chinaexpress Best Selling</h3>

        {best_product_loading && <ProductSectionSkeleton/>}
        {!best_product_loading && best_selling.length > 0 && <RecentItems products={best_selling}/>}

      </div>
  )
}


BestSellingProducts.propTypes = {
  best_selling: PropTypes.array.isRequired,
  best_product_loading: PropTypes.bool.isRequired,
  loadBestSellingProducts: PropTypes.func,
};

const mapStateToProps = (state) => ({
  best_selling: JSON.parse(state.INIT.best_selling),
  best_product_loading: state.LOADING.best_product_loading,
});

export default connect(mapStateToProps, {loadBestSellingProducts})(
    withRouter(BestSellingProducts)
);


