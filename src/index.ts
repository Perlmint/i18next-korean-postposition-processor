import { PostPositionMap } from "./consts";
import TestHangul from "./hangul";
import TestNumber from "./number";
import TestKana from "./kana";

// boolean - found
// null - hit! undecidable -> use fallback
// undefined - no hit! -> next!
export type Tester = (str: string) => boolean | null | undefined;
const tests: Tester[] = [
    TestHangul,
    TestNumber,
    TestKana,
];

export function appendTester(tester: Tester, prior = false) {
    const found = tests.indexOf(tester);
    if (prior) {
        if (found !== -1) {
            tests.splice(found, 1);
        }
        tests.unshift(tester);
    } else {
        if (found === -1) {
            tests.push(tester);
        }
    }
}

function runTests(prevPart: string, postPosition: string) {
    let existFinal = PostPositionMap[postPosition].indexOf(postPosition) === 0;
    for (const test of tests) {
        const testResult = test(prevPart);
        if (testResult === undefined) {
            continue;
        } else {
            if (testResult !== null) {
                existFinal = testResult;
            }
            break;
        }
    }

    return existFinal;
}

export default {
    name: "korean-postposition",
    type: "postProcessor",

    process(value: string /*, key: string, options: any*/ ) {
        const regex = /\[\[(?:을|를|이|가|은|는|(?:으로)|로|과|와)\]\]/g;
        let lastIndex = 0;
        const ret: string[] = [];
        do {
            const matches = regex.exec(value);
            if (matches === null) {
                break;
            }

            const prevPart = value.substring(lastIndex, matches.index);
            ret.push(prevPart);
            const postPosition = matches[0].replace("[[", "").replace("]]", "");
            // default value - template input
            const existFinal = runTests(prevPart, postPosition);

            ret.push(PostPositionMap[postPosition][existFinal ? 0 : 1]);
            lastIndex = matches.index + matches[0].length;
        } while (true);
        if (lastIndex !== value.length) {
            ret.push(value.substring(lastIndex));
        }

        return ret.join("");
    },
};
