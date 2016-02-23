# setup instructions josh #

## please install editor-config:
editorconfig helps maintain equal formating between all people participating in project.

just `super+shift+p`-->`install package` --> `editorconfig`

the .editorconfig file in the root of the project will standarize our settings (spaces vs tabs, width etc.)
not a __big__ deal but it does matter when I'm trying to diff view stuff and there's 200 diffs although only spaces changed between 
our commits.


# dev installation instructions
git fetch
git checkout `branch`
git pull
npm install
createdb spotifeye && run psql
cd server && knex migrate:latest

# jshint all files
from root of project run:
`grunt jshint`


