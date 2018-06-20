/* @flow */

export default {
  required() {
    return function (name: string, value: string): string | null {
      if (!value) return `${ name } is required`
      return null
    }
  },

  minLen(len: number) {
    return function (name: string, value: string): string | null {
      if (!value || value.length < 8) return `${ name } must be at least ${ len } characters long`
      return null
    }
  },

  exactly(match: string, field: string) {
    return function (name: string, value: string) {
      if (match === value) return null
      return `${ name } must match ${ field }`
    }
  },
// matchPassword(pass: string, this.state.creds.password): string | null {
//   return  === pass ?
//     'The passwords you entered do not match' : null
// }

// validateEmail() {
//
// }
}
