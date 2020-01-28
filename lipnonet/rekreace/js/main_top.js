  
  // [1] set specific <title> text
  const fileToTitle = {
    fotogaleriehtml : ['Foto galerie', 'css/photogallery.css'],
    aktualityphp : ['Meteostanice, počasí', 'css/aktuality.css'],
    formularphp : ['Formulář, objednávka', 'css/formular.css'],
    knihaphp : ['Diskusní fórum', 'css/kniha_vanila.css'],
    indexphp : ['Úvodní strana', 'css/photogallery.css', 'css/aktuality.css'],
    rekreacephp : ['Dovolená'],
    frymburkphp : ['Obec, Městys'],
    emailphp : ['Email'],
    kontaktphp : ['Cesta k nám'],
    garsonkaphp : ['Garsonka, apartmán, pokoj, ceník'],
    lipnophp : ['Jezero, voda, přehrada'],
    vybaveniphp : ['Vybavení'],
    profisolarphp : ['Solární, ohřev, panel, voda, profislolar'],
    cenyphp : ['Ceny'],
    webcam_ip_archivephp : ['Výhled na vodu'],
    bedrichphp : ['Administrace']
  }
  // actual title DOM
  const headTitle = document.getElementsByTagName('TITLE')[0];
  // actual page path
  const pagePathName = window.location.pathname;
  // get file name array 
  const pageFileNameArray = pagePathName.split('/');
  // get last block = file => with reverse() => more resources with big array
  // const pageFileName = pageFileNameArray.reverse()[0]
  const pageFileName = pageFileNameArray[ pageFileNameArray.length - 1 ];
  const pageFileNameModified = pageFileName.replace('.','');
  // get title text from page name
  const [ title , ] = fileToTitle[pageFileNameModified];
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
      console.log(cssHref);
  }

  // destructuring object, skip first parameter, all ...rest param used
  const [ , ...css ] = fileToTitle[pageFileNameModified];
  console.log(css);
  // append link element to it only if is needed
  css.forEach( cssHref => appendStyle(cssHref));
