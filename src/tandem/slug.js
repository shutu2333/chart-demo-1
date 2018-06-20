import limax from 'limax'


const slugOptions = {
  separateNumbers: false,
  custom: {
    '&': 'and',
  },
}


export default function slug(input) {
  return limax(input, slugOptions)
}
