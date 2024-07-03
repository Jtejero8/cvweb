const simpleGit = require('simple-git');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Crear una interfaz para leer la entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Preguntar al usuario su nombre de usuario y contraseña de GitHub
rl.question('GitHub Username: ', (username) => {
  rl.question('GitHub Password: ', (password) => {
    const remote = `https://${username}:${password}@github.com/${username}/new-repo.git`;

    // Inicializar el repositorio git
    const git = simpleGit();

    // Crear un nuevo repositorio y subirlo a GitHub
    git.init()
      .then(() => git.addRemote('origin', remote))
      .then(() => git.add('.'))
      .then(() => git.commit('Initial commit'))
      .then(() => git.push('origin', 'master'))
      .then(() => {
        console.log('Repository successfully created and pushed to GitHub.');
        rl.close();
      })
      .catch((err) => {
        console.error('Error:', err);
        rl.close();
      });
  });
});
