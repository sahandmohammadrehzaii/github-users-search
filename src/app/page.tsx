'use client';

import "./globals.css";
import { useState } from "react";

class Github {
  constructor() {
    this.client_id = "ab7e3c6ac10d3714249a";
    this.client_secret = "f315c3cc4bca8b4b922fc04af1b31b02cb1d143d";
    this.repos_count = 5;
    this.repos_sort = "created: asc";
  }

  async getUser(user) {
    const profileResponse = await fetch(
      `https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`
    );
    const reposResponse = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=${
        this.repos_count
      }&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${
        this.client_secret
      }`
    );

    const profile = await profileResponse.json();
    const repos = await reposResponse.json();

    return {
      profile: profile,
      repos: repos,
    };
  }
}

const github = new Github();

export default function Home() {
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleSearch = async () => {
    if (userName.trim() === "") {
      showAlert("Please enter a GitHub username", "alert alert-danger");
      return;
    }

    try {
      const data = await github.getUser(userName);
      if (data.profile.message === "Not Found") {
        showAlert("User not found. Try again!", "alert alert-danger");
        setProfile(null);
        setRepos(null);
      } else {
        setProfile(data.profile);
        setRepos(data.repos);
        setError(null);
      }
    } catch (err) {
      showAlert("Error fetching data. Please try again!", "alert alert-danger");
      setProfile(null);
      setRepos(null);
    }
  };

  const showAlert = (message, className) => {
    setAlert({ message, className });

    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const clearProfile = () => {
    setProfile(null);
    setRepos(null);
    setError(null);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <nav className="navbar navbar-dark bg-primary mb-3">
        <div className="container">
          <a href="" className="navbar-brand">
            Github User Finder
          </a>
        </div>
      </nav>
      <div className="container searchContainer">
        <div className="search card card-body">
          <h2>Search Github User</h2>
          <p className="lead">Enter username to see user profile and repos</p>
          <input
            type="text"
            id="userName"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter GitHub username"
          />
          <button className="btn btn-primary mt-3" onClick={handleSearch}>
            Search
          </button>
          <button
            className="btn btn-secondary mt-3 ms-2"
            onClick={clearProfile}
          >
            Clear
          </button>
        </div>

        {/* Alert */}
        {alert && <div className={alert.className}>{alert.message}</div>}

        {/* Profile Section */}
        {profile && (
          <div id="profile" className="card mt-3">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="img-fluid mb-2"
                  />
                  <a
                    href={profile.html_url}
                    target="_blank"
                    className="btn btn-primary btn-block"
                  >
                    View Profile
                  </a>
                </div>
                <div className="col-md-9">
                  <span className="badge badge-primary">
                    Public Repos: {profile.public_repos}
                  </span>
                  <span className="badge badge-secondary">
                    Public Gists: {profile.public_gists}
                  </span>
                  <span className="badge badge-success">
                    Followers: {profile.followers}
                  </span>
                  <span className="badge badge-info">
                    Following: {profile.following}
                  </span>
                  <br />
                  <br />
                  <ul className="list-group">
                    <li className="list-group-item">
                      Company: {profile.company || "N/A"}
                    </li>
                    <li className="list-group-item">
                      Website: {profile.blog || "N/A"}
                    </li>
                    <li className="list-group-item">
                      Location: {profile.location || "N/A"}
                    </li>
                    <li className="list-group-item">
                      Member Since:{" "}
                      {new Date(profile.created_at).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Repos Section */}
            <h3 className="page-heading mb-3">Latest Repos</h3>
            <div id="repos">
              {repos.map((repo) => (
                <div className="card card-body mb-2" key={repo.id}>
                  <div className="row">
                    <div className="col-sm-6">
                      <a href={repo.html_url} target="_blank" rel="noreferrer">
                        {repo.name}
                      </a>
                      <p className="pt-2">{repo.description || "No description provided"}</p>
                    </div>
                    <div className="col-sm-6">
                      <span className="badge badge-primary">
                        Stars: {repo.stargazers_count}
                      </span>
                      <span className="badge badge-info">
                        Watchers: {repo.watchers_count}
                      </span>
                      <span className="badge badge-light">
                        Forks: {repo.forks_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-5 p-3 text-center bg-light">
        Github user finder &copy;
      </footer>
    </div>
  );
}