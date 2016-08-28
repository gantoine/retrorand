exports.home = (request, response) => {
  response.render('pages/home', {
    env: process.env.NODE_ENV
  });
};

exports.about = (request, response) => {
  response.render('pages/about', {
    env: process.env.NODE_ENV
  });
};
