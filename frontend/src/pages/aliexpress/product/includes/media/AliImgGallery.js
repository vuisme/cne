import React from "react";
import PropTypes from "prop-types";

import TinySlider from "tiny-slider-react";
import 'tiny-slider/dist/tiny-slider.css';
import ImageLoader from "../../../../../loader/ImageLoader";

const AliImgGallery = (props) => {
  const { Pictures, activeImg, PreviewUrl, Url, setActiveImg } = props;

  const settings = {
    items: 4,
    controls: true,
    controlsPosition: "bottom",
    nav: false,
    autoplay: false,
    autoplayButtonOutput: false,
    speed: 700,
    autoplayHoverPause: true,
    rewind: false,
    controlsText: ['<i class="icon-left-open"></i>', '<i class="icon-right-open"></i>'],
    mouseDrag: true
  };

  const imgStyles = {
    objectFit: "cover",
    opacity: 1,
    transition: "ease-in-out 200ms",
    height: "5rem",
    width: "5rem",
  };

  const activeImageUrl = (picture) => {
    return picture;
  };

  const productImage = (event, picture) => {
    event.preventDefault();
    let active = activeImageUrl(picture);
    if (active) {
      setActiveImg(active);
    }
  };

  const playVideo = (event, PreviewUrl) => {
    event.preventDefault();
    if (PreviewUrl) {
      setActiveImg(PreviewUrl);
    }
  };

  if (!Pictures?.length) {
    return '';
  }

  let modifiedPictures = Pictures;
  if (Url && PreviewUrl) {
    modifiedPictures = [{ type: 'video', Url, PreviewUrl }, ...Pictures];
  }

  return (
    <TinySlider settings={settings}>
      {modifiedPictures?.map((picture, key) => (
        <div key={key + 1} className="mr-2">
          {
            picture?.type === 'video' ?
              <a
                className={`rounded video_thumb position-relative ${activeImg === PreviewUrl && "active"}`}
                href={PreviewUrl}
                onClick={(event) => playVideo(event, PreviewUrl)}
              >
                <ImageLoader
                  className="rounded tns-lazy-img"
                  path={PreviewUrl}
                />
                <div className="videoPlayerIcon">
                  <i className="icon-play-circled" />
                </div>
              </a>
              :
              <a
                className={`rounded position-relative ${activeImg === picture && "active"}`}
                href={activeImageUrl(picture)}
                onClick={(event) => productImage(event, picture)}
              >
                <ImageLoader
                  className="rounded tns-lazy-img"
                  path={activeImageUrl(picture)}
                />
              </a>
          }
        </div>
      ))}

    </TinySlider>
  )


};

AliImgGallery.propTypes = {
  Pictures: PropTypes.array.isRequired,
};

export default AliImgGallery;
