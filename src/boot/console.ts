import { boot } from "quasar/wrappers"

const clip =
  "background:-webkit-linear-gradient(to bottom right,#ddd 20%,#d915b5 100%);background:linear-gradient(to bottom right,#ddd 20%,#d915b5 100%);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;"

console.log(
  "%cChờ Đã!",
  "color:#5865f2;-webkit-text-stroke:2px black;font-size:72px;font-weight:bold;" +
    clip
)
console.log(
  "%cNếu có ai đó yêu cầu bạn sao/chép thứ gì đó ở đây, bảo đảm 11/10 lần là bạn đang bị lừa.",
  "font-size: 16px;" + clip
)
console.log(
  "%cSao chép bất cứ thứ gì vào đây có thể khiến tài khoản Google/Facebook/Discord và nhiều tài khoản khác của bạn bị tấn công.",
  "font-size:18px;font-weight:bold;color:red;"
)

export default boot(async () => {
  const { i18n } = await import("./i18n")
  const matte = i18n.global.t("matte")
  const msgWarn = i18n.global.t("msg-warn")
  const msgWarn2 = i18n.global.t("msg-warn2")

  console.log(
    `%c${matte}!`,
    "color:#5865f2;-webkit-text-stroke:2px black;font-size:72px;font-weight:bold;" +
      clip
  )
  console.log(`%c${msgWarn}`, "font-size: 16px;" + clip)
  console.log(`%c${msgWarn2}`, "font-size:18px;font-weight:bold;color:red;")
})
