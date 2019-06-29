import { PostPositionMap } from "./consts";
import TestHangul from "./testers/hangul";
import TestNumber from "./testers/number";
import TestKana from "./testers/kana";
import ParenthesisModifier from "./modifiers/parenthesis";

// boolean - found
// null - hit! undecidable -> use fallback
// undefined - no hit! -> next!
export type Tester = (str: string) => boolean | null | undefined;
export const default_testers: ReadonlyArray<Tester> = [
    TestHangul,
    TestNumber,
    TestKana,
];

export type Modifier = (str: string) => string;
export const default_modifiers: ReadonlyArray<Modifier> = [
    ParenthesisModifier,
];

export interface KoreanPostpositionProcessorOption {
    testers?: Tester[];
    modifiers?: Modifier[];
}

export class KoreanPostpositionProcessor {
    public modifiers: Modifier[];
    public testers: Tester[];

    public constructor(option?: KoreanPostpositionProcessorOption) {
        let modifiers = default_modifiers;
        let testers = default_testers;

        if (option !== undefined) {
            if (option.modifiers) {
                modifiers = option.modifiers;
            }
            if (option.testers) {
                testers = option.testers;
            }
        }

        this.modifiers = [...modifiers];
        this.testers = [...testers];
    }

    public get name() {
        return "korean-postposition";
    }

    public get type() {
        return "postProcessor";
    }

    public process(value: string /*, key: string, options: any*/ ) {
        const regex = /\[\[(?:을|를|이|가|은|는|(?:으로)|로|과|와|(?:이랑)|랑)\]\]/g;
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
            const existFinal = this.runTests(prevPart, postPosition);

            ret.push(PostPositionMap[postPosition][existFinal ? 0 : 1]);
            lastIndex = matches.index + matches[0].length;
        } while (true);
        if (lastIndex !== value.length) {
            ret.push(value.substring(lastIndex));
        }

        return ret.join("");
    }

    private runTests(prevPart: string, postPosition: string) {
        prevPart = this.applyModifiers(prevPart);
        let existFinal = PostPositionMap[postPosition].indexOf(postPosition) === 0;
        for (const test of this.testers) {
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

    private applyModifiers(prevPart: string) {
        for (const modifier of this.modifiers) {
            prevPart = modifier(prevPart);
        }

        return prevPart;
    }
}

const defaultInstance = new KoreanPostpositionProcessor();

export default defaultInstance;
