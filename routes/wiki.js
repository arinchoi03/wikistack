var express = require('express');
var router = express.Router();
var models = require("../models");
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
  res.redirect('/')
});

router.post('/', function(req, res, next) {
  // console.log('req.body', req.body)

  // .Build builds the page according to the Page schema

  Page.create({
    title: req.body.title,
    content: req.body.content
  }).then(function(page){
      if (!page) {
        var error = new Error('error! no page')
        error.status = 404;
        throw error;
      }
      res.redirect('/')
    })
    .catch(function(err) {
      next(err)
    })
});

router.get('/add', function(req, res, next) {
  res.render('addpage')
});

router.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
      urlTitle : req.params.urlTitle
    }
  })
  .then(function(page) {
    console.log(page.title)
    res.render('wikipage', {title: page.title, content: page.content})
  })
  .catch(next)
});

module.exports = router
