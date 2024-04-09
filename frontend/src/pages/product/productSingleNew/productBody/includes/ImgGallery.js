import React from "react";
import PropTypes from "prop-types";

import TinySlider from "tiny-slider-react";
import 'tiny-slider/dist/tiny-slider.css';
import ImageLoader from "../../../../../loader/ImageLoader";

const ImgGallery = (props) => {
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
    transition: "ease-in-out 200ms"
  };

  const activeImageUrl = (picture) => {
    const Large = picture?.Large?.Url || null;
    const Medium = picture?.Medium?.Url || null;
    const Small = picture?.Small?.Url || null;
    let active = Large ? Large : Medium;
    return active ? active : Small;
  };

  const productImage = (event, picture) => {
    event.preventDefault();
    let active = activeImageUrl(picture);
    if (active) {
      setActiveImg(active);
    }
  };

  const playVideo = (event, Url) => {
    event.preventDefault();
    if (Url) {
      setActiveImg(Url);
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
                onClick={(event) => playVideo(event, Url)}
              >
                <ImageLoader
                  path={PreviewUrl}
                  width={'100%'}
                  height={80}
                />

                <div className="videoPlayerIcon">
                  <i className="icon-play-circled" />
                </div>
              </a>
              :
              <a
                className={`rounded position-relative ${activeImg === picture.Large.Url && "active"}`}
                href={activeImageUrl(picture)}
                onClick={(event) => productImage(event, picture)}
              >
                <ImageLoader
                  path={activeImageUrl(picture)}
                  width={'100%'}
                  height={85}
                />
              </a>
          }
        </div>
      ))}

    </TinySlider>
  )


};

ImgGallery.propTypes = {
  Pictures: PropTypes.array.isRequired,
};

export default ImgGallery;