const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'Ligeti',
  host: 'localhost',
  database: 'english_database',
  password: '1',
  port: 5432,
});
