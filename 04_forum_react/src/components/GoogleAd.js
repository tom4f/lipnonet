import React from 'react';

export default class GoogleAd extends React.Component {
  componentDidMount () {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

render () {
    return (
      <div>
        <ins className='adsbygoogle'
          style={{ display: 'inline-block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-6892058759603615"
          data-ad-slot="6550229081" />
      </div>
    );
  }
}