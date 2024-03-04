const fs = require("fs")
const Module = require("module")
const { join } = require("path")

const esbuild = require("esbuild")
const originalLoad = Module._load

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Module._load = function (request, parent, isMain) {
  if (fs.existsSync(`${request}.ts`)) request += ".ts"

  if (request.endsWith(".ts")) {
    const result = esbuild.buildSync({
      entryPoints: [request],
      bundle: false,
      format: "cjs",
      write: false,
      sourcemap: "inline"
    })
    const code = result.outputFiles[0].text
    const m = new Module()
    m.paths = module.paths
    m._compile(code, request)
    m.exports.exports = m.exports.default
    return m.exports
  }
  // eslint-disable-next-line functional/functional-parameters
  return originalLoad.apply(this, arguments)
}

Object.assign(module, require(join(__dirname, "/quasar.config.ts")))
