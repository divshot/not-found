var notFound = require('../');
var connect = require('connect');
var request = require('supertest');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var mkdirp = require('mkdirp');
var rmdir = require('rmdir');

describe.only('not found middleware', function() {
  it('serves a custom 404 page', function (done) {
    fs.writeFileSync('error.html', 'error');
    
    var app = connect()
      .use(notFound({
        file: process.cwd() + '/error.html'
      }));
    
    request(app)
      .get('/asdfasdf')
      .expect('error')
      .expect(404)
      .end(function (err) {
        fs.unlinkSync('error.html');
        
        if (err) throw err;
        done();
      });
  });
  
  it('serves a custom 404 page when the root is set to a sub-directory, relative to the root directory', function (done) {
    var rootDir = '.tmp';
    
    mkdirp.sync(rootDir);
    fs.writeFileSync(rootDir + '/error.html', 'error page');
    
    var app = connect()
      .use(notFound({
        file: path.join(process.cwd(), rootDir, 'error.html')
      }));
    
    request(app)
      .get('/')
      .expect(404)
      .expect(function (data) {
        expect(data.res.statusCode).to.equal(404);
        expect(data.res.text).to.equal('error page');
      })
      .end(function (err) {
        rmdir(rootDir, function (errOnRemove) {
          done(err || errOnRemove);
        });
      });
  });
  
  it('skips the middleware if there is no filepath', function (done) {
    var app = connect()
      .use(notFound());
    
    request(app)
      .get('/')
      .expect(404)
      .end(done);
  });
  
  it('skips the middleware if the file is not found', function (done) {
    var app = connect()
      .use(notFound({
        file: __dirname + '/qwer.html'
      }));
    
    request(app)
      .get('/')
      .expect(404)
      .end(done);
  });
  
  it('proxies a remote 404 page', function (done) {
    var remoteErrorPageUrl = 'http://localhost:4567';
    
    var app = connect()
      .use(notFound({
        file: remoteErrorPageUrl
      }));
    
    request(app)
      .get('/not-found')
      .expect(404)
      .end(done);
  });
  
  it('overrides the file exists method', function (done) {
    fs.writeFileSync('error.html', 'error');
    
    var existsCalled = false;
    var app = connect()
      .use(notFound({
        file: process.cwd() + '/error.html',
        exists: function () {
          existsCalled = true;
          return true
        }
      }));
    
    request(app)
      .get('/asdfasdf')
      .expect('error')
      .expect(404)
      .expect(function () {
        expect(existsCalled).to.equal(true);
      })
      .end(function (err) {
        fs.unlinkSync('error.html');
        done(err);
      });
  });
});