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

  // Verifica si el repositorio ya existe en GitHub
  let repositoryExists = false;
  try {
    const response = await axios.get(`https://api.github.com/repos/${credentials.username}/${folderName}`, {
      headers: {
        Authorization: `token ${credentials.token}`
      }
    });
    if (response.status === 200) {
      repositoryExists = true;
      console.log(`Repository '${folderName}' already exists on GitHub.`);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No se encontró el repositorio en GitHub, se puede crear
      repositoryExists = false;
    } else {
      console.error('Error checking repository on GitHub:', error.response ? error.response.data : error.message);
      return;
    }
  }

  // Si el repositorio no existe en GitHub, intenta crearlo
  if (!repositoryExists) {
    try {
      const createResponse = await axios.post(
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

      if (createResponse.status === 201) {
        console.log(`Repository '${folderName}' created on GitHub.`);
      } else {
        console.log(`Failed to create repository: ${createResponse.status}`);
        return;
      }
    } catch (error) {
      console.error('Error creating repository on GitHub:', error.response ? error.response.data : error.message);
      return;
    }
  }

  // Configura la URL remota solo si no existe ya
  try {
    const remoteExists = await git.getRemotes(true);
    const remoteOriginExists = remoteExists.some(remote => remote.name === 'origin');

    if (!remoteOriginExists) {
      await git.addRemote('origin', `git@github.com:${credentials.username}/${folderName}.git`);
    }

    // Ahora, realiza el commit y el push
    await git.add('.');
    await git.commit('Initial commit');
    await git.push('origin', 'main');
    console.log('Code pushed to GitHub successfully.');
  } catch (err) {
    console.error('Error pushing code to GitHub:', err.message);
  }
}

run();
