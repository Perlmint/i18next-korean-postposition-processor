// [exist-final, non-exist-final]
const maps: [string, string][] = [
    ["을", "를"],
    ["이", "가"],
    ["은", "는"],
    ["으로", "로"],
    ["과", "와"]
];

export default {
    name: 'korean-postposition',
    type: 'postProcessor',

    process(value: string /*, key: string, options: any*/ ) {
        const matches = value.match(/(?:[가-힣]|[0-9]+)\[\[(?:을|를|이|가|은|는|(?:으로)|로|과|와)\]\]/g);
        if (matches == null) {
            return value;
        }

        for (const match of matches) {
            const pieces = match.split("[[");
            const pre = pieces[0];
            let postposition = pieces[1].replace("[[", "").replace("]]", "");
            let existFinal: boolean;
            const preCode = pre.charCodeAt(0);
            if (preCode >= 44032) {
                const final = (preCode - 44032) % 28;
                existFinal = final !== 0;
            } else {
                // number
                const lastCh = pre[pre.length - 1];
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
                        const matched = pre.match(/0+$/) as RegExpMatchArray;
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

            for (const item of maps) {
                if (item.indexOf(postposition) === -1) {
                    continue;
                }

                value = value.replace(match, `${pre}${existFinal ? item[0] : item[1]}`);
                break;
            }
        }

        return value;
    }
};