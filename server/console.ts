import moment, { max } from "moment"

export enum Special {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",
}

export enum Fg {
  Black = "\x1b[30m",
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Blue = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan = "\x1b[36m",
  White = "\x1b[37m",
  Gray = "\x1b[90m",
}

export enum Bg {
  Black = "\x1b[40m",
  Red = "\x1b[41m",
  Green = "\x1b[42m",
  Yellow = "\x1b[43m",
  Blue = "\x1b[44m",
  Magenta = "\x1b[45m",
  Cyan = "\x1b[46m",
  White = "\x1b[47m",
  Gray = "\x1b[100m"
}


export const oldConsoleError = console.error
export const oldConsoleLog = console.log
export const oldConsoleWarn = console.warn

export function init() {
  console.error = error
  console.log = log
  console.warn = warn
}

export function error(...args) {
  oldConsoleError(
    colorize(
      `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`,
      Fg.White, Bg.Red, false
    ),
    ...args.map(arg => Fg.Red + arg)
  )
}

export function warn(...args) {
  oldConsoleWarn(
    colorize(
      `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`,
      Fg.Black, Bg.Yellow, false
    ),
    ...args
  )
}

export function log(...args) {
  oldConsoleLog(
    colorize(
      `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`,
      Fg.Gray, null, false
    ),
    ...args
  )
}

let maxLen = 15
export function colorize(str: string, fg?: Fg | null, bg?: Bg | undefined | null, autoPad = true) {
  var len = 0
  if (autoPad && str.startsWith('[') && str.endsWith(']')) {
    if (str.length > maxLen) {
      maxLen = str.length
    }

    len = maxLen - str.length
  }

  return Special.Reset + (fg ?? '') + (bg ?? '') + str + Special.Reset + 
  new Array(len).fill('-').map((x, i) => {
    if ((i + 1) % 2 === 0) {
      return ' '
    }
    return x
  }).reverse().join('') 
}

export function reset() {
  console.error = oldConsoleError
  console.log = oldConsoleLog
  console.warn = oldConsoleWarn
}

export default console