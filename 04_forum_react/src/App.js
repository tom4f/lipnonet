import React, { Component } from 'react';
import SearchForum  from './components/SearchForum';
import Forum        from './components/Forum';
import SelectForum  from './components/SelectForum';
import PostsPerPage from './components/PostsPerPage';
import Paginations  from './components/Paginations';
import SelectPaginate  from './components/SelectPaginate';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEntries: [],
      filteredEntries: [],
      entries: [],
      begin: 0,
      postsPerPage: 4,
      paginateSize: 10,
      next:0,
   };
}

// method called after component is rendered
componentDidMount(){
    let allForum = [];
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost/lipnonet/rekreace/api/pdo_read_forum.php`, true);
    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === Number(200)) {
          allForum = JSON.parse(xhr.responseText);
          const end = this.state.begin + this.state.postsPerPage;
          this.setState( {entries : allForum.slice(this.state.begin, end + 1)} );
          this.setState( {
            allEntries : allForum,
            filteredEntries : allForum,
          });
        }
    }
    xhr.send();
}

render(){

// descructing states
const { allEntries, filteredEntries, entries, begin, postsPerPage, paginateSize, next } = this.state;

// Change page
const paginate = (begin) => this.setState(begin);

  return (
    <div className="App">
      <div  className="left">
        allEntries.length: {allEntries.length},
        <br/>filteredEntries.length: {filteredEntries.length},
        <br/>entries.length: {entries.length},
        <br/>begin: {begin},
        <br/>postsPerPage: {postsPerPage},
        <br/>paginateSize: {paginateSize},
        <br/>next: {next},
      </div>
      <SearchForum
        allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
        begin={begin}
      />
      <SelectForum
        allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
      />
      <div>Je vybráno {filteredEntries.length} záznamů.</div>
      <Forum entries={entries} />
      <Paginations
        allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
        begin={begin}
        paginateSize={paginateSize}
        next={next}
      />
      <PostsPerPage
        allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
      />
      <SelectPaginate
        allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
      />
    </div>
  )
  }
}