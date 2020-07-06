export const apiPath = () => {
    if ( window.location.hostname === 'localhost' ) {
        // local development react
        console.log(window.location.hostname);
        return 'http://localhost/lipnonet/kamera/archive/';  
      } else {
            console.log(window.location.hostname);
            return './../kamera/archive/';
            //return 'https://frymburk.com/kamera/archive/'
        }
}