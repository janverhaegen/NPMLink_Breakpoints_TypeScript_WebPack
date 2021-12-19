import {sayHelloFrench}  from './greetingfrench.js'
import {sayHelloDutch}  from './greetingdutch.js'

export function sayHello() {
    return "FR: " + sayHelloFrench() +
       "  --  NL: " + sayHelloDutch();
}