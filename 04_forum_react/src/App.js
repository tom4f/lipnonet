import React, { Component } from 'react';
import axios                from "axios";
import SearchForum          from './components/SearchForum';
import Forum                from './components/Forum';
import SelectForum          from './components/SelectForum';
import PostsPerPage         from './components/PostsPerPage';
import Paginations          from './components/Paginations';
import SelectPaginate       from './components/SelectPaginate';
import AddEntry             from './components/AddEntry';
import './App.css';
import Top                  from './components/Top';
import Bottom               from './components/Bottom';
import headerLipnoForum     from './images/nadpis_lipenske_forum.gif';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEntries:                 [],
      filteredEntriesByCategory:  [],
      filteredEntriesBySearch:    [],
      entries:                    [],
      begin:                      0,
      postsPerPage:               5,
      paginateSize:               10,
      next:                       0,
      searchText:                 '',
      selectedCategory:           '999999',
      buttonText:                 '0'
   };
}

// method called after component is rendered
componentDidMount(){
    let allForum = [];
    axios
    .get('http://localhost/lipnonet/rekreace/api/pdo_read_forum.php', {
//      .get('https://frymburk.com/rekreace/api/pdo_read_forum.php', {
      timeout: 5000
    })
    .then(res => {
            // allForum = JSON.parse(res.data); --> for native xhr.onload 
            allForum = res.data;
            const end = this.state.begin + this.state.postsPerPage -1;
            this.setState( {entries : allForum.slice(this.state.begin, end)} );
            this.setState( {
              allEntries : allForum,
              filteredEntriesByCategory: allForum,
              filteredEntriesBySearch: allForum
            });
    })
    .catch(err => console.error(err));
}

render(){

// descructing states, e.g. this.state.allEntrie -> allEntries
const { allEntries, filteredEntriesByCategory, filteredEntriesBySearch, entries, begin, postsPerPage, paginateSize, next, searchText, selectedCategory, buttonText } = this.state;

// Change page
const paginate = (begin) => {
  this.setState(begin);
}

// calculate filter result
const filteredEntriesCalculate = (searchText, selectedCategory) => {
    // select category
    const filteredEntriesByCategory = selectedCategory === '999999'
        ? allEntries
        : allEntries.filter( one => one.typ === selectedCategory );
    this.setState({
        selectedCategory: selectedCategory,
        filteredEntriesByCategory : filteredEntriesByCategory,
        searchText : searchText,
        begin : 0,
        next : 0,
    });
    // search text
    let filteredForum = filteredEntriesByCategory.filter( alarm => {
        const regex = new RegExp(`${searchText}`, 'gi');
        return alarm.text.match(regex) || alarm.jmeno.match(regex);
    });
    if(searchText.length === 0) 
        this.setState({filteredEntriesBySearch : filteredEntriesByCategory});
    else if (filteredForum.length === 0 )
        this.setState({ filteredEntriesBySearch : [] });
    else
        this.setState({ filteredEntriesBySearch : filteredForum });
}


  return (
    <div className="container">
      <Top/>
      <div className="center">
            {/* <div  className="left">
              allEntries.length: {allEntries.length},
              <br/>filteredEntriesByCategory.length: {filteredEntriesByCategory.length},
              <br/>filteredEntriesBySearch.length: {filteredEntriesBySearch.length},
              <br/>entries.length: {entries.length},
              <br/>begin: {begin} + postsPerPage: {postsPerPage} = end : {begin + postsPerPage -1 }
              <br/>paginateSize: {paginateSize},
              <br/>next: {next},
              <br/>buttonText: {buttonText},
              <br/><b>searchText</b>: {searchText}
              <br/><b>selectedCategory</b> : {selectedCategory}
            </div> */}
        <br/><img src={headerLipnoForum} width="548" height="39"/>
        <div className="btn-group">
            <AddEntry
              paginate={paginate}
              postsPerPage={postsPerPage}
              begin={begin}
            />
        </div>
        <p style={{clear : "both"}}></p>
        <div className="fields">
            <SearchForum
              filteredEntriesCalculate={filteredEntriesCalculate}
              selectedCategory={selectedCategory}
            />
            <SelectForum
              filteredEntriesCalculate={filteredEntriesCalculate}
              searchText={searchText}
            />
            <PostsPerPage
              filteredEntriesBySearch={filteredEntriesBySearch}
              paginate={paginate}
            />
        </div>
        <div>Je vybráno {filteredEntriesBySearch.length} záznamů.</div>
        <Forum entries={filteredEntriesBySearch.slice(begin, begin + postsPerPage)} />
        <br/>
        <Paginations
              paginate={paginate}
              postsPerPage={postsPerPage}
              filteredEntriesBySearch={filteredEntriesBySearch}
              begin={begin}
              paginateSize={paginateSize}
              next={next}
              buttonText={buttonText}
            />
        <br/>
        <SelectPaginate paginate={paginate} />
        <br/>
            Build with React :-)
        <br/>
      </div>
      <Bottom/>
    </div>
  ) // return end
  } // render end
}