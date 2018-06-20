import {
  // flow,
  map,
  // mapValues,
  reduce,
} from 'lodash/fp'

import { employeeKeys } from 'tandem/aggs'

import input from './input_with_soc_codes.json'

import geocodes from './input_geocodes.json'


const geocodesKeys = {
  /* 1 */ street: 0,
  /* 2 */ city: 1,
  /* 3 */ state: 2,
  /* 4 */ country: 3,
  /* 5 */ postcode: 4,

  /* 6 */ latitude: 5,
  /* 7 */ longitude: 6,
}

const Codes = reduce((set, a /* is for address */) => {
  const key = a.slice(geocodesKeys.Street, geocodesKeys.postcode + 1).join('#')

  return {
    ...set, [key]: [a[geocodesKeys.latitude], a[geocodesKeys.longitude]],
  }
}, {})(geocodes)


const withGeocode = map(x => {
  const key = x.slice(employeeKeys.street, employeeKeys.postcode + 1).join('#')

  const geocode = Codes[key]

  if (geocode) {
    x.push(geocode[0], geocode[1])
  } else {
    x.push(null, null)
  }

  return x
})

const parsed = {
  ...input,
  employeeData: withGeocode(input.employee_data),
}


// eslint-disable-next-line no-console
console.log(JSON.stringify(parsed, null, ' '))
