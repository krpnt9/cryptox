'use strict';

var Cryptox = require("../index.js");
var chai = require("chai");
var nock = require("nock");
var moment = require("moment");
var jf = require("jsonfile");

var expect = chai.expect;
chai.use(require("chai-json-schema"));

var config = require("./helpers/config.js");
var schema = require("./helpers/jsonSchemas.js");
var util = require("./helpers/util.js");

var slug = "bitstamp";

var api = {
    private: {
        host: "https://www.bitstamp.net",
        path: {
            balance: "/api/balance/",
            open_orders: "api/open_orders/",
            user_transactions: "api/user_transactions/"
        }
    },
    public: {
        host: "https://www.bitstamp.net",
        path: {
            order_book: "/api/order_book/",
            ticker: "/api/ticker/",
            transactions: "/api/user_transactions/"
        }
    }
};

describe("Integration Test " + slug + ":", function () {
    var nockServer, mockResponseFilename;
    var privateCryptox, publicCryptox, cryptox;
    var myKey, mySecret, myUsername, apiKeys;
    try {       // load private keys (if exists)
        apiKeys = require("./helpers/private_keys.js");
        myKey = apiKeys.bitstamp.key || "dummy";
        mySecret = apiKeys.bitstamp.secret || "dummy";
        myUsername = apiKeys.bitstamp.username || "dummy";
    }
    catch(err) {
        myKey = mySecret = myUsername = "dummy";
    }

    describe("getRate", function () {

        before(function() {
            publicCryptox = new Cryptox("bitstamp");
        });

        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(api.public.host)
                .get(api.public.path.ticker)
                .reply(418, "I'm a teapot");
            publicCryptox.getRate({pair: "XBTUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return expected mock result", function (done) {
            nockServer = nock("https://www.bitstamp.net")
                .get("/api/ticker/")
                .replyWithFile(200, __dirname + "/helpers/bitstamp/" + "bitstamp-getRate_MockApiResponse-ticker.json");
            publicCryptox.getRate({}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/bitstamp/" + "bitstamp-getRate_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return the rate with valid JSON schema", function (done) {
            nock.cleanAll();
            publicCryptox.getRate({pair: "XBTUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.getRate);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });


    describe("getTicker", function () {

        before(function() {
            publicCryptox = new Cryptox("bitstamp");
        });

        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(api.public.host)
                .get(api.public.path.ticker)
                .reply(418, "I'm a teapot");
            publicCryptox.getTicker({pair: "XBTUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(api.public.host)
                .get(api.public.path.ticker)
                .replyWithFile(200, __dirname + "/helpers/bitstamp/" + "bitstamp-getTicker_MockApiResponse-ticker.json");
            publicCryptox.getTicker({pair: "XBTUSD"}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/bitstamp/" + "bitstamp-getTicker_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return the ticker with valid JSON schema", function (done) {
            nock.cleanAll();
            publicCryptox.getTicker({pair: "XBTUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.getTicker);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });


    describe("getOrderBook", function () {

        before(function() {
            publicCryptox = new Cryptox("bitstamp");
        });

        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(api.public.host)
                .get(api.public.path.order_book)
                .reply(418, "I'm a teapot");
            publicCryptox.getOrderBook({pair: "XBTUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(api.public.host)
                .get(api.public.path.order_book)
                .replyWithFile(200, __dirname + "/helpers/bitstamp/" + "bitstamp-getOrderBook_MockApiResponse-order_book.json");
            publicCryptox.getOrderBook({pair: "XBTUSD"}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/bitstamp/" + "bitstamp-getOrderBook_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return the order book with valid JSON schema", function (done) {
            nock.cleanAll();
            publicCryptox.getOrderBook({pair: "XBTUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.getOrderBook);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });


    describe("getFee", function () {

        before(function() {
            privateCryptox = new Cryptox("bitstamp", {key: myKey, secret: mySecret, username: myUsername});
        });

        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(api.public.host)
                .get(api.public.path.depth)
                .reply(418, "I'm a teapot");
            privateCryptox.getFee({pair: "XBTUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(api.private.host)
                .post(api.private.path.balance)
                .replyWithFile(200, __dirname + "/helpers/bitstamp/" + "bitstamp-getFee_MockApiResponse-balance.json");
            privateCryptox.getFee({pair: "XBTUSD"}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/bitstamp/" + "bitstamp-getFee_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return "+ ((myKey === "dummy") ? "API key error" : "the fee") + " with valid JSON schema", function (done) {
            nock.cleanAll();
            privateCryptox.getFee({pair: "XBTUSD"}, function (err, result) {
                var sch = myKey === "dummy" ? schema.errorResult : schema.getFee;
                expect(result).to.be.jsonSchema(sch);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });

    describe("getTransactions", function () {
      var method  = "getTransactions";
      var options = {};
      before(function() {
          cryptox = new Cryptox(slug, {key: myKey, secret: mySecret, username: myUsername});
          publicCryptox = new Cryptox(slug);

      });
      beforeEach(function () {
        nock.cleanAll();
      });
      it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(api.private.host)
                .filteringPath(function(path) {
                    return api.private.path.transactions;
                })
                .post(api.private.path.transactions)
                .reply(418, "I'm a teapot");
            options = {};
            util.expectError(cryptox, method, options, done);
        });
        it("should return authorization error with valid JSON schema", function (done) {
            options = {};
            util.expectError(publicCryptox, method, options, done);
        });
        it("should return the transactions" +((myKey === "dummy") ? " <- skipped since API key is dummy" : "") , function (done) {
            if (myKey === "dummy")
                done();
            else {
                options = {};
                util.expectValidSchema(cryptox, method, options, done);
            }
        });
        it("should return expected mock result", function (done) {
            var helpersDirname = __dirname + "/helpers/" + cryptox.properties.slug + "/";
            nockServer = nock(api.private.host)
                .filteringPath(function(path) {
                    return api.private.path.transactions;
                })
                .post(api.private.path.transactions)
                .replyWithFile(200, helpersDirname + "bitstamp-getTransactions_MockApiResponse-user_transactions.json");
            options = {writeMockResponseFile: false};   // this option flag is only used for generating the mockResponseFile for the first time (set to true)
            util.expectMockResult(cryptox, method, options, done);
        });
        it("should accept parameter 'limit' and return the transactions" +((myKey === "dummy") ? " <- skipped since API key is dummy" : "") , function (done) {
            if (myKey === "dummy")
              done();
            else {
              options = {limit: 10};
              util.expectValidSchema(cryptox, method, options, done);
            }
        });
        it("should accept parameter 'offset' and return the transactions" +((myKey === "dummy") ? " <- skipped since API key is dummy" : "") , function (done) {
            if (myKey === "dummy")
                done();
            else {
                options = {offset: 3};
                util.expectValidSchema(cryptox, method, options, done);
            }
        });
        it("should accept parameter 'sort' and return the transactions" +((myKey === "dummy") ? " <- skipped since API key is dummy" : "") , function (done) {
            if (myKey === "dummy")
                done();
            else {
                options = {sort: "asc", limit: 3};
                util.expectValidSchema(cryptox, method, options, done);
            }
        });
    });

    describe("getBalance", function () {

        before(function() {
            privateCryptox = new Cryptox("bitstamp", {key: myKey, secret: mySecret, username: myUsername});
        });

        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(api.public.host)
                .post(api.private.path.balance)
                .reply(418, "I'm a teapot");
            privateCryptox.getBalance({pair: "XBTUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(api.private.host)
                .post(api.private.path.balance)
                .replyWithFile(200, __dirname + "/helpers/bitstamp/" + "bitstamp-getBalance_MockApiResponse-balance.json");
            privateCryptox.getBalance({}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/bitstamp/" + "bitstamp-getBalance_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return "+ ((myKey === "dummy") ? "API key error" : "the balance") + " with valid JSON schema", function (done) {
            nock.cleanAll();
            privateCryptox.getBalance({}, function (err, result) {
                var sch = myKey === "dummy" ? schema.errorResult : schema.getBalance;
                expect(result).to.be.jsonSchema(schema.getBalance);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });
});
