import { useState, useEffect } from "react";

const App = () => {
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch("http://localhost:5000/api/repos");
        const data = await result.json();
        setRepos(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function resetTimer() {
    fetch("http://localhost:5000/api/reset");
  }

  function sortByStars() {
    let copyRepos = [...repos];
    copyRepos.sort((a, b) => {
      return b.stargazers_count - a.stargazers_count;
    });
    setRepos(copyRepos);
  }
  function sortByForks() {
    let copyRepos = [...repos];
    copyRepos.sort((a, b) => {
      return b.forks - a.forks;
    });
    setRepos(copyRepos);
  }
  return (
    <div className="app container">
      <h1 className="title">Github Trending Repositories</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by id or name"
          className="search-box__input"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <img src="/search.png" width="25" height="25" alt="" />
      </div>
      <div className="buttons">
        <button className="reset" onClick={resetTimer}>
          Reset internal timer
        </button>
        <button className="reset" onClick={sortByStars}>
          Sort By Stars
        </button>
        <button className="reset" onClick={sortByForks}>
          Sort By Forks
        </button>
      </div>
      {loading ? (
        <div className="loading-spinner" style={{ alignSelf: "center" }}></div>
      ) : (
        <table className="repos-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Name</th>
              <th>Description</th>
              <th>Owner</th>
              <th>ID</th>
              <th>Stars</th>
              <th>Forks</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            {repos
              .filter((item) => {
                if (search.toLowerCase() === "") {
                  return item;
                } else if (isNaN(Number(search.toLowerCase()))) {
                  return item.name.toLowerCase().includes(search.toLowerCase());
                } else {
                  return String(item.id).includes(search);
                }
              })
              .map((repo, index) => (
                <tr key={repo.id}>
                  <td>{index}</td>
                  <td>{repo.name}</td>
                  <td>
                    {repo.description?.length > 100
                      ? repo.description.slice(0, 100) + "..."
                      : repo.description}
                  </td>
                  <td>{repo.owner.login}</td>
                  <td>{repo.id}</td>
                  <td>{repo.stargazers_count}</td>
                  <td>{repo.forks}</td>
                  <td>{repo.language}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
