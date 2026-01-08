import React from 'react'

const pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i)
  }
  return (
    <div>
      {
        pages.map((page, index) => {
          return (
            <button key={index} onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'active' : ''}
            >{page}</button>
          )
        })
      }
    </div>
  )
}

export default pagination