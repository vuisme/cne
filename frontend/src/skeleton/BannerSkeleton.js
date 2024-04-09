import React from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {useMediaQuery} from "react-responsive";


function BannerSkeleton() {


  const isMobile = useMediaQuery({query: '(max-width: 991px)'});

  return <Skeleton variant="rect" height={isMobile ? 193 : 375} />;
}

export default BannerSkeleton;
