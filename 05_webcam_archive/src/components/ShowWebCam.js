import React from 'react';


const ShowWebCam = ( {webCamImgSrc, webCamImgHref} ) => {
    return (
        <div className="archive_cam">
	        <a href={webCamImgHref}>
            <img id='kameraImg' name="obrazek" src={webCamImgSrc} alt="WebCam" />
          </a>
        </div>
    )
}

export default ShowWebCam;