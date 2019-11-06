import React from 'react';

const PostsPerPage = ( {filteredEntriesBySearch, paginate} ) => {

    const filteredPostsPerPage = event => {
        const postsPerPage =  Number(event.target.value);
        const begin = 0;
        const end = begin + postsPerPage - 1;
        paginate({
            begin : 0,
            next : 0,
            postsPerPage: postsPerPage,
            entries : filteredEntriesBySearch.slice(begin, end)
        });
      }

    return (
        <select required name="postsPerPage" onChange={(e) => filteredPostsPerPage(e)} >
            <option value="10">Počet příspěvků na stránku</option>
            <option value="5">  5</option>
            <option value="10"> 10</option>
            <option value="20">20</option>
            <option value="50">50</option>
        </select>
      )
}

export default PostsPerPage;