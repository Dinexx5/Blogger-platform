export const transporterSettings = {
  host: 'smtp.mail.ru',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_LOGIN,
    pass: process.env.MAIL_PASS,
  },
};
