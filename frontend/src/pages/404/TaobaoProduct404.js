import React from 'react';
import {Link} from "react-router-dom";
import Breadcrumb from "../breadcrumb/Breadcrumb";

const TaobaoProduct404 = () => {

   return (
      <main className="main">
         <div className="container">
            <div className="card my-5">
               <div className="card-body">
                  <div className="error-content text-center">
                     <img src={`/assets/img/404.jpg`} className="img-fluid mx-auto" alt="404" style={{maxWidth:'15rem'}}/>
                     <h1 className="error-title">Product not found. </h1>
                     <p>We are sorry, the product you've requested is not available.</p>
                     <Link
                        to={'/'}
                        className="btn btn-default px-3"
                     >
                        <span>Shop More</span>
                        <i className="icon-right"/>
                     </Link>
                  </div>
               </div>
            </div>
         </div>

      </main>
   );
};

export default TaobaoProduct404;
