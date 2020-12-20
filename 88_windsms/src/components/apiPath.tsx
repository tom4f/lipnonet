export const apiPath = () => {
    if ( window.location.hostname === 'localhost' ) {
        // local development react
        //console.log(window.location.hostname);
        return 'http://localhost/lipnonet/rekreace/api/';  
      } else {
            //console.log(window.location.hostname);
            return '../api/';
            // return 'https://frymburk.com/rekreace/api/'
        }
}