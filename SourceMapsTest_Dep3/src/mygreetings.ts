import { sayHelloFrench } from "./greetingfrench";
import { sayHelloDutch } from "./greetingdutch";

export function sayHello() {
    return "FR: " + sayHelloFrench() + 
     "  --  NL: " + sayHelloDutch();
}
