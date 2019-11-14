import React, { Component } from 'react';
import axios                from "axios";
// test
class AddEntry extends Component {
    constructor(props){
        super(props)
        this.state = { 
            formVisible :   false,
            alert:          'off',
            jmeno :         '',
            email :         '',
            typ :           '',
            text :          '',
            antispam :      new Date().getMilliseconds(),
            antispamForm :  ''
         }
    }

    showForum = () => {
        this.setState({ formVisible : true });
    }

    myChangeHandler = (event) => {
        this.setState({ [event.target.name] : event.target.value});
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(this.state.antispam + ' = ' + Number(data.get('antispamForm')));
        if (this.state.antispam === Number(data.get('antispamForm'))){
            axios.post('http://localhost/lipnonet/rekreace/api/pdo_create_forum.php', this.state)
            // axios.post('https://frymburk.com/rekreace/api/pdo_create_forum.php', this.state)
                .then(response => {
                    console.log(response);
                    this.setState({
                        formVisible : false,
                        alert: 'ok'
                    });
    
                    setTimeout( 
                        () => this.setState({alert: 'off'}),
                        5000            
                    );
    
                    axios
                        .get('http://localhost/lipnonet/rekreace/api/pdo_read_forum.php', {
                        // .get('https://frymburk.com/rekreace/api/pdo_read_forum.php', {
                        timeout: 5000
                    })
                    .then(res => {
                            /// allForum = JSON.parse(res.data); --> for native xhr.onload 
                            const allForum = res.data;
                            const end = this.props.begin + this.props.postsPerPage - 1;
                            const { paginate } = this.props;
                            paginate({
                                entries : allForum.slice(this.props.begin, end),
                                allEntries : allForum,
                                filteredEntriesBySearch: allForum,
                                begin : 0
                            });
                    })
                    .catch(err => console.error(err));
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            this.setState ({
                alert : 'antispamNotOk' 
            }) 
            setTimeout( 
                () => this.setState({alert:'off'}),
                5000            
            );
        }               
    }

    render() {
        let button = '';
        let formSummmary ='';
        let alert = null;
        alert = this.state.alert === 'ok'
                    ? <h1>Záznam byl přidán !!!</h1>
                    : this.state.alert === 'antispamNotOk'
                        ? <h1>Záznam se nepodařilo odeslat !!!</h1>
                        : null;
        if (this.state.formVisible) {
            button = 
            <form onSubmit={this.mySubmitHandler} name="formular" encType="multipart/form-data">
                <div id="kniha_formular" className="kniha_formular">
                    <div>
                        <input onChange={this.myChangeHandler} type="text" name="jmeno" placeholder="Jméno" size="10" required />
                        <input onChange={this.myChangeHandler} type="text" name="email" placeholder="E-mail" size="15" />
                        <select onChange={this.myChangeHandler} required name="typ">
                            <option value="" >  --- vyber kategorii ---</option>
                            <option value="0">Fórum</option>
                            <option value="1">Inzerce</option>
                            <option value="2">Seznamka</option>
                            <option value="3">K obsahu stránek</option>
                        </select>
                    </div>
                    <div>
                        <textarea onChange={this.myChangeHandler} rows="5" cols="60" type="text" className="text-area" name="text" placeholder="text" required></textarea>
                    </div>
                    <div>
                        opiš kód : <input onChange={this.myChangeHandler} type="text" name="antispamForm" placeholder={this.state.antispam} size="5" required />
                        
                    </div>
                </div>
                <input type="submit" name="odesli" defaultValue="Vlož nový příspěvek" />
            </form>;
            formSummmary = 
                <h1>
                    Jmeno :     {this.state.jmeno} <br/>
                    Email :     {this.state.email} <br/>
                    Typ :       {this.state.typ} <br/>
                    Text :      {this.state.text} <br/>
                    AntispamForm :  {this.state.antispamForm} <br/>
                </h1>
                ;

        } else {
             button = <button className="button" onClick={ this.showForum }>Přidej záznam</button>;
        }
        return (
            <div>
                {/* {formSummmary} */}
                {button}
                {alert}
            </div>
        );
    }
}

export default AddEntry;