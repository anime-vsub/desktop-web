import { getEpisodesMyAnimeList } from "./episodes"

describe("episodes", () => {
  describe("getEpisodesMyAnimeList", () => {
    test("should work in all of one page", async () => {
      expect(
        await getEpisodesMyAnimeList(
          "https://myanimelist.net/anime/41389/Tonikaku_Kawaii"
        ).then((items) =>
          items.map((item) => {
            delete item.japanese
            return item
          })
        )
      ).toEqual([
        {
          number: "1",
          name: "Marriage",
          time: "Oct 3, 2020",
          average: "Oct 3, 2020",
        },
        {
          number: "2",
          name: "The First Night",
          time: "Oct 10, 2020",
          average: "Oct 10, 2020",
        },
        {
          number: "3",
          name: "Sisters",
          time: "Oct 17, 2020",
          average: "Oct 17, 2020",
        },
        {
          number: "4",
          name: "Promise",
          time: "Oct 24, 2020",
          average: "Oct 24, 2020",
        },
        {
          number: "5",
          name: "Rings",
          time: "Oct 31, 2020",
          average: "Oct 31, 2020",
        },
        {
          number: "6",
          name: "News",
          time: "Nov 7, 2020",
          average: "Nov 7, 2020",
        },
        {
          number: "7",
          name: "Trip",
          time: "Nov 14, 2020",
          average: "Nov 14, 2020",
        },
        {
          number: "8",
          name: "Parents",
          time: "Nov 21, 2020",
          average: "Nov 21, 2020",
        },
        {
          number: "9",
          name: "Daily Life",
          time: "Nov 28, 2020",
          average: "Nov 28, 2020",
        },
        {
          number: "10",
          name: "The Way Home",
          time: "Dec 5, 2020",
          average: "Dec 5, 2020",
        },
        {
          number: "11",
          name: "Friends",
          time: "Dec 12, 2020",
          average: "Dec 12, 2020",
        },
        {
          number: "12",
          name: "Husband and Wife",
          time: "Dec 19, 2020",
          average: "Dec 19, 2020",
        },
        {
          number: "13",
          name: "SNS",
          time: "N/A",
          average: "N/A",
        },
      ])
    })

    test("should search by offset", async () => {
      const diff = await getEpisodesMyAnimeList(
        "https://myanimelist.net/anime/235/Detective_Conan",
        100
      )

      expect(diff.length).toBe(100)
    })
  })
})
