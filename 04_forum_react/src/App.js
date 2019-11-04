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
      entries:          [],
      begin:            0,
      postsPerPage:     4,
      paginateSize:     10,
      next:             0
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
              filteredEntriesByCategory: allForum
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
const { allEntries, filteredEntries, filteredEntriesByCategory, entries, begin, postsPerPage, paginateSize, next } = this.state;

// Change page
const paginate = (begin) => {
  this.setState(begin);
  console.log(this);
}

  return (
    <div className="container my-5 text-center">
          <div  className="left">
            allEntries.length: {allEntries.length},
            <br/>filteredEntries.length: {filteredEntries.length},
            <br/>filteredEntriesByCategory.length: {filteredEntriesByCategory.length},
            <br/>entries.length: {entries.length},
            <br/>begin: {begin},
            <br/>postsPerPage: {postsPerPage},
            <br/>paginateSize: {paginateSize},
            <br/>next: {next},
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
            allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
            begin={begin}
            filteredEntries={filteredEntries}
            filteredEntriesByCategory={filteredEntriesByCategory}

          />
          <SelectForum
            allEntries={allEntries} paginate={paginate} postsPerPage={postsPerPage}
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