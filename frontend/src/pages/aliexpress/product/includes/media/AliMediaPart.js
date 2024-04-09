import React, { useEffect } from "react";
import AliImgGallery from "./AliImgGallery";
import InnerImageZoom from 'react-inner-image-zoom';
import ReactPlayer from "react-player";
import PlayCircleIcon from "../../../../../icons/PlayCircleIcon";
import { useMediaQuery } from "react-responsive";


const AliMediaPart = (props) => {
	const { product, imagePathList, activeImg, setActiveImg } = props;

	const { thumbnail, url: videoUrl } = product?.item?.video || {};

	const isMobile = useMediaQuery({ query: '(max-width: 991px)' });

	return (
		<div className="product-gallery product-gallery-vertical">
			<figure className="product-main-image" style={{ width: '100%', height: isMobile ? '370px' : '360px' }}>
				{
					(activeImg === thumbnail) && videoUrl ? (
						<div className='player-wrapper'>
							<ReactPlayer
								className='react-player '
								url={videoUrl}
								playing={true}
								muted={true}
								controls={true}
								light={thumbnail}
								loop={true}
								pip={false}
								playIcon={<PlayCircleIcon />}
								width='100%'
								height="100%"
							/>
						</div>
					) : (
						activeImg &&
						<InnerImageZoom
							src={activeImg}
							zoomSrc={activeImg}
							zoomType="click"
						/>
					)
				}
			</figure>
			<AliImgGallery
				PreviewUrl={thumbnail}
				Url={videoUrl}
				setActiveImg={setActiveImg}
				activeImg={activeImg}
				Pictures={imagePathList}
			/>
		</div>
	);
};


export default AliMediaPart;
