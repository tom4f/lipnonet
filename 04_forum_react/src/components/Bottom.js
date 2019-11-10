import React from 'react';

const Bottom = () => {

    return ( 
        <span>
            <div className="header">
                (C)1998-2019
                <a href="mailto:ubytovani@lipnonet.cz">ubytovani@lipnonet.cz</a>
                <br/>
                <a href="http://www.lipnonet.cz/">www.LIPNOnet.cz</a>
                <a href="http://www.lipno.net/">www.LIPNO.net</a>
                <a href="http://www.frymburk.com/">www.FRYMBURK.com</a>
                <a href="http://www.frymburk.eu/">www.FRYMBURK.eu</a>
            </div>

            <div className="bottom">
                <form action="https://www.frymburk.com/rekreace/google_search.php" id="cse-search-box">
                    <div>
                    <input type="hidden" name="cx" value="partner-pub-6892058759603615:oyh6q2-ealb" />
                    <input type="hidden" name="cof" value="FORID:10" />
                    <input type="hidden" name="ie" value="UTF-8" />
                    <input type="text" name="q" size="31" />
                    <input type="submit" name="sa" value="Hledat" />
                    </div>
                </form>
                <br/>
                <a href="https://www.toplist.cz/stat/6477" target="_top">
                    <img src="https://toplist.cz/count.asp?id=6477&logo=bc" border="0" alt="TOPlist" width="88" height="120"/>
                </a>
            </div>
        </span>
    );
}
export default Bottom;