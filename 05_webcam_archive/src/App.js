import React, { Component } from 'react';
import './main.css';
import './webcam_archive.css';
import Top                  from './components/Top';
import Bottom               from './components/Bottom';
import ShowWebCam           from './components/ShowWebCam';
import SelectTime           from './components/SelectTime';
import WebCamSlideShow      from './components/WebCamSlideShow';
import RangeSlider          from './components/RangeSlider';

export default class App extends Component {
    // MOUNTING : 1st live cycle method = constructor()
    constructor(props) {
        super(props);
        // initial states
        this.state = {
            day:      '01',
            hour:     '07',
            minute:   '12',
            slideId:  0,
            timer :   0,
            webAuthor :   'empty'
        };
    }

    // MOUNTING : 2nd live cycle method = read parents prop; use sparingly
    // UPDATING : 1st live cycle method - e.g. place to set state based  on props
    static getDerivedStateFromProps(props, state){
        return { webAuthor : 'Tomas ' + props.autor }
    }

    // UPDATING : 2nd live cycle method - false/true = React should continue with rendering or not
    shouldComponentUpdate(){
        return true;
    }  

    // Change page
    reactChange = (value) => {
        this.setState(value);
    }

    // MOUNTING : 3rd live cycle method = render() -> will be always called
    // UPDATING : 3rd live cycle method = render() -> will be always called
    render(){
        // descructing states, e.g. this.state.allEntrie -> allEntries
        const { day, hour, minute, slideId, timer } = this.state;
        return (
            <div className="top_container">
                <Top/>
                <div className="center_webcam">
                    <div class="header"><b>Kamera - měsíční historie</b></div>
                    <RangeSlider day={day} hour={hour} minute={minute} reactChange={this.reactChange} />
                    <div style={{ display: "inline-block" }}>
                        <SelectTime       day={day} hour={hour} minute={minute} reactChange={this.reactChange}/>
                        <WebCamSlideShow  day={day} hour={hour} minute={minute} reactChange={this.reactChange} slideId={slideId} timer={timer} />
                    </div>
                    {/*  webCamImgSrc={ `https://frymburk.com/kamera/archive/ip_kamera_${day}-${hour}-${minute}.jpg` }  */}
                    {/*  webCamImgSrc    ={ `../kamera/archive/ip_kamera_${day}-${hour}-${minute}.jpg` }  */}
                    <ShowWebCam
                        webCamImgSrc    ={ `../kamera/archive/ip_kamera_${day}-${hour}-${minute}.jpg` }
                        webCamImgHref   ={ `../kamera/archive/ip_kamera_full_hd_${day}-${hour}-${minute}.jpg` }
                    /> 
                    Build with React
                </div>
                <Bottom/>
            </div>
        ) // return end
    } // render end

    // UPDATING : 3rd live cycle method - access to props and state before update - componentDidUpdate() must be also present
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log('prevState.day: ' + prevState.day);
        return null
    }

    // UPDATING : 4th live cycle method - called after component is updated in DOM
    componentDidUpdate() {
      console.log('this.state.day: ' + this.state.day);
    }

    // MOUNTING : 4th live cycle method - called after component is rendered
    componentDidMount(){
        let myDay = ('0' + new Date().getDate());
        this.setState({
            day : myDay.slice(-2)
        });
    }

    // UNMOUNTING: only one live cycle method - called if component is removed from DOM - e.g. clearInterval(timer)
    // componentWillUnmount() {
    // }
}