// @flow

/**
 * Primitive Types
 */

function test(x: number, y: string, z: boolean) {
    console.log(x);
    console.log(y);
    console.log(z);
}
test(123, "this is string", false);


"foo" + "bar";
"foo" + 10;
"foo" + {}; // error
"foo" + []; // error

"foo" + String({});
"foo" + [].toString();
"" + JSON.stringify({});

function testNull(n: null) {}
testNull(null); // work
testNull(undefined); // error

function testVoid(n: void) {}
testVoid(null); // error
testVoid(undefined); // work


// Maybe types
// types can also be null or void.
function testMaybeString(s: ? string) {}
testMaybeString("abc"); // work
testMaybeString(null); // work
testMaybeString(undefined); // work
testMaybeString(); // work


// Optional object properties
// In addition to their set type, these optional parameters can either be void or omitted altogether. However, they cannot be null.
function testObject(o: { optProp ? : string }) {}
testObject({ foo: "bar" }); // work
testObject({ foo: undefined }); // work
testObject({ foo: null }); // error ?
testObject({}); // work


// Function parameters with defaults
function testDefaultParam(d: string = "default") {}
testDefaultParam("foo"); // work
testDefaultParam(null); // error
testDefaultParam(undefined); // work
testDefaultParam(); // work


/**
 * Literal types
 */
// primitive types
function testLiteralTwo(v: 2) {}
testLiteralTwo(2); // work
testLiteralTwo(3); // error
testLiteralTwo("2"); // error
testLiteralTwo(undefined); // error
testLiteralTwo(null); // error
testLiteralTwo(); // error

// union types
function testUnionTypes(name: "abc" | "def" | "ghi") {}
testUnionTypes("abc"); // work
testUnionTypes("ghi"); // work
testUnionTypes("xxx"); // error


/**
 * "mixed" types
 */
function square(n: number) {
    return n * n;
}

function stringifyBasicValue(value: string | number | boolean) {
    return '' + value;
}
stringifyBasicValue("aaa"); // work
stringifyBasicValue(123); // work
stringifyBasicValue(true); // work

function identity < T > (value: T): T {
    return value;
}

function undefinedType(v: mixed) {}
undefinedType("123"); // work
undefinedType(123); // work
undefinedType(null); // work
undefinedType({}); // work



function undefinedType2(v: mixed) {
    return "" + v;
}
undefinedType2("abc");

function undefinedType3(v: mixed) {
    if (typeof(v) === 'string') {
        return "" + v;
    } else {
        return "";
    }
}
undefinedType3("hoge");


/**
 * "any" types		Should be avoided whenever possible.
 */
function add(one: any, two: any): number {
    return one + two;
}
add(1, 2); // work
add("1", "2"); // work
add({}, []); // work


/**
 * "?" + types
 * accept number | null | undefined
 */
function testMaybeNumber(value: ? number) {}
testMaybeNumber(123); // work
testMaybeNumber(); // work
testMaybeNumber(undefined); // work
testMaybeNumber(null); // work
testMaybeNumber("123"); // error

function testMaybeNumber1(value: ? number) {
    // If you want to use number, you need to check value type.
    if (typeof(value) === 'number') {
        return value * 5;
    }
}

/**
 * Variable types
 * var
 * let
 * const
 */
var varVal = 1;
let letVal = 1;
const constVal = 1;
varVal = 2; // work
letVal = 2; // work
constVal = 2; // error

const foo = 1;
const bar: number = 2;

var varVal2 = 1;
let letVal2 = 1;
var varValType: number = 2;
let letValType: number = 2;

let fooWithType: number = 1;
fooWithType = 2; // work
fooWithType = "3"; // error

// Reassigning variables
{
    let foo = 42;
    if (Math.random()) foo = true;
    if (Math.random()) foo = "hello";
    let isOneOf: string | number | boolean = foo; // work
}

{
    let foo = 42;
    let isNubmer: number = foo; // work
    foo = true;
    let isBoolean: boolean = foo; // work
    foo = "bar";
    let isString: string = foo; // work
}

{
    // If statements, functions, and other conditionally run code can all prevent Flow from being able to figure out precisely what a type will be.

    let foo = 42;

    function mutate() {
        foo = true;
        foo = "bar";
    }

    mutate();
    let isString: string = foo; // error
}

/**
 * Function types
 */

{
    function concat(a: string, b: string): string {
        return a + b;
    }
    concat("foo", "bar"); // work
    concat(true, "bar"); // error

    let retValNumber: number = concat("foo", "bar"); // error

}

{
    function func(str, bool, ...nums) {}

    function funcFlowVersion(str: string, bool: boolean, ...nums: Array < number > ): void {}

    // Arrow function

    let method = (str, bool, ...nums) => {}

    let methodFlowVersion = (str: string, bool: boolean, ...nums: Array < number > ): void => {}

    // callback
    function funcCallback(callback: (error: Error | null, value: string | null) => void) {}

    // function parameters

    function func1(param1: string, param2: number): void {}

    // optional parameters

    function func2(param1 ? : string): void {}
    func2("abc"); // work
    func2(); // work
    func2(null); // error
    func2(undefined); // work

    // rest paramter

    function funcRest(...nums: Array < number > ) {}
    funcRest(); // work
    funcRest(1); // work
    funcRest(1, 2); // work
    funcRest(1, 2, 3); // work
    funcRest(1, "2", 3); // error
    funcRest(undefined); // error
    funcRest(null); // error

    // function return type

    function funcReturn(): boolean { return true; }
    let funcRetBool: boolean = funcReturn(); // work
    let funcRetString: string = funcReturn(); // error
    let funcRetNUmber: number = funcReturn(); // error

    function funcReturn(): string { return true; } // error


    // function type

    function funcReturnMixed(func: () => mixed) {}

    // Function type -
    // Function is unsafe and should be avoided.
    // For example, the following code will not report any errors:

    function testFunctionType(func: Function) {
        func(1, 2);
        func("1", "2");
        func({}, []);
    }
    testFunctionType((a: number, b: number) => {});


}