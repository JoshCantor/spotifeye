# todo #
1. removed cached files from repo.

# cron instructions #
* * * * *

The first asterisk is for specifying the minute of the run (0-59)
The second asterisk is for specifying the hour of the run (0-23)
The third asterisk is for specifying the day of the month for the run (1-31)
The fourth asterisk is for specifying the month of the run (1-12)
The fifth asterisk is for specifying the day of the week (where Sunday is equal to 0, up to Saturday is equal to 6)

`env EDITOR=nano crontab -e`

2 * * * * /usr/local/bin/node /Users/Op/Documents/gSchool/proj/angular-spotifeye-josh/spotifeye/echonest/echonest.js

### possible fix if your macs env is not exporting NODE_PATH ###

`*/1 * * * * NODE_PATH=/usr/local/lib/node_modules PATH=/opt/local/bin:ABC:XYZ /Users/Op/Documents/gSchool/proj/angular-spotifeye-josh/spotifeye/echonest/echonest.js`

# setup instructions #

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

# database clear instructions
1. connect to psql
2. \c spotifeye
3. drop table knex_migrations, knex_migrations_lock, savedtracks, tracks, users;
4. cd /server/db;
5. knex migrate:latest

