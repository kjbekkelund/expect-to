import isPromise from 'is-promise'
import stringify from './stringify'

function assert (result, msg, err, expected) {
  if (result === true) return
  return { msg, expected, not: false }
}

assert.not = function assertNot (result, msg, msgNot, expected) {
  if (result === false) return
  return { msg: msgNot, expected, not: true }
}

function expect (actual) {
  return {
    to: test => {
      const res = test({ actual, assert, stringify })
      const throwIfError = throwIfErrorFn(actual)

      if (isPromise(res)) {
        return res.then(
          throwIfError,
          throwIfError
        )
      } else {
        throwIfError(res)
      }
    }
  }
}

function throwIfErrorFn (actual) {
  return function (res) {
    if (res === undefined) return

    const err = new Error(res.msg)
    if (res.expected !== undefined) {
      err.expected = res.expected
      err.actual = actual
      err.showDiff = true
    }
    throw err
  }
}

export default expect