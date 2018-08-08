// [exist-final, non-exist-final]
type PostPositionPair = [string, string];
const postpostions: PostPositionPair[] = [
    ["을", "를"],
    ["이", "가"],
    ["은", "는"],
    ["으로", "로"],
    ["과", "와"],
    ["이랑", "랑"],
];

const PostPositionMap: {[key: string]: [string, string]} = {};

for (const val of postpostions) {
    PostPositionMap[val[0]] = val;
    PostPositionMap[val[1]] = val;
}

export { PostPositionMap };
