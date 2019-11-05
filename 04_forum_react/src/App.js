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

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEntries:       [],
      filteredEntries:  [],
      filteredEntriesByCategory:  [],
      filteredEntriesBySearch:    [],
      entries:          [],
      begin:            0,
      postsPerPage:     4,
      paginateSize:     10,
      next:             0,
      searchText:       ''
   };
}

// method called after component is rendered
componentDidMount(){
    let allForum = [];
    axios
//    .get('http://localhost/lipnonet/rekreace/api/pdo_read_forum.php', {
      .get('https://frymburk.com/rekreace/api/pdo_read_forum.php', {
      timeout: 5000
    })
    .then(res => {
            /// allForum = JSON.parse(res.data); --> for native xhr.onload 
            allForum = res.data;
            const end = this.state.begin + this.state.postsPerPage;
            this.setState( {entries : allForum.slice(this.state.begin, end + 1)} );
            this.setState( {
              allEntries : allForum,
              filteredEntries : allForum,
              filteredEntriesByCategory: allForum,
              filteredEntriesBySearch: allForum
            });
    })
    .catch(err => console.error(err));
}


    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', `http://localhost/lipnonet/rekreace/api/pdo_read_forum.php`, true);
    // xhr.onload = () => {
    //     if (xhr.readyState === 4 && xhr.status === Number(200)) {
    //       allForum = JSON.parse(xhr.responseText);
    //       const end = this.state.begin + this.state.postsPerPage;
    //       this.setState( {entries : allForum.slice(this.state.begin, end + 1)} );
    //       this.setState( {
    //         allEntries : allForum,
    //         filteredEntries : allForum,
    //       });
    //     }
    // }
    // xhr.send();
//  }

render(){

// descructing states
const { allEntries, filteredEntries, filteredEntriesByCategory, filteredEntriesBySearch, entries, begin, postsPerPage, paginateSize, next, searchText } = this.state;

// Change page
const paginate = (begin) => {
  this.setState(begin);
  console.log(this);
}

// calculate filter result
const filteredEntriesCalculate = (searchText) => {
    const end = begin + postsPerPage;
    let filteredForum = filteredEntries.filter( alarm => {
      const regex = new RegExp(`${searchText}`, 'gi');
      return alarm.text.match(regex) || alarm.jmeno.match(regex);
    });
    console.log(searchText);
    if( searchText.length === 0 ) {
        this.setState({
          filteredEntriesBySearch : filteredEntries,
          begin : 0,
          entries : filteredEntries.slice(begin, end + 1),
          searchText : ''
        });
    } else if (filteredForum.length === 0 ) {
      this.setState( {
          entries : [],
          filteredEntriesBySearch : []
        } );
      } else { 
        this.setState({
              filteredEntriesBySearch : filteredForum,
              begin : 0,
              entries : filteredForum.slice(begin, end + 1),
              searchText : searchText
            });
        };
}

  return (
    <div className="container my-5 text-center">
          <div  className="left">
            allEntries.length: {allEntries.length},
            <br/>filteredEntries.length: {filteredEntries.length},
            <br/>filteredEntriesByCategory.length: {filteredEntriesByCategory.length},
            <br/>filteredEntriesBySearch.length: {filteredEntriesBySearch.length},
            <br/>entries.length: {entries.length},
            <br/>begin: {begin},
            <br/>postsPerPage: {postsPerPage},
            <br/>paginateSize: {paginateSize},
            <br/>next: {next},
            <br/>searchText: {searchText}
          </div>
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
          />
          <SelectForum
            allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
            filteredEntries={filteredEntries}
            filteredEntriesByCategory={filteredEntriesByCategory}
            filteredEntriesBySearch={filteredEntriesBySearch}
          />
          <PostsPerPage
            allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
          />
          <SelectPaginate
            allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
            paginateSize={paginateSize}
          />
      </div>
      <div>Je vybráno {filteredEntries.length} záznamů.</div>
          <Paginations
            allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
            begin={begin}
            paginateSize={paginateSize}
            next={next}
            filteredEntries={filteredEntries}
          />
      <Forum entries={entries} />
    </div>
  )
  }
}