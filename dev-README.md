# setup instructions josh #

git fetch
git checkout `branch`
git pull
npm install
createdb spotifeye && run psql
cd server && knex migrate:latest


