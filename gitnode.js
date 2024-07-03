const simpleGit = require('simple-git');
const readline = require('readline');
const path = require('path');

// Crear una interfaz para leer la entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Obtener el nombre del directorio actual
const repoName = path.basename(process.cwd());

// Preguntar al usuario su nombre de usuario y contraseña de GitHub
rl.question('GitHub Username: ', (username) => {
  rl.question('GitHub Password: ', (password) => {
    const remote = `https://${username}:${password}@github.com/${username}/${repoName}.git`;

    // Inicializar el repositorio git
    const git = simpleGit();

    // Verificar si el remoto 'origin' ya existe
    git.getRemotes(true, (err, remotes) => {
      if (err) {
        console.error('Error getting remotes:', err);
        rl.close();
        return;
      }

      const originRemote = remotes.find(remote => remote.name === 'origin');

      const addOrUpdateRemote = originRemote ? git.remote(['set-url', 'origin', remote]) : git.addRemote('origin', remote);

      addOrUpdateRemote
        .then(() => git.add('.'))
        .then(() => git.commit('Initial commit'))
        .then(() => git.branch(['-M', 'main']))  // Renombrar la rama a main
        .then(() => git.push('origin', 'main'))  // Empujar a la rama main
        .then(() => {
          console.log(`Repository '${repoName}' successfully created and pushed to GitHub.`);
          rl.close();
        })
        .catch((err) => {
          console.error('Error:', err);
          rl.close();
        });
    });
  });
});
