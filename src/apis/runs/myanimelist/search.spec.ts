import { getAmimeMyAnimeList } from "./search"

describe("episodes", () => {
  describe("getAmimeMyAnimeList", () => {
    test("Gate: Jieitai Kanochi nite, Kaku Tatakaeri", async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const anime = (
        await getAmimeMyAnimeList(
          "Cổng chiến tranh",
          "GATE, Gate: Thus the JSDF Fought There!, Gate: Jieitai Kanochi nite, Kaku Tatakaeri"
        )
      )!

      expect(anime.id).toBe(28907)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe("https://myanimelist.net/anime/28907/Gate__Jieitai_Kanochi_nite_Kaku_Tatakaeri")
      expect(anime.name).toBe("Gate: Jieitai Kanochi nite, Kaku Tatakaeri")
    })

    test("Gate: Jieitai Kanochi nite, Kaku Tatakaeri 2nd Season", async () => {
      const anime = await getAmimeMyAnimeList(
        "Cổng chiến tranh SS2",
        "GATE, Gate: Thus the JSDF Fought There! Fire Dragon Arc, Gate: Jieitai Kanochi nite, Kaku Tatakaeri - Enryuu-hen, Gate: Jieitai Kanochi nite, Kaku Tatakaeri 2nd Season"
      )

      expect(anime.id).toBe(31637)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/31637/Gate__Jieitai_Kanochi_nite_Kaku_Tatakaeri_Part_2"
      )
      expect(anime.name).toBe(
        "Gate: Jieitai Kanochi nite, Kaku Tatakaeri Part 2"
      )
    })

    test("Tonikaku Kawaii", async () => {
      const anime = await getAmimeMyAnimeList(
        "Tonikaku Kawaii",
        "TONIKAWA: Over the Moon For You:, Generally Cute, Fly Me to the Moon"
      )

      expect(anime.id).toBe(41389)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/41389/Tonikaku_Kawaii"
      )
      expect(anime.name).toBe("Tonikaku Kawaii")
    })

    test("Tonikaku Kawaii: SNS", async () => {
      const anime = await getAmimeMyAnimeList(
        "Tonikaku Kawaii: SNS",
        "Tonikaku Kawaii OVA, Tonikawa"
      )

      expect(anime.id).toBe(44931)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/44931/Tonikaku_Kawaii__SNS"
      )
      expect(anime.name).toBe("Tonikaku Kawaii: SNS")
    })

    test("Tonikaku Kawaii: Seifuku", async () => {
      const anime = await getAmimeMyAnimeList(
        "Tonikaku Kawaii: Seifuku",
        "Tonikawa: Over the Moon for You - Uniform"
      )

      expect(anime.id).toBe(51533)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/51533/Tonikaku_Kawaii__Seifuku"
      )
      expect(anime.name).toBe("Tonikaku Kawaii: Seifuku")
    })

    test("Tonikaku Kawaii 2nd Season", async () => {
      const anime = await getAmimeMyAnimeList(
        "Tonikaku Kawaii 2nd Season",
        "Tonikawa: Over the Moon for You 2nd Season, Tonikawa: Over The Moon For You Season 2"
      )

      expect(anime.id).toBe(50307)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/50307/Tonikaku_Kawaii_2nd_Season"
      )
      expect(anime.name).toBe("Tonikaku Kawaii 2nd Season")
    })

    test("86", async () => {
      const anime = await getAmimeMyAnimeList("86", "Eighty Six")

      expect(anime.id).toBe(41457)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe("https://myanimelist.net/anime/41457/86")
      expect(anime.name).toBe("86")
    })

    test("86 Special Edition: Senya ni Akaku Hinageshi no Saku", async () => {
      const anime = await getAmimeMyAnimeList(
        "86 Special Edition: Senya ni Akaku Hinageshi no Saku",
        "86-Eighty Six- Special Edition - Coquelicots Blooming Across the Battlefield, Eighty Six Special Edition"
      )

      expect(anime.id).toBe(49235)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/49235/86_Special_Edition__Senya_ni_Akaku_Hinageshi_no_Saku"
      )
      expect(anime.name).toBe(
        "86 Special Edition: Senya ni Akaku Hinageshi no Saku"
      )
    })

    test("86 2nd Season", async () => {
      const anime = await getAmimeMyAnimeList(
        "86 2nd Season",
        "86 Eighty-Six, Eighty Six 2nd Season"
      )

      expect(anime.id).toBe(48569)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe("https://myanimelist.net/anime/48569/86_Part_2")
      expect(anime.name).toBe("86 Part 2")
    })

    test("Mahoutsukai no Yome: Hoshi Matsu Hito", async () => {
      const anime = await getAmimeMyAnimeList(
        "Mahoutsukai no Yome: Hoshi Matsu Hito",
        "The Ancient Magus' Bride: Those Awaiting a Star, The Magician's Bride"
      )

      expect(anime.id).toBe(32902)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/32902/Mahoutsukai_no_Yome__Hoshi_Matsu_Hito"
      )
      expect(anime.name).toBe("Mahoutsukai no Yome: Hoshi Matsu Hito")
    })

    test("Mahoutsukai no Yome", async () => {
      const anime = await getAmimeMyAnimeList(
        "Mahoutsukai no Yome",
        "The Ancient Magus' Bride, The Magician's Bride, Cô Dâu Pháp Sư"
      )

      expect(anime.id).toBe(35062)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/35062/Mahoutsukai_no_Yome"
      )
      expect(anime.name).toBe("Mahoutsukai no Yome")
    })

    test("Mahoutsukai no Yome: Nishi no Shounen to Seiran no Kishi", async () => {
      const anime = await getAmimeMyAnimeList(
        "Mahoutsukai no Yome: Nishi no Shounen to Seiran no Kishi",
        "The Ancient Magus' Bride: The Boy from the West and the Knight of the Blue Storm, The Ancient Magus' Bride OVA, Mahoutsukai no Yome OVA, Mahoutsuaki no Yome OAD"
      )

      expect(anime.id).toBe(48438)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/48438/Mahoutsukai_no_Yome__Nishi_no_Shounen_to_Seiran_no_Kishi"
      )
      expect(anime.name).toBe(
        "Mahoutsukai no Yome: Nishi no Shounen to Seiran no Kishi"
      )
    })

    test("Mahoutsukai no Yome Season 2", async () => {
      const anime = await getAmimeMyAnimeList(
        "Cô Dâu Pháp Sư Mùa 2",
        "Mahoutsukai no Yome Season 2, The Ancient Magus' Bride Season 2, The Ancient Magus Bride 2, Mahoutsukai no Yome 2, Mahoyome"
      )


      expect(anime.id).toBe(52955)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/52955/Mahoutsukai_no_Yome_Season_2"
      )
      expect(anime.name).toBe("Mahoutsukai no Yome Season 2")
    })

    test("Anh Thợ Saitou Đa Năng Ở Dị Giới", async () => {
      const anime = await getAmimeMyAnimeList(
        "Anh Thợ Saitou Đa Năng Ở Dị Giới",
        "Benriya Saitou-san, Isekai ni Iku, Handyman Saitou in Another Worlde"
      )

      expect(anime.id).toBe(50854)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/50854/Benriya_Saitou-san_Isekai_ni_Iku"
      )
      expect(anime.name).toBe("Benriya Saitou-san, Isekai ni Iku")
    })

    test("Naruto", async () => {
      const anime = await getAmimeMyAnimeList("Naruto", "Naruto, NARUTO")

      expect(anime.id).toBe(20)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe("https://myanimelist.net/anime/20/Naruto")
      expect(anime.name).toBe("Naruto")
    })

    test("Naruto: Sức Mạnh Vĩ Thú", async () => {
      const anime = await getAmimeMyAnimeList(
        "Naruto: Sức Mạnh Vĩ Thú",
        "Naruto Shippuden, Naruto Hurricane Chronicles, Naruto: Shippuuden"
      )

      expect(anime.id).toBe(1735)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/1735/Naruto__Shippuuden"
      )
      expect(anime.name).toBe("Naruto: Shippuuden")
    })

    test("Thám Tử Lừng Danh Conan", async () => {
      const anime = await getAmimeMyAnimeList(
        "Thám Tử Lừng Danh Conan",
        "Detective Conan, Case Closed, Meitantei Conan"
      )

      expect(anime.id).toBe(235)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/235/Detective_Conan"
      )
      expect(anime.name).toBe("Detective Conan")
    })

    test("Detective Conan Movie 26: Kurogane no Submarine", async () => {
      const anime = await getAmimeMyAnimeList(
        "Detective Conan Movie 26: Kurogane no Submarine",
        "Meitantei Conan: Kurogane no Submarine"
      )

      expect(anime.id).toBe(53540)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/53540/Detective_Conan_Movie_26__Kurogane_no_Submarine"
      )
      expect(anime.name).toBe("Detective Conan Movie 26: Kurogane no Submarine")
    })

    test("Mở Ra Một Thế Giới Tuyệt Vời", async () => {
      const anime = await getAmimeMyAnimeList(
        "Mở Ra Một Thế Giới Tuyệt Vời",
        "KonoSuba: God's Blessing on This Wonderful World!, Give Blessings to This Wonderful World!,Kono Subarashii Sekai ni Shukufuku wo!"
      )

      expect(anime.id).toBe(30831)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/30831/Kono_Subarashii_Sekai_ni_Shukufuku_wo"
      )
      expect(anime.name).toBe("Kono Subarashii Sekai ni Shukufuku wo!")
    })

    test("Mở Ra Một Thế Giới Tuyệt Vời OVA", async () => {
      const anime = await getAmimeMyAnimeList(
        "Mở Ra Một Thế Giới Tuyệt Vời OVA",
        "KonoSuba OVA, A Blessing to this Wonderful Choker!, Kono Subarashii Choker ni Shufuku wo!, Kono Subarashii Sekai ni Shukufuku wo! OVA"
      )



      expect(anime.id).toBe(32380)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/32380/Kono_Subarashii_Sekai_ni_Shukufuku_wo_Kono_Subarashii_Choker_ni_Shukufuku_wo"
      )
      expect(anime.name).toBe("Kono Subarashii Sekai ni Shukufuku wo! Kono Subarashii Choker ni Shukufuku wo!")
    })

    test("Mở Ra Một Thế Giới Tuyệt Vời 2", async () => {
      const anime = await getAmimeMyAnimeList(
        "Mở Ra Một Thế Giới Tuyệt Vời 2",
        "KonoSuba: God's Blessing on This Wonderful World! 2, Give Blessings to This Wonderful World! 2, Kono Subarashii Sekai ni Shukufuku wo! 2"
      )



      expect(anime.id).toBe(32937)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/32937/Kono_Subarashii_Sekai_ni_Shukufuku_wo_2"
      )
      expect(anime.name).toBe(
        "Kono Subarashii Sekai ni Shukufuku wo! 2"
      )
    })

    test("Mở Ra Một Thế Giới Tuyệt Vời OVA 2", async () => {
      const anime = await getAmimeMyAnimeList(
        "Mở Ra Một Thế Giới Tuyệt Vời OVA 2",
        "KonoSuba: God's Blessing on This Wonderful World! Second Season OVA, KonoSuba: God's Blessing on This Wonderful World! Second Season OVA, Kono Subarashii Sekai ni Shukufuku wo! 2 OVA"
      )



      expect(anime.id).toBe(34626)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/34626/Kono_Subarashii_Sekai_ni_Shukufuku_wo_2__Kono_Subarashii_Geijutsu_ni_Shukufuku_wo"
      )
      expect(anime.name).toBe(
        "Kono Subarashii Sekai ni Shukufuku wo! 2: Kono Subarashii Geijutsu ni Shukufuku wo!"
      )
    })

    test("Kono Subarashii Sekai ni Bakuen wo!", async () => {
      const anime = await getAmimeMyAnimeList(
        "Kono Subarashii Sekai ni Bakuen wo!",
        "Konosuba: An Explosion on This Wonderful World!"
      )



      expect(anime.id).toBe(51958)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/51958/Kono_Subarashii_Sekai_ni_Bakuen_wo"
      )
      expect(anime.name).toBe("Kono Subarashii Sekai ni Bakuen wo!")
    })

    test("Onegai☆Teacher", async () => {
      const anime = await getAmimeMyAnimeList(
        "Onegai☆Teacher",
        "Please Teacher!, Onegai Sensei"
      )



      expect(anime.id).toBe(195)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe("https://myanimelist.net/anime/195/Onegai☆Teacher")
      expect(anime.name).toBe("Onegai☆Teacher")
    })

    test("Karakai Jouzu no Takagi-san", async () => {
      const anime = await getAmimeMyAnimeList(
        "Karakai Jouzu no Takagi-san",
        "Skilled Teaser Takagi-san"
      )



      expect(anime.id).toBe(35860)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/35860/Karakai_Jouzu_no_Takagi-san"
      )
      expect(anime.name).toBe("Karakai Jouzu no Takagi-san")
    })

    test("Nhất Quỷ Nhì Ma, Thứ Ba Takagi Phần 3", async () => {
      const anime = await getAmimeMyAnimeList(
        "Nhất Quỷ Nhì Ma, Thứ Ba Takagi Phần 3",
        "Karakai Jouzu no Takagi-san 3, Skilled Teaser Takagi-san 3rd Season, Karakai Jouzu no Takagi-san Third Season, Teasing Master Takagi-san"
      )



      expect(anime.id).toBe(49721)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/49721/Karakai_Jouzu_no_Takagi-san_3"
      )
      expect(anime.name).toBe("Karakai Jouzu no Takagi-san 3")
    })

    test("Tokyo Mew Mew New ♡ 2nd Season", async () => {
      const anime = await getAmimeMyAnimeList(
        "Tokyo Mew Mew New ♡ 2nd Season",
        "東京ミュウミュウ にゅ～♡"
      )



      expect(anime.id).toBe(53097)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/53097/Tokyo_Mew_Mew_New_♡_2nd_Season"
      )
      expect(anime.name).toBe("Tokyo Mew Mew New ♡ 2nd Season")
    })

    test("Tokyo Mew Mew New ♡", async () => {
      const anime = await getAmimeMyAnimeList(
        "Tokyo Mew Mew New ♡",
        "東京ミュウミュウ にゅ～♡"
      )



      expect(anime.id).toBe(41589)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/41589/Tokyo_Mew_Mew_New_♡"
      )
      expect(anime.name).toBe("Tokyo Mew Mew New ♡")
    })

    test("Tokyo Mew Mew", async () => {
      const anime = await getAmimeMyAnimeList(
        "Tokyo Mew Mew",
        "Tokyo Mew Mew, Mew Mew Power"
      )



      expect(anime.id).toBe(687)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe("https://myanimelist.net/anime/687/Tokyo_Mew_Mew")
      expect(anime.name).toBe("Tokyo Mew Mew")
    })

    test("Isekai wa Smartphone to Tomo ni.", async () => {
      const anime = await getAmimeMyAnimeList(
        "Isekai wa Smartphone to Tomo ni.",
        "TIn Another World With My Smartphone, In a Different World with a Smartphone"
      )



      expect(anime.id).toBe(35203)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/35203/Isekai_wa_Smartphone_to_Tomo_ni"
      )
      expect(anime.name).toBe("Isekai wa Smartphone to Tomo ni.")
    })

    test("Isekai wa Smartphone to Tomo ni. 2nd Season", async () => {
      const anime = await getAmimeMyAnimeList(
        "Isekai wa Smartphone to Tomo ni. 2nd Season",
        "In Another World With My Smartphone 2, In Another World With My Smartphone 2nd Season, In a Different World with a Smartphone."
      )

      expect(anime.id).toBe(51632)
      expect(anime.type).toBe("anime")
      expect(anime.url).toBe(
        "https://myanimelist.net/anime/51632/Isekai_wa_Smartphone_to_Tomo_ni_2"
      )
      expect(anime.name).toBe("Isekai wa Smartphone to Tomo ni. 2")
    })
  })
})
