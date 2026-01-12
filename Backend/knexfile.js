const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'db', 'database.sqlite')
    },
    migrations: {
      directory: path.join(__dirname, 'migrations')
    },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'db', 'database.sqlite')
    },
    migrations: {
      directory: path.join(__dirname, 'migrations')
    },
    useNullAsDefault: true
  }
};
