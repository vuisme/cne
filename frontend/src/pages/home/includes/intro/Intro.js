import React from "react";
import BrowseCategories from "./includes/BrowseCategories";
import { loadAsset } from "../../../../utils/Helpers";
import BannerSkeleton from "../../../../skeleton/BannerSkeleton";
import { useBanner } from "../../../../api/GeneralApi";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageLoader from "../../../../loader/ImageLoader";

const Intro = ({ settings }) => {
  const { data: banners, isLoading } = useBanner();

  const right_banner_image = settings?.right_banner_image || "img/right-banner-2.png";
  const right_banner_image_link = settings?.right_banner_image_link || null;

  return (
    <div className="intro-section">
      <div className="container mt-0 mt-md-2">
        <div className="row">
          <div className="col-lg-9">
            <div className="row">
              <div className="col-lg-3 cols d-none d-lg-block">
                <BrowseCategories />
              </div>
              <div className="col-lg-9 cols col-md-12 col-12 mb-md-0 mb-2 p-lg-0">
                <div className="intro-slider-container">
                  <Swiper
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                    }}
                    zoom={true}
                    navigation={true}
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Zoom, Navigation, Pagination]}
                    className="mySwiper"
                  >
                    {banners?.length > 0 && !isLoading ? (
                      banners.map((banner, index) => (
                        <SwiperSlide key={index}>
                          <div className="swiper-zoom-container">
                            {banner.post_slug ? (
                              <a
                                href={banner.post_slug}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ImageLoader
                                  path={loadAsset(banner.post_thumb)}
                                  width={'100%'}
                                />
                              </a>
                            ) : (
                              <ImageLoader
                                path={loadAsset(banner.post_thumb)}
                                width={'100%'}
                              />
                            )}
                          </div>
                        </SwiperSlide>
                      ))
                    ) : (
                      <BannerSkeleton />
                    )}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 d-none d-lg-block">
            <a href={right_banner_image_link ? right_banner_image_link : "#"}>
              <ImageLoader
                path={loadAsset(right_banner_image)}
                width={'100%'}
                height={'100%'}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
