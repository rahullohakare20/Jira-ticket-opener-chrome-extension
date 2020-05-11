import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaRegTrashAlt, FaHome, FaPlusCircle, FaDotCircle } from 'react-icons/fa';

import './settings.css';

function Settings() {
  const url = localStorage.getItem('URL') || '';
  const history = useHistory();
  const goToHome = () => history.push('/');

  const [ URL, setURL ] = useState(url);
  const [ isInvalid, setIsInvalid ] = useState(true);

  const initialDefaultProjectId = +localStorage.getItem('defaultProjectId') || 0;
  const [ defaultProjectId, setDefaultProjectId ] = useState(initialDefaultProjectId);

  const getInitialProjectNames = () => {
    const projectNames = localStorage.getItem('projectNames') || '';
    return projectNames.split(',');
  }

  const [ multiProjectInputs, setMultiProjectInput ] = useState(getInitialProjectNames());

  useEffect(() => {
    if (URL.length > 0 && multiProjectInputs[ 0 ].length > 0) {
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  }, [ URL, multiProjectInputs ]);

  const getValidUrl = (url = '') => {
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl
      .trim()
      .replace(/\s/g, '');
    if (/^(:\/\/)/.test(newUrl)) {
      return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
      return `http://${newUrl}`;
    }
    return newUrl;
  };

  const onURLChange = (event) => {
    const url = event.target.value;

    setURL(url);
  }

  const onProjectNameChange = (event, id) => {
    const updatedMultiProjectInputs = [ ...multiProjectInputs ];
    updatedMultiProjectInputs[ id ] = event.target.value;

    setMultiProjectInput(updatedMultiProjectInputs);
  }

  const onSubmit = () => {
    if (URL.length) {
      const url = getValidUrl(URL);
      localStorage.setItem('URL', url);
    }

    if (multiProjectInputs.length) {
      const updatedMultiProjectInputs = multiProjectInputs.filter(project => project.length > 0)

      setMultiProjectInput(updatedMultiProjectInputs);
      localStorage.setItem('projectNames', updatedMultiProjectInputs);
      localStorage.setItem('defaultProjectId', defaultProjectId);

      setIsInvalid(true);
      goToHome();
    }
  }

  const appendInput = () => {
    setMultiProjectInput([ ...multiProjectInputs, '' ]);
  }

  const removeProject = (id) => {
    if (multiProjectInputs.length <= 1) return;

    const updatedMultiProjectInputs = multiProjectInputs.filter((project, key) => id !== key);

    setMultiProjectInput(updatedMultiProjectInputs);

    setDefaultProjectId((defaultProjectId - 1) < 0
      ? 0
      : (defaultProjectId - 1)
    );
  }

  const handleDefaultClick = (id) => {
    setDefaultProjectId(id);
  }

  return (
    <div className="Settings">
      <Link className="link" to="/">
        <FaHome title='Home' size='25' />
      </Link>
      <span className="setting-title">Jira Settings</span>
      <div className="setting-form">
        <div className='setting-container'>
          <div className='input-label'> Jira URL:</div>
          <input
            type="text"
            className="input-field"
            value={URL}
            placeholder="https://jira.company.com"
            onChange={(e) => onURLChange(e)}
            title={URL}
          />
        </div>

        <div className='setting-container'>
          <div className='input-label'>
            Add Project Name Short Form:
          </div>

          {multiProjectInputs.map((project, key) => <div className='projectName' key={key}>
            <input key={key}
              className="input-field"
              placeholder="Example: NADE"
              value={project}
              onChange={(e) => onProjectNameChange(e, key)}
            />

            <div className='default-project'>
              {console.log(defaultProjectId, key)}
              <FaDotCircle
                color={defaultProjectId === key ? 'orange' : 'white'}
                onClick={() => handleDefaultClick(key)}
                title={defaultProjectId === key ? 'Default project' : 'Mark default project'}
              />
            </div>
            <div className='remove-project-icon'
              className={`${multiProjectInputs.length > 1
                ? 'cursor-pointer'
                : 'cursor-not-allowed'} remove-project-icon`}>
              <FaRegTrashAlt
                color='red'
                size='20'
                onClick={() => removeProject(key)}
                title='Remove Project'
              />
            </div>
          </div>
          )}
        </div>
        <div className='add-project'>
          <FaPlusCircle
            color='#7FFF00'
            size='30'
            title='Add more projects'
            onClick={() => appendInput()} />
        </div>
        <div>
          <button disabled={isInvalid} style={isInvalid ? { backgroundColor: 'lightgrey' } : {}} className="open-button" onClick={() => onSubmit()}>Save</button>
        </div>
      </div>
    </div >
  );
}

export default Settings;
