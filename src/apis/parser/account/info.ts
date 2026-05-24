import { parserDom } from "../__helpers__/parserDom"

function decodeCfEmail(encoded: string): string {
  const bytes: number[] = []
  for (let i = 0; i < encoded.length; i += 2) {
    bytes.push(Number.parseInt(encoded.substring(i, i + 2), 16))
  }
  const key = bytes[0]
  return bytes.slice(1).map(b => String.fromCharCode(b ^ key)).join('')
}

export default function AccountInfo(html: string) {
  const $ = parserDom(html)

  const avatar = $(".profile-userpic img, img.upe-avatar").attr("src")
  const name = $("#username").attr("value")?.trim() || $(".upe-name").text().trim() || undefined
  const emailFromInput = $("#email").attr("value")?.trim()
  const emailFromCf = $(".__cf_email__").attr("data-cfemail")
  const email = emailFromInput || (emailFromCf ? decodeCfEmail(emailFromCf) : undefined)
  const username = $("#hoten, #upe-fullname").attr("value")?.trim() || ""
  const sex = $("select[name='gender'] input[checked]").attr("value") || ""

  return { avatar, name, email, username, sex }
}
