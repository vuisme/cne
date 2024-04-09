import React from 'react';
import {Link} from "react-router-dom";

const Default404 = () => {

    return (
        <main className="main">
            <div className="container">
                <div className="card my-5 py-5">
                    <div className="card-body">
                        <div className="error-content text-center">
                            <h1 className="error-title">Ops! 404 Error.</h1>
                            <p>We are sorry, the page you've requested is not available.</p>
                            <Link
                                to={'/'}
                                className="btn btn-default px-3"
                            >
                                <span>Back To Homepage</span>
                                <i className="icon-long-arrow-right"/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
};

export default Default404;
