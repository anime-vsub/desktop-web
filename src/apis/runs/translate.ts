import { post } from "src/logic/http";

export function translateText(text: string[], from: string, to: string) {
  return post("https://translate.google.it/translate_a/single",
  `client=gtx&dt=t&dt=bd&dj=1&source=input&q=${encodeURIComponent(text.join("\n"))}&sl=${from}&tl=${to}&hl=en`,{
      "content-type": "application/x-www-form-urlencoded",
  }).then(res => JSON.parse(res.data )as  {
    sentences: {
        trans: string;
        orig: string;
        backend: number;
        model_specification: {}[];
        translation_engine_debug_info: ({
            model_tracking: {
                checkpoint_md5: string;
                launch_doc: string;
            };
            has_untranslatable_chunk?: undefined;
        } | {
            has_untranslatable_chunk: boolean;
            model_tracking?: undefined;
        })[];
    }[];
    src: string;
    spell: {};
}).then(data => data.sentences.map(item => item.trans))
}
