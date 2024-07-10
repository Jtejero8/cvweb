const simpleGit = require('simple-git');
const { execSync } = require('child_process');
const path = require('path');
const inquirer = require('inquirer');
const axios = require('axios');

async function run() {
  const git = simpleGit();

  const folderName = path.basename(process.cwd());

  // Pregunta por las credenciales de GitHub (solo el nombre de usuario y token)
  const credentials = await inquirer.prompt([
    { type: 'input', name: 'username', message: 'GitHub username:' },
    { type: 'password', name: 'token', message: 'GitHub token:', mask: '*' }
  ]);

  // Intenta crear el repositorio en GitHub
  try {
    const response = await axios.post(
      'https://api.github.com/user/repos',
      {
        name: folderName,
        private: false
      },
      {
        auth: {
          username: credentials.username,
          password: credentials.token
        }
      }
    );

    if (response.status === 201) {
      console.log(`Repository '${folderName}' created on GitHub.`);
    } else {
      console.log(`Failed to create repository: ${response.status}`);
      return;
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.log(`Repository '${folderName}' already exists on GitHub.`);
    } else {
      console.error('Error creating repository on GitHub:', error.response ? error.response.data : error.message);
      return;
    }
  }

  // Configura la URL remota y realiza el push usando SSH
  try {
    await git.init();
    await git.add('.');
    await git.commit('Initial commit');
    await git.addRemote('origin', `git@github.com:${credentials.username}/${folderName}.git`);
    await git.push('origin', 'main');
    console.log('Code pushed to GitHub successfully.');
  } catch (err) {
    console.error('Error pushing code to GitHub:', err.message);
  }
}

run();
