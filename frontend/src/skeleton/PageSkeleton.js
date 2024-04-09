import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PageSkeleton = () => {
    return (
        <main className="main">
            <div className="page-content">
                <div className="container">
                    <Skeleton variant="rect" height={40} width={100} />
                    <div className="product-details-top">
                        <div className="row">
                            <div className="col-md-12">
                                <p>
                                    <Skeleton variant="rect" height={30} />
                                </p>
                                <p>
                                    <Skeleton count={6} />
                                </p>
                                <p>
                                    <Skeleton count={8} />
                                </p>
                            </div>
                        </div>
                        {/* End .row */}
                    </div>
                </div>
                {/* End .container */}
            </div>
        </main>
    );
};

export default PageSkeleton;
