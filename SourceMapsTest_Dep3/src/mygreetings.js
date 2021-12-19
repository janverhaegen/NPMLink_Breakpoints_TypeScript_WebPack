var greetFrench = require('./greetingfrench')
var greetDutch = require('./greetingdutch')

exports.sayHello = function() {
    return "FR: " + greetFrench.sayHelloFrench() +
       "  --  NL: " + greetDutch.sayHelloDutch();
}