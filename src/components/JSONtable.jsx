import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap

function JSONtableFetch() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  return data;
}

function PageMaker(data, PostsPerPage) {
  const PageNumbers = Math.ceil(data.length / PostsPerPage);
  const NumOfPages = Array.from({ length: PageNumbers }, (v, i) => i + 1);
  return NumOfPages;
}

function DataSlicer(data, i) {
  const start = i * 10;
  const end = Math.min(start + 10, data.length);
  return data.slice(start, end);
}

function ContentDisplay({ data, PageNumbers, setPage, FirstPageNum = 0, toggleComments }) {
  const dataSlice = DataSlicer(data, FirstPageNum);

  return (
    <div>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Post Id</th>
            <th>Title</th>
            <th>Body</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {dataSlice.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => toggleComments(post.id)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {PageNumbers.map((buttonNum) => (
        <button
          className="btn btn-primary"
          key={buttonNum}
          onClick={() => setPage(buttonNum - 1)}
        >
          {buttonNum}
        </button>
      ))}
    </div>
  );
}

function JSONtable() {
  const data = JSONtableFetch();
  const PostsPerPage = 10;
  const [page, setPage] = useState(0);
  const [filterInclude, setFilterInclude] = useState('');
  const [filterExclude, setFilterExclude] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [comments, setComments] = useState({});
  
  // Function to handle sorting alphabetically
  const sortedData = isSorted
    ? [...data].sort((a, b) => a.title.localeCompare(b.title))
    : data;

  const filteredData = sortedData.filter((post) => {
    const includeCondition = filterInclude
      ? post.title.includes(filterInclude) || post.body.includes(filterInclude)
      : true;

    const excludeCondition = filterExclude
      ? !post.title.includes(filterExclude) && !post.body.includes(filterExclude)
      : true;

    return includeCondition && excludeCondition;
  });

  const PageNumbers = PageMaker(filteredData, PostsPerPage);

  // Function to fetch comments for a specific post
  const toggleComments = (postId) => {
    if (comments[postId]) {
      alert(JSON.stringify(comments[postId], null, 2)); // Display in alert for now
    } else {
      fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        .then((response) => response.json())
        .then((json) => {
          setComments((prevComments) => ({
            ...prevComments,
            [postId]: json
          }));
          alert(JSON.stringify(json, null, 2)); // Display in alert
        });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <label>
            Include:
            <input
              className="form-control"
              type="text"
              value={filterInclude}
              onChange={(e) => setFilterInclude(e.target.value)}
              placeholder="Filter by words to include"
            />
          </label>
        </div>
        <div className="col-md-6">
          <label>
            Exclude:
            <input
              className="form-control"
              type="text"
              value={filterExclude}
              onChange={(e) => setFilterExclude(e.target.value)}
              placeholder="Filter by words to exclude"
            />
          </label>
        </div>
      </div>
      <div className="my-3">
        <button
          className="btn btn-info"
          onClick={() => setIsSorted(!isSorted)}
        >
          {isSorted ? 'Switch to Default Order' : 'Sort Alphabetically'}
        </button>
      </div>
      <ContentDisplay
        data={filteredData}
        PageNumbers={PageNumbers}
        setPage={setPage}
        FirstPageNum={page}
        toggleComments={toggleComments}
      />
    </div>
  );
}

export default JSONtable;
