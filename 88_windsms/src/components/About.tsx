import React from 'react';

//const About = () => {
// but why "npm test" did not works with :
const About: React.FC = (): React.ReactElement => {
    

    return (
        <article className="container-about about-specific">
            <header className="header-label">Posílání informací o počasí dle nastavených limitů.</header>
            
            <section className="input-section">
                <label>Úvodem:</label>
                <p>
                    Aplikace je v provozu od cca roku 2000 na adrese &nbsp;
                    <a href="https://www.frymburk.com/4f/enter.php">www.frymburk.com/4f/enter.php</a>.&nbsp;
                    Tato stránka zatím pouze upravuje vzhled původní aplikace.&nbsp;
                <br />
                    Aby se data posílala jako sms na mobil, je potřeba si pro mobilní číslo nastavit emailovou adresu (např. : 603123456@sms.t-mobile.cz).&nbsp;
                    Pro mobilního operátora T-Mobile je postup zde:&nbsp;
                    <a href="https://www.t-mobile.cz/e-mail-do-sms">www.t-mobile.cz/e-mail-do-sms</a>

                </p>
            </section>

            <section className="input-section">
                <label>Jak to funguje:</label>
                <ul>
                    <li>[1] Data se aktualizují každých 15 minut. Pokud vyhovují Vašim podmínkám, jsou rozeslány na emaily / mobilní telefony.</li>
                    <li>[2] Hodnoty větru za poslední hodinu jsou rozděleny na čtyři 15 minutové úseky a je spočítán jejich průměr.</li>
                    <li>[3] Zobrazují se maximální 10 sekundové nárazy za 15 minut a maximální náraz za celý den.</li>
                    <li>[4] Dále je zobrazena minimální, průměrná a maximální teplota.</li>
                    <li>[5] Po přihlášení si můžete změnit veškeré údaje (uživatelské jméno, heslo, email, limit, dny pro posílání).</li>
                    <li>[6] Data se v současné době neposílají v noci</li>
                </ul>
            </section>


            <section className="input-section">
                <label>Připravujeme:</label>
                <ul>
                    <li>[1] možnost nastavit i jiné limity pro posílání emailu / SMS - např. množství dešťových srážek / intenzity deště, apod...</li>
                    <li>[2] možnost nastavit čas posílání (např. od 15:00 do 18:00)</li>
                </ul>
            </section>

            Tomáš Kučera - tom4f@seznam.cz - ubytovani@lipnonet.cz
        </article>
    );
};

export default About ;