"use strict";

let forum;

const UIshowForum = (forum) => {
    const knihaPlace = document.querySelector('.kniha-main-page');
    let knihaUL = '<ul>';
    forum.forEach(entry => {
        const { id , datum, text, jmeno, email, typ } = entry;
        // get Czech date format from JSON object
        const [ year, month, day ] = datum.split(' ')[0].split('-');
        const myEmail = email ? `<a href="mailto:${email}">${jmeno}</a>` : `${jmeno}`;
        knihaUL += `
            <li>
                ${day}.${month}.${year}
                <b><i>${myEmail}</i></b>:
                ${text.slice(0,85)}
            </li>
        `;
    });
    knihaUL += '</ul>';
    knihaPlace.innerHTML = knihaUL;
}

const loadForumShort = () => {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `api/pdo_read_forum.php`, true);
  xhr.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        forum = JSON.parse(this.responseText);
        UIshowForum(forum);
      }
  }
  xhr.onerror = function () {
    console.log( JSON.parse('{"status" : "ajax_failed"}') );
}
  xhr.send(JSON.stringify({'start' : 0, 'limit' : 5}));
}

loadForumShort();

