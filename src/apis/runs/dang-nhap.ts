import type AccountInfoParser from "src/apis/parser/account/info"
import Worker from "src/apis/workers/account/info?worker"
import { i18n } from "src/boot/i18n"
import { C_URL } from "src/constants"
import { post } from "src/logic/http"
import { Md5 } from "ts-md5"

import { PostWorker } from "../wrap-worker"

const LOGIN_URL = `/account/login/?_fxRef=${C_URL}/account/info`

export async function DangNhap(email: string, password: string) {
  // eslint-disable-next-line camelcase
  const password_md5 = Md5.hashAsciiStr(password)
  const body = {
    email,
    password: "",
    // eslint-disable-next-line camelcase
    password_md5,
    save_password: "1",
    submit: ""
  }

  // First POST without _csrf: server rejects but returns login page HTML containing a fresh _csrf token
  const { data: loginPage, headers: firstHeaders } = await post(LOGIN_URL, body)
  const csrfMatch = loginPage.match(/name="_csrf"[^>]*value="([^"]+)"/)
  if (!csrfMatch) throw new Error(i18n.global.t("dang-nhap-that-bai"))

  const sessionCookie = new Headers(firstHeaders).get("set-cookie")

  // Second POST with the extracted _csrf: server should authenticate and return the logged-in page
  const { data: html, headers } = await post(
    LOGIN_URL,
    {
      ...body,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _csrf: csrfMatch[1]
    },
    sessionCookie ? { cookie: sessionCookie } : undefined
  )

  if (html.includes("user-name-text")) {
    return {
      ...(await PostWorker<typeof AccountInfoParser>(Worker, html)),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cookie: new Headers(headers).get("set-cookie")!
    }
  } else {
    throw new Error(i18n.global.t("dang-nhap-that-bai"))
  }
}
