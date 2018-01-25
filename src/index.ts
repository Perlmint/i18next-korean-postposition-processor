// [exist-final, non-exist-final]
const postpostions: [string, string][] = [
    ["을", "를"],
    ["이", "가"],
    ["은", "는"],
    ["으로", "로"],
    ["과", "와"]
];
const postPositionMap: {[key: string]: [string, string]} = {};
for (const val of postpostions) {
    postPositionMap[val[0]] = val;
    postPositionMap[val[1]] = val;
}

export default {
    name: 'korean-postposition',
    type: 'postProcessor',

    process(value: string /*, key: string, options: any*/ ) {
        const regex = /\[\[(?:을|를|이|가|은|는|(?:으로)|로|과|와)\]\]/g;
        let lastIndex = 0;
        let ret: string[] = [];
        do {
            const matches = regex.exec(value);
            if (matches == null) {
                break;
            }

            const prevPart = value.substring(lastIndex, matches.index);
            ret.push(prevPart);
            let postPosition = matches[0].replace("[[", "").replace("]]", "");
            let existFinal: boolean;
            const preCode = value.charCodeAt(matches.index - 1);
            if (preCode >= 44032) {
                const final = (preCode - 44032) % 28;
                existFinal = final !== 0;
            } else {
                // number
                const lastCh = value[matches.index - 1];
                switch (lastCh) {
                    case "1":
                    case "3":
                    case "6":
                    case "7":
                    case "8":
                        existFinal = true;
                        break;
                    case "2":
                    case "4":
                    case "5":
                    case "9":
                        existFinal = false;
                        break;
                    default:
                        const matched = prevPart.match(/0+$/)!;
                        const zeroLength = matched[0].length;
                        // 12 - 조, 20 - 해, 24 - 자, 32 - 구, 44 - 재, >=52 - 항하사, 아승기, 나유타, 불가사의, 무량대수
                        if (zeroLength === 12 || zeroLength === 20 || zeroLength == 24 || zeroLength === 32 || zeroLength == 44 || zeroLength >= 52) {
                            existFinal = false;
                        } else {
                            existFinal = true;
                        }
                        break;
                }
            }

            ret.push(postPositionMap[postPosition][existFinal ? 0 : 1]);
            lastIndex = matches.index + matches[0].length;
        } while (true);
        if (lastIndex != value.length) {
            ret.push(value.substring(lastIndex));
        }

        return ret.join("");
    }
};
