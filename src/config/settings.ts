/**
 * dev : 로컬 컴퓨터 개발
 * else : azure app service
 */
const ENV_MODE = 'dev';

var typeOrmDb1 = {
  type: '',
  host: '',
  port: 3306,
  username: '',
  password: '',
  database: '',
  synchronize: false,
  logging: false,
};
const cryptoKey = 'cryptoKeySample@#@$%#%$#@!!';
const jwtKey = 'jwtKeySample@#@$%#%$#@!!';

if (ENV_MODE === 'dev') {
  typeOrmDb1.type = 'mysql';
  typeOrmDb1.host = '안.알.야.줌';
  typeOrmDb1.port = 3306;
  typeOrmDb1.username = '안.알.야.줌';
  typeOrmDb1.password = '안.알.야.줌';
  typeOrmDb1.database = '안.알.야.줌';
  typeOrmDb1.synchronize = false;
  typeOrmDb1.logging = false;
} else {
  typeOrmDb1.type = 'mysql';
  typeOrmDb1.host = '안.알.야.줌';
  typeOrmDb1.port = 3306;
  typeOrmDb1.username = '안.알.야.줌';
  typeOrmDb1.password = '안.알.야.줌';
  typeOrmDb1.database = '안.알.야.줌';
  typeOrmDb1.synchronize = false;
  typeOrmDb1.logging = false;
}

exports.configSettings = { typeOrmDb1, ENV_MODE, cryptoKey, jwtKey };
