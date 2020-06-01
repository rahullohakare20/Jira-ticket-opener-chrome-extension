import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

import './Home.css';

function Home() {
  const [ id, setId ] = useState('');
  const [ invalid, setInvalid ] = useState(false);

  const getProjectNameLists = () => {
    const projectNameLists = localStorage.getItem('projectNames')
      && localStorage.getItem('projectNames').split(',') || [ 'NADE' ];

    const defaultProjectId = localStorage.getItem('defaultProjectId') || 0;

    if (projectNameLists.length <= 1 || defaultProjectId === '0') return projectNameLists;

    [ projectNameLists[ 0 ], projectNameLists[ defaultProjectId ] ]
      = [ projectNameLists[ defaultProjectId ], projectNameLists[ 0 ] ];

    return projectNameLists;
  }

  const [ projectNames, setProjectNames ] = useState(getProjectNameLists());
  const [ selectedProject, setSelectedProject ] = useState(projectNames[ 0 ]);

  const onEnter = (event) => {
    if (event.keyCode === 13) {
      onSubmit();
    }
  }
  const onSubmit = () => {
    if (invalid) return false;

    const companyUrl = localStorage.getItem('URL') || 'https://jira.rocketsoftware.com';
    const projectName = selectedProject || 'NADE';

    const browse = companyUrl[ companyUrl.length - 1 ] === '/'
      ? 'browse/'
      : '/browse/';

    const url = `${companyUrl}${browse}${projectName}-${id}`;
    window.open(url, "_blank");
  }

  const onChange = (event) => {
    if (+event.target.value) {
      setInvalid(false);
    } else {
      setInvalid(true);
    }
    setId(event.target.value);
  }

  const setProject = (e) => {
    setSelectedProject(e.target.value);
  }

  return (
    <div className="container">
      <Link className="link" to="/settings">
        <FaCog size='20' title='Settings' />
      </Link>
      <span className="home-title">Jira Ticket Opener</span>
      <div className='home-form'>
        <div className='flex project-id-container'>
          <select className='select-project' onChange={setProject} >
            {projectNames.map((project, key) => (
              <option key={key}>{project}</option>
            ))}
          </select>
          <input
            type="text"
            className="input-field"
            autoFocus
            placeholder='Enter jira ticket id'
            value={id}
            onKeyDown={(e) => onEnter(e)}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='open-button-container'>
          <button className="open-button" onClick={() => onSubmit()}>Open</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
