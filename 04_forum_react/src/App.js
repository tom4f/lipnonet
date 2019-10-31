import React, { Component } from 'react';
import SearchForum  from './components/SearchForum';
import Forum        from './components/Forum';
import SelectForum  from './components/SelectForum';
import PostsPerPage  from './components/PostsPerPage';
import Paginations  from './components/Paginations';
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
// Change page
paginate = (begin) => this.setState(begin);

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
  return (
    <div className="App">
      <div  className="left">
        allEntries.length: {this.state.allEntries.length},
        <br/>filteredEntries.length: {this.state.filteredEntries.length},
        <br/>entries.length: {this.state.entries.length},
        <br/>begin: {this.state.begin},
        <br/>postsPerPage: {this.state.postsPerPage},
        <br/>paginateSize: {this.state.paginateSize},
        <br/>next: {this.state.next},
      </div>
      <SearchForum
        allEntries={this.state.allEntries}
        paginate={this.paginate}
        postsPerPage={this.state.postsPerPage}
        begin={this.state.begin}
      />
      <SelectForum
        allEntries={this.state.allEntries}
        paginate={this.paginate}
        postsPerPage={this.state.postsPerPage}
      />
      <div>Je vybráno {this.state.filteredEntries.length} záznamů.</div>
      <Forum entries={this.state.entries} />
      <Paginations
        allEntries={this.state.filteredEntries}
        paginate={this.paginate}
        postsPerPage={this.state.postsPerPage}
        begin={this.state.begin}
        paginateSize={this.state.paginateSize}
        next={this.state.next}
      />
      <PostsPerPage
        allEntries={this.state.allEntries}
        paginate={this.paginate}
        postsPerPage={this.state.postsPerPage}
      />
    </div>
  )
  }
}