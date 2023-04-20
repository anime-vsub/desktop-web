import { decodeVuigheM3U8 } from "./decode-vuighe-m3u8"

describe("decode-vuighe-m3u8", () => {
  test("should decode the m3u8 Tonikaku Kawaii", () => {
    expect(
      decodeVuigheM3U8(
        {
          "1": "EYY]^^D@LNICNB@@]ALTAD^YNOKNKIHIKOHOLOINOKNKIHIKOHOLOI@XEL^Ej_B",
        },
        138345
      )
    ).toEqual([
      {
        play: false,
        server: "1",
        url: "https://s861.imacdn.com/m5/playlist/93cbf35cfd776e86df9be83ba928bd65/93cbf35cfd776e86df9be83ba928bd65.m3u8?hash=Gro",
      },
    ])
  })
})
