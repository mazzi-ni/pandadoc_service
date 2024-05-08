export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  pandadoc: {
    apikey: process.env.APIKEY,
    doc: 'https://api.pandadoc.com/public/v1/documents',
    templete: 'https://api.pandadoc.com/public/v1/templetes',
  },
  db: {
    port: +process.env.PORT_DB || 5432,
    password: process.env.POSTGRES_PASSWORD,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
  },
});
