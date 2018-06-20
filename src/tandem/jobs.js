/* @flow */

export type Job = {
  code: string,
  name: string,
  p: number,
}


export type JobDistance = {
  from: string,
  to: string,
  distance: number,
  name: string,
  code: string,
}

export type JobElement = {
  id: number,
  soc: string,
  code: string,
  type: string,
  name: string,
  value: number,
}
