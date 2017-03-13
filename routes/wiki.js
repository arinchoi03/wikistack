var express = require('express');
var router = express.Router();
var models = require("../models");
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
  Page.findAll()
    .then(function(pages) {
      res.render('index', {pages: pages})
    })
  next();
});

router.post('/', function(req, res, next) {
  // query to find the author id, if one does not exist we make a new user with a new id
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
  .then(function(values) {
    var user = values[0];
    var page = Page.build({
      title: req.body.title,
      content: req.body.content
    });

    return page.save().then(function(page) {
      return page.setAuthor(user);
    });
  })
  .then(function(page) {
    res.redirect(page.route);
  })
  .catch(next);

  // THIS WAS WHAT WE BUILT...
  // var author = req.body.authorName;
  // var user = User.findOne({
  //   where: {
  //     name: author
  //   }
  // })
  // .then (function(user) {
  //   if (!user) {
  //     // create user
  //     var user = User.create({
  //       name: author,
  //       email: req.body.authorEmail
  //     });
  //   }
  //   return user;
  //   })

  // // .Build builds the page according to the Page schema
  // Page.create({
  //   title: req.body.title,
  //   content: req.body.content,
  //   authorId: user.id
  // }).then(function(page){
  //     if (!page) {
  //       var error = new Error('error! no page')
  //       error.status = 404;
  //       throw error;
  //     }
  //     res.redirect(page.route);
  //   })
  //   .catch(function(err) {
  //     next(err)
  //   });
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
      urlTitle : req.params.urlTitle
    }, 
    include: [{model: User, as: 'author'}]
  })
  .then(function(page) {
    res.render('wikipage', {page: page})
  })
  .catch(next)
});

router.get('/users', function(req, res, next) {
  User.findAll({})
  .then(function(users) {
    res.render('author', {authors: users});
  })
}) 

module.exports = router
