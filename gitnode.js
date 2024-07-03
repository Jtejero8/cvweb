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

// Inicializar el repositorio git
const git = simpleGit();

async function run() {
  try {
    // Verificar si el remoto 'origin' ya existe
    const remotes = await git.getRemotes(true);
    const originRemote = remotes.find(remote => remote.name === 'origin');

    // URL remota SSH
    const remote = `git@github.com:Jtejero8/${repoName}.git`;

    if (originRemote) {
      await git.remote(['set-url', 'origin', remote]);
    } else {
      await git.addRemote('origin', remote);
    }

    await git.add('.');
    await git.commit('Initial commit');
    await git.branch(['-M', 'main']);  // Renombrar la rama a main
    await git.push('origin', 'main');  // Empujar a la rama main

    console.log(`Repository '${repoName}' successfully created and pushed to GitHub.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    rl.close();
  }
}

run();
