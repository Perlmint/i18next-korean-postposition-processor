import "mocha";
import { assert } from "chai";
import { KoreanPostpositionProcessor } from "../src";
import i18next from "i18next";

describe("postposition processor with i18next", () => {
    const i18next_config = {
        lng: "ko",
        postProcess: ["korean-postposition"],
        resources: {
            ko: {
                translation: {
                    text: "{{some_value}}[[를]] 수정했다.",
                },
            },
        },
    };

    it("should work without option", () => {
        i18next.use(new KoreanPostpositionProcessor());
        i18next.init(i18next_config);
        assert(i18next.t("text", { some_value: "버그"}), "버그를 수정했다.");
    });
});
