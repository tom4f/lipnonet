import React from 'react';

const WebCamSlideShow = ( {reactChange, day, slideId, timer} ) => {

    const startWebCamSlideShow = () =>{
        let photoText = [];
       
        // create array of all webCamm file names
        const tillDay = Number(day) <= new Date().getDate() ? new Date().getDate() : 31;
        for (let d = Number(day); d <= tillDay ; d++){
            for (let h = 7; h <= 22; h++ ){
                for (let m = 12; m <= 57; m+=15){
                    photoText.push(`${('0' + d).slice(-2)}-${('0' + h).slice(-2)}-${('0' + m).slice(-2)}`);
                }
            }
        }

        const Presentation = () => {
            async function tomAsync() {

                const kameraImgUrl = document.getElementById('kameraImg').src;
                console.log(kameraImgUrl);
            
                const fetchApi = await fetch(kameraImgUrl);
                let blob = await fetchApi.blob();
                
                console.log(blob.size);
            }
            
            //tomAsync();

            reactChange({
                slideId         : slideId,
                day             : photoText[slideId].slice(0,2),
                hour            : photoText[slideId].slice(3,5),
                minute          : photoText[slideId].slice(6,8)
            });
            if (slideId < photoText.length -1) {
                console.log('Timer: ' + timer + ', IF, slideID: ' + slideId + ', photoText.length : ' + (photoText.length -1));
                slideId++;
            } else {
                console.log('Timer: ' + timer + ', ELSE, slideID: ' + slideId + ', photoText.length : ' + (photoText.length -1));
                stopWebCamSlideShow();
            }
        };
        timer = setInterval(Presentation, 2000);
        reactChange({
            timer: timer
        })
        console.log('setInterval Timer: ' + timer + ' ELSE, slideID: ' + slideId);

        document.getElementById('startWebCamSlideShow').style.display = "none";
        document.getElementById('stopWebCamSlideShow' ).style.display = "inline";
    };

    const stopWebCamSlideShow = () =>{
        console.log('STOP Timer: ' + timer + ', slideID: ' + slideId);
        clearInterval(timer);
        document.getElementById('startWebCamSlideShow').style.display = "inline";
        document.getElementById('stopWebCamSlideShow' ).style.display = "none";
    };

    return (
        <span>
            <button id='startWebCamSlideShow' name='startWebCamSlideShow' onClick={ () => startWebCamSlideShow() } >Spustit Slide Show </button>
            <button id='stopWebCamSlideShow'  name='stopWebCamSlideShow'  onClick={ () => stopWebCamSlideShow() } style={{ display : "none" }}>Zastavit Slide Show</button>
        </span>
    )
}

export default WebCamSlideShow;