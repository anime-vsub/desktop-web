function base64ToUint8Array(base64Str: string): Uint8Array {
  let cleaned = base64Str
    .replace(/^W\/"|"/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  while (cleaned.length % 4) {
    cleaned += "="
  }

  const binary = atob(cleaned)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

export async function decrypt(
  encryptedPayloadBase64: string,
  etag: string,
  proxyDigest: string,
  cacheNode: string,
  requestTrace: string
): Promise<string> {
  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto API not found.")
  }
  const keyBytes = base64ToUint8Array(etag)
  const iv = keyBytes.slice(0, 12)

  const hmacKey = await crypto.subtle.importKey(
    "raw",
    keyBytes as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const encryptedBytes = base64ToUint8Array(encryptedPayloadBase64)
  const msg = `${proxyDigest}:${requestTrace}:${cacheNode}`
  try {
    const messageBytes = new TextEncoder().encode(msg)
    const hmacResult = await crypto.subtle.sign(
      "HMAC",
      hmacKey,
      messageBytes as BufferSource
    )
    const aesKey = await crypto.subtle.importKey(
      "raw",
      hmacResult,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    )
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      encryptedBytes as BufferSource
    )
    return new TextDecoder().decode(decryptedBuffer)
  } catch (e) {
    throw new Error("Decrypt Error!!!")
  }
}

export async function decryptM3u8(
  encryptedM3u8: string,
  headers: Record<string, string>
): Promise<string> {
  const edge_tag = headers["x-edge-tag"] || ""
  const proxyDigest = headers["x-proxy-digest"] || ""
  const cacheNode = decodeURIComponent(headers["x-cache-node"] || "")
  const requestTrace = headers["x-request-trace"] || "0"

  if (!edge_tag || !proxyDigest || !cacheNode || !requestTrace) {
    throw new Error("Missing item in headers.")
  }

  const lines = encryptedM3u8.split("\n")

  const cleanLines: string[] = []
  const encryptedTokens: string[] = []

  let baseParams = ""

  const paramsMatch = encryptedM3u8.match(/(si=\d+&seq=\d+&token=[^&\s]+)/)

  if (paramsMatch) {
    baseParams = paramsMatch[1]
  }

  for (const line of lines) {
    if (line.startsWith("#") || line.trim() === "") {
      if (!line.match(/^#EXTINF:/) && !line.match(/^#EXT-X-ENDLIST/)) {
        cleanLines.push(line)
      }
    } else {
      const match = line.match(/[?&]_t=([^&\s]+)/)
      if (match) {
        encryptedTokens.push(match[1])
      }
    }
  }
  const combinedEncryptedPayload = encryptedTokens.join("")

  if (!combinedEncryptedPayload) {
    return encryptedM3u8
  }

  const decryptedContent = await decrypt(
    combinedEncryptedPayload,
    edge_tag,
    proxyDigest,
    cacheNode,
    requestTrace
  )

  const parsedBaseParams = new URLSearchParams(baseParams)

  const finalLines = decryptedContent.split("\n").map((line) => {
    if (line.trim() === "" || line.startsWith("#")) {
      return line
    }

    let finalUrl = line

    if (finalUrl.startsWith("/")) {
      finalUrl = cdn_google + finalUrl
    } else if (!finalUrl.startsWith("http")) {
      finalUrl = cdn_google + "/" + finalUrl
    }

    try {
      const urlObj = new URL(finalUrl)
      parsedBaseParams.forEach((value, key) => {
        if (!urlObj.searchParams.has(key)) {
          urlObj.searchParams.set(key, value)
        }
      })
      return urlObj.toString()
    } catch (e) {
      console.warn("URL Parse Error:", line)
      return finalUrl
    }
  })
  return cleanLines.join("\n") + "\n" + finalLines.join("\n")
}
