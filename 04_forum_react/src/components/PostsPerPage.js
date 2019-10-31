import React from 'react';

const PostsPerPage = ( {allEntries, postsPerPage, paginate} ) => {

    const filteredPostsPerPage = event => {
        postsPerPage =  Number(event.target.value);
        const begin = 0;
        const end = begin + postsPerPage;
        paginate({
            filteredEntries : allEntries,
            begin : 0,
            next : 0,
            postsPerPage: postsPerPage,
            entries : allEntries.slice(begin, end + 1)
        });
        console.log(begin + ' - ' + end);
      }

    return (
        <select required name="postsPerPage" onChange={(e) => filteredPostsPerPage(e)} >
            <option value="9">  --- Počet příspěvků na stránku ---</option>
            <option value="4">  5</option>
            <option value="9"> 10</option>
            <option value="19">20</option>
            <option value="49">50</option>
        </select>
      )
}

export default PostsPerPage;