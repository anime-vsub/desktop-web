import { getAnimeZoro } from "./search"

describe("episodes", () => {
  describe("getAnimeZoro", () => {
    test("Gate: Jieitai Kanochi nite, Kaku Tatakaeri", async () => {
      const anime = await getAnimeZoro(
        "Cổng chiến tranh",
        "GATE, Gate: Thus the JSDF Fought There!, Gate: Jieitai Kanochi nite, Kaku Tatakaeri",
        ""
      )

      expect(anime.url).toBe("/gate-891")
      expect(anime.name).toBe("GATE")
      expect(anime.alias).toBe("Gate: Jieitai Kanochi nite, Kaku Tatakaeri")
    })

    test("Gate: Jieitai Kanochi nite, Kaku Tatakaeri 2nd Season", async () => {
      const anime = await getAnimeZoro(
        "Cổng chiến tranh SS2",
        "GATE, Gate: Thus the JSDF Fought There! Fire Dragon Arc, Gate: Jieitai Kanochi nite, Kaku Tatakaeri - Enryuu-hen, Gate: Jieitai Kanochi nite, Kaku Tatakaeri 2nd Season",
        ""
      )

      expect(anime.url).toBe("/gate-2nd-season-811")
      expect(anime.name).toBe("GATE 2nd Season")
      expect(anime.alias).toBe(
        "Gate: Jieitai Kanochi nite, Kaku Tatakaeri 2nd Season"
      )
    })

    test("Tonikaku Kawaii", async () => {
      const anime = await getAnimeZoro(
        "Tonikaku Kawaii",
        "TONIKAWA: Over the Moon For You:, Generally Cute, Fly Me to the Moon",
        ""
      )

      expect(anime.url).toBe("/tonikawa-over-the-moon-for-you-949")
      expect(anime.name).toBe("TONIKAWA: Over the Moon For You")
      expect(anime.alias).toBe("Tonikaku Kawaii")
    })

    test("Tonikaku Kawaii: SNS", async () => {
      const anime = await getAnimeZoro(
        "Tonikaku Kawaii: SNS",
        "Tonikaku Kawaii OVA, Tonikawa",
        "OVA 1"
      )

      expect(anime.url).toBe("/tonikaku-kawaii-sns-17392")
      expect(anime.name).toBe("Tonikaku Kawaii: SNS")
      expect(anime.alias).toBe("Tonikaku Kawaii OVA")
    })

    test("Tonikaku Kawaii: Seifuku", async () => {
      const anime = await getAnimeZoro(
        "Tonikaku Kawaii: Seifuku",
        "Tonikawa: Over the Moon for You - Uniform",
        "OVA 2"
      )

      expect(anime.url).toBe("/tonikawa-over-the-moon-for-you-uniform-18227")
      expect(anime.name).toBe("Tonikawa: Over the Moon for You - Uniform")
      expect(anime.alias).toBe("Tonikaku Kawaii: Seifuku")
    })

    test("Tonikaku Kawaii 2nd Season", async () => {
      const anime = await getAnimeZoro(
        "Tonikaku Kawaii 2nd Season",
        "Tonikawa: Over the Moon for You 2nd Season, Tonikawa: Over The Moon For You Season 2",
        ""
      )

      expect(anime.url).toBe("/tonikawa-over-the-moon-for-you-2nd-season-18226")
      expect(anime.name).toBe("Tonikawa: Over The Moon For You: 2nd Season")
      expect(anime.alias).toBe("Tonikaku Kawaii 2nd Season")
    })

    test("86", async () => {
      const anime = await getAnimeZoro("86", "Eighty Six", "")

      expect(anime.url).toBe("/86-15632")
      expect(anime.name).toBe("86")
      expect(anime.alias).toBe("86")
    })

    test("86 Special Edition: Senya ni Akaku Hinageshi no Saku", async () => {
      const anime = await getAnimeZoro(
        "86 Special Edition: Senya ni Akaku Hinageshi no Saku",
        "86-Eighty Six- Special Edition - Coquelicots Blooming Across the Battlefield, Eighty Six Special Edition",
        ""
      )

      expect(anime.url).toBe(
        "/86eighty-six-special-edition-coquelicots-blooming-across-the-battlefield-17948"
      )
      expect(anime.name).toBe(
        "86-Eighty Six- Special Edition - Coquelicots Blooming Across the Battlefield"
      )
      expect(anime.alias).toBe(
        "86 Special Edition: Senya ni Akaku Hinageshi no Saku"
      )
    })

    test("86 2nd Season", async () => {
      const anime = await getAnimeZoro(
        "86 2nd Season",
        "86 Eighty-Six, Eighty Six 2nd Season",
        ""
      )

      expect(anime.url).toBe("/86-eighty-six-season-2-recap-17926")
      expect(anime.name).toBe("86 EIGHTY-SIX Season 2 Recap")
      expect(anime.alias).toBe("86 EIGHTY-SIX Season 2 Recap")
    })

    test("Mahoutsukai no Yome: Hoshi Matsu Hito", async () => {
      const anime = await getAnimeZoro(
        "Mahoutsukai no Yome: Hoshi Matsu Hito",
        "The Ancient Magus' Bride: Those Awaiting a Star, The Magician's Bride",
        "OVA"
      )

      expect(anime.url).toBe(
        "/the-ancient-magus-bride-ova-mahoutsukai-no-yome-ova-17689"
      )
      expect(anime.name).toBe(
        "The Ancient Magus' Bride OVA - Mahoutsukai no Yome OVA"
      )
      expect(anime.alias).toBe(
        "Mahoutsukai no Yome: Nishi no Shounen to Seiran no Kishi"
      )
    })

    test("Mahoutsukai no Yome", async () => {
      const anime = await getAnimeZoro(
        "Mahoutsukai no Yome",
        "The Ancient Magus' Bride, The Magician's Bride, Cô Dâu Pháp Sư",
        "TV Series"
      )

      expect(anime.url).toBe("/the-ancient-magus-bride-400")
      expect(anime.name).toBe("The Ancient Magus' Bride")
      expect(anime.alias).toBe("Mahoutsukai no Yome")
    })

    test("Mahoutsukai no Yome: Nishi no Shounen to Seiran no Kishi", async () => {
      const anime = await getAnimeZoro(
        "Mahoutsukai no Yome: Nishi no Shounen to Seiran no Kishi",
        "The Ancient Magus' Bride: The Boy from the West and the Knight of the Blue Storm, The Ancient Magus' Bride OVA, Mahoutsukai no Yome OVA, Mahoutsuaki no Yome OAD",
        "OVA"
      )

      expect(anime.url).toBe(
        "/the-ancient-magus-bride-ova-mahoutsukai-no-yome-ova-17689"
      )
      expect(anime.name).toBe(
        "The Ancient Magus' Bride OVA - Mahoutsukai no Yome OVA"
      )
      expect(anime.alias).toBe(
        "Mahoutsukai no Yome: Nishi no Shounen to Seiran no Kishi"
      )
    })

    test("Mahoutsukai no Yome Season 2", async () => {
      const anime = await getAnimeZoro(
        "Cô Dâu Pháp Sư Mùa 2",
        "Mahoutsukai no Yome Season 2, The Ancient Magus' Bride Season 2, The Ancient Magus Bride 2, Mahoutsukai no Yome 2, Mahoyome",
        "2"
      )

      expect(anime.url).toBe("/the-ancient-magus-bride-season-2-18338")
      expect(anime.name).toBe("The Ancient Magus' Bride Season 2")
      expect(anime.alias).toBe("Mahoutsukai no Yome Season 2")
    })

    test("Anh Thợ Saitou Đa Năng Ở Dị Giới", async () => {
      const anime = await getAnimeZoro(
        "Anh Thợ Saitou Đa Năng Ở Dị Giới",
        "Benriya Saitou-san, Isekai ni Iku, Handyman Saitou in Another Worlde",
        ""
      )

      expect(anime.url).toBe("/handyman-saitou-in-another-world-18289")
      expect(anime.name).toBe("Handyman Saitou in Another World")
      expect(anime.alias).toBe("Benriya Saitou-san, Isekai ni Iku")
    })

    test("Naruto", async () => {
      const anime = await getAnimeZoro("Naruto", "Naruto, NARUTO", "")

      expect(anime.url).toBe("/naruto-677")
      expect(anime.name).toBe("Naruto")
      expect(anime.alias).toBe("Naruto")
    })

    test("Naruto: Sức Mạnh Vĩ Thú", async () => {
      const anime = await getAnimeZoro(
        "Naruto: Sức Mạnh Vĩ Thú",
        "Naruto Shippuden, Naruto Hurricane Chronicles, Naruto: Shippuuden",
        ""
      )

      expect(anime.url).toBe("/naruto-shippuden-355")
      expect(anime.name).toBe("Naruto: Shippuden")
      expect(anime.alias).toBe("Naruto: Shippuuden")
    })

    test("Thám Tử Lừng Danh Conan", async () => {
      const anime = await getAnimeZoro(
        "Thám Tử Lừng Danh Conan",
        "Detective Conan, Case Closed, Meitantei Conan",
        ""
      )

      expect(anime.url).toBe("/case-closed-323")
      expect(anime.name).toBe("Case Closed")
      expect(anime.alias).toBe("Detective Conan")
    })

    test("Detective Conan Movie 26: Kurogane no Submarine", async () => {
      const anime = await getAnimeZoro(
        "Detective Conan Movie 26: Kurogane no Submarine",
        "Meitantei Conan: Kurogane no Submarine",
        "movie 26"
      )

      expect(anime.url).toBe("/detective-conan-zero-no-tea-time-18050")
      expect(anime.name).toBe("Detective Conan: Zero no Tea Time")
      expect(anime.alias).toBe("Meitantei Conan: Zero no Tea Time")
    })

    test("Mở Ra Một Thế Giới Tuyệt Vời", async () => {
      const anime = await getAnimeZoro(
        "Mở Ra Một Thế Giới Tuyệt Vời",
        "KonoSuba: God's Blessing on This Wonderful World!, Give Blessings to This Wonderful World!,Kono Subarashii Sekai ni Shukufuku wo!",
        ""
      )

      expect(anime.url).toBe(
        "/konosuba-gods-blessing-on-this-wonderful-world-342"
      )
      expect(anime.name).toBe(
        "KonoSuba: God's Blessing on This Wonderful World!"
      )
      expect(anime.alias).toBe("Kono Subarashii Sekai ni Shukufuku wo!")
    })

    test("Mở Ra Một Thế Giới Tuyệt Vời OVA", async () => {
      const anime = await getAnimeZoro(
        "Mở Ra Một Thế Giới Tuyệt Vời OVA",
        "KonoSuba OVA, A Blessing to this Wonderful Choker!, Kono Subarashii Choker ni Shufuku wo!, Kono Subarashii Sekai ni Shukufuku wo! OVA",
        "OVA 1"
      )

      expect(anime.url).toBe(
        "/kono-subarashii-sekai-ni-shukufuku-wo-kono-subarashii-choker-ni-shukufuku-wo-719"
      )
      expect(anime.name).toBe(
        "Kono Subarashii Sekai ni Shukufuku wo!: Kono Subarashii Choker ni Shukufuku wo!"
      )
      expect(anime.alias).toBe(
        "Kono Subarashii Sekai ni Shukufuku wo!: Kono Subarashii Choker ni Shukufuku wo!"
      )
    })

    test("Mở Ra Một Thế Giới Tuyệt Vời 2", async () => {
      const anime = await getAnimeZoro(
        "Mở Ra Một Thế Giới Tuyệt Vời 2",
        "KonoSuba: God's Blessing on This Wonderful World! 2, Give Blessings to This Wonderful World! 2, Kono Subarashii Sekai ni Shukufuku wo! 2",
        ""
      )

      expect(anime.url).toBe(
        "/konosuba-gods-blessing-on-this-wonderful-world-2-206"
      )
      expect(anime.name).toBe(
        "KonoSuba: God's Blessing on This Wonderful World! 2"
      )
      expect(anime.alias).toBe("Kono Subarashii Sekai ni Shukufuku wo! 2")
    })

    test("Mở Ra Một Thế Giới Tuyệt Vời OVA 2", async () => {
      const anime = await getAnimeZoro(
        "Mở Ra Một Thế Giới Tuyệt Vời OVA 2",
        "KonoSuba: God's Blessing on This Wonderful World! Second Season OVA, KonoSuba: God's Blessing on This Wonderful World! Second Season OVA, Kono Subarashii Sekai ni Shukufuku wo! 2 OVA",
        "OVA 2"
      )

      expect(anime.url).toBe(
        "/konosuba-gods-blessing-on-this-wonderful-world-2-gods-blessing-on-this-wonderful-art-438"
      )
      expect(anime.name).toBe(
        "KonoSuba: God's Blessing on This Wonderful World! 2: God's blessing on this wonderful Art!"
      )
      expect(anime.alias).toBe(
        "Kono Subarashii Sekai ni Shukufuku wo! 2: Kono Subarashii Geijutsu ni Shukufuku wo!"
      )
    })

    test("Kono Subarashii Sekai ni Bakuen wo!", async () => {
      const anime = await getAnimeZoro(
        "Kono Subarashii Sekai ni Bakuen wo!",
        "Konosuba: An Explosion on This Wonderful World!",
        "Movie"
      )

      expect(anime.url).toBe(
        "/konosuba-an-explosion-on-this-wonderful-world-18337"
      )
      expect(anime.name).toBe("KonoSuba: An Explosion on This Wonderful World!")
      expect(anime.alias).toBe("Kono Subarashii Sekai ni Bakuen wo!")
    })

    test("Onegai☆Teacher", async () => {
      const anime = await getAnimeZoro(
        "Onegai☆Teacher",
        "Please Teacher!, Onegai Sensei",
        ""
      )

      expect(anime.url).toBe("/please-teacher-2763")
      expect(anime.name).toBe("Please Teacher!")
      expect(anime.alias).toBe("Onegai☆Teacher")
    })

    test("Karakai Jouzu no Takagi-san", async () => {
      const anime = await getAnimeZoro(
        "Karakai Jouzu no Takagi-san",
        "Skilled Teaser Takagi-san",
        ""
      )

      expect(anime.url).toBe("/teasing-master-takagi-san-818")
      expect(anime.name).toBe("Teasing Master Takagi-san")
      expect(anime.alias).toBe("Karakai Jouzu no Takagi-san")
    })

    test("Nhất Quỷ Nhì Ma, Thứ Ba Takagi Phần 3", async () => {
      const anime = await getAnimeZoro(
        "Nhất Quỷ Nhì Ma, Thứ Ba Takagi Phần 3",
        "Karakai Jouzu no Takagi-san 3, Skilled Teaser Takagi-san 3rd Season, Karakai Jouzu no Takagi-san Third Season, Teasing Master Takagi-san",
        ""
      )

      expect(anime.url).toBe("/teasing-master-takagi-san-818")
      expect(anime.name).toBe("Teasing Master Takagi-san")
      expect(anime.alias).toBe("Karakai Jouzu no Takagi-san")
    })

    test("Tokyo Mew Mew New ♡ 2nd Season", async () => {
      const anime = await getAnimeZoro(
        "Tokyo Mew Mew New ♡ 2nd Season",
        "東京ミュウミュウ にゅ～♡",
        ""
      )

      expect(anime.url).toBe("/tokyo-mew-mew-new-2nd-season-18368")
      expect(anime.name).toBe("Tokyo Mew Mew New 2nd Season")
      expect(anime.alias).toBe("Tokyo Mew Mew New 2nd Season")
    })

    test("Tokyo Mew Mew New ♡", async () => {
      const anime = await getAnimeZoro(
        "Tokyo Mew Mew New ♡",
        "東京ミュウミュウ にゅ～♡",
        ""
      )

      expect(anime.url).toBe("/tokyo-mew-mew-new-15584")
      expect(anime.name).toBe("Tokyo Mew Mew New ♡")
      expect(anime.alias).toBe("Tokyo Mew Mew New ♡")
    })

    test("Tokyo Mew Mew", async () => {
      const anime = await getAnimeZoro(
        "Tokyo Mew Mew",
        "Tokyo Mew Mew, Mew Mew Power",
        ""
      )

      expect(anime.url).toBe("/mew-mew-power-3627")
      expect(anime.name).toBe("Mew Mew Power")
      expect(anime.alias).toBe("Tokyo Mew Mew")
    })

    test("Isekai wa Smartphone to Tomo ni.", async () => {
      const anime = await getAnimeZoro(
        "Isekai wa Smartphone to Tomo ni.",
        "TIn Another World With My Smartphone, In a Different World with a Smartphone",
        ""
      )

      expect(anime.url).toBe("/in-another-world-with-my-smartphone-6705")
      expect(anime.name).toBe("In Another World With My Smartphone")
      expect(anime.alias).toBe("Isekai wa Smartphone to Tomo ni.")
    })

    test("Isekai wa Smartphone to Tomo ni. 2nd Season", async () => {
      const anime = await getAnimeZoro(
        "Isekai wa Smartphone to Tomo ni. 2nd Season",
        "In Another World With My Smartphone 2, In Another World With My Smartphone 2nd Season, In a Different World with a Smartphone.",
        ""
      )

      expect(anime.url).toBe("/in-another-world-with-my-smartphone-2-18342")
      expect(anime.name).toBe("In Another World With My Smartphone 2")
      expect(anime.alias).toBe("Isekai wa Smartphone to Tomo ni. 2")
    })
  })
})
