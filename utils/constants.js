const allowlist = [
  'https://api.meltywd.students.nomoredomains.icu',
  'http://api.meltywd.students.nomoredomains.icu',
  'https://meltywd.students.nomoredomains.icu',
  'http://meltywd.students.nomoredomains.icu',
  'http://localhost:3000',
];

const mongodbUrl = 'mongodb://localhost:27017/blogbd';

const mongodbSetting = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const limiterSetting = {
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 500, // можно совершить максимум 100 запросов с одного IP
};

module.exports = {
  allowlist,
  mongodbUrl,
  mongodbSetting,
  limiterSetting,
};
