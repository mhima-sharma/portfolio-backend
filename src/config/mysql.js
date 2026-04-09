import 'dotenv/config';
import mysql from 'mysql2/promise';
import { getRequiredEnv } from './env.js';

const buildSslConfig = (parsedUrl) => {
  const sslAccept = parsedUrl.searchParams.get('sslaccept');

  if (!sslAccept) {
    return undefined;
  }

  if (sslAccept === 'strict') {
    return {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    };
  }

  if (sslAccept === 'accept_invalid_certs') {
    return {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false,
    };
  }

  return {
    minVersion: 'TLSv1.2',
  };
};

const buildMysqlConfig = () => {
  const databaseUrl = getRequiredEnv('DATABASE_URL');
  const parsedUrl = new URL(databaseUrl);

  return {
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || 3306),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace(/^\//, ''),
    ssl: buildSslConfig(parsedUrl),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
};

const mysqlPool = mysql.createPool(buildMysqlConfig());

export const query = async (sql, params = []) => {
  const [rows] = await mysqlPool.execute(sql, params);
  return rows;
};

export default mysqlPool;
