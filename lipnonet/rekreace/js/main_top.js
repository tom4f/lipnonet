  
  // [1] set specific <title> text
  const fileToTitle = {
    'index.php' : ['Úvodní strana', 'css/photogallery.css', 'css/aktuality.css'],
    'fotogalerie.html' : ['Foto galerie', 'css/photogallery.css'],
    'foto_insert.html' : ['Foto galerie', 'css/photogallery.css', 'css/foto_insert_style.css'],
    'fotogalerie_lucka.html' : ['Foto galerie', 'css/photogallery.css'],
    'fotogalerie_lucka_.html' : ['Foto galerie', 'css/photogallery.css', 'css/foto_insert_style.css'],
    'fotogalerie_pavlik.html' : ['Foto galerie', 'css/photogallery.css'],
    'fotogalerie_pavlik_.html' : ['Foto galerie', 'css/photogallery.css', 'css/foto_insert_style.css'],
    'aktuality.php' : ['Meteostanice, počasí', 'css/aktuality.css'],
    'aktuality.html' : ['Meteostanice, počasí'],
    'formular.php' : ['Formulář, objednávka', 'css/formular.css'],
    'bedrich_new.php' : ['Formulář, objednávka', 'css/formular.css', 'css/formular_edit.css'],
    'kniha.php' : ['Diskusní fórum', 'css/kniha_vanila.css'],
    'rekreace.php' : ['Dovolená'],
    'frymburk.php' : ['Obec, Městys'],
    'kontakt.php' : ['Cesta k nám','css/kontakt.css'],
    'garsonka.php' : ['Garsonka, apartmán, pokoj, ceník'],
    'lipno.php' : ['Jezero, voda, přehrada'],
    'vybaveni.php' : ['Vybavení'],
    'profisolar.php' : ['Solární, ohřev, panel, voda, profislolar'],
    'ceny.php' : ['Ceny','css/ceny.css'],
    'webcam_ip_archive.php' : ['Výhled na vodu'],
    'bedrich.php' : ['Administrace'],
    'kaliste.php' : ['Kopec Kaliště 993m n.m', 'css/photogallery.css', 'css/kaliste.css' ]
  }
  // actual title DOM
  const headTitle = document.getElementsByTagName('TITLE')[0];
  // actual page path
  const pagePathName = window.location.pathname;

  // get file name array 
  const pageFileNameArray = pagePathName.split('/');

  // get last block = file => with reverse() => more resources with big array
  // const pageFileName = pageFileNameArray.reverse()[0]
  let pageFileName = pageFileNameArray[ pageFileNameArray.length - 1 ];

  // default value if page name did not find
  // if pageName is not 'lipnonet/rekreace/'
  if(pageFileName === '') pageFileName = 'index.php';
  console.log('pageFileName: ' + pageFileName);
  // get title text and css from page name
  const [ title , ...css ] = fileToTitle[pageFileName];
  // add new <title> text to actual text
  headTitle.text = `${headTitle.text} - ${title}`;

  // [2] add .css dynamically
  const appendStyle = (cssHref) =>{
      // Create new link Element 
      const link = document.createElement('LINK');  
        // set the attributes for link element 
      link.rel = 'stylesheet';  
      link.type = 'text/css'; 
      link.href = cssHref;  
      // or
      // link.setAttribute("rel", "stylesheet");
      // link.setAttribute("type", "text/css");
      // link.setAttribute("href", "styles.css");
      document.getElementsByTagName('HEAD')[0].appendChild(link); 
  }

  // append link element to it only if is needed
  css.forEach( cssHref => appendStyle(cssHref));
