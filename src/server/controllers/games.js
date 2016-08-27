exports.index = (request, response) => {
  response.render('pages/home', {
    env: process.env.NODE_ENV
  });
};
