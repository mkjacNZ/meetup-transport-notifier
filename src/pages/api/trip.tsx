import { NextApiRequest, NextApiResponse } from "next";
import process from "process";


export interface Route {
  trip: Trip;
}

export interface Trip {
  data: Datum[];
}

export interface Datum {
  type:       Type;
  id:         string;
  attributes: Attributes;
}

export interface Attributes {
  agency_id:         AgencyID;
  route_id:          string;
  route_long_name:   string;
  route_short_name:  string;
  route_type:        number;
  route_color?:      string;
  route_text_color?: string;
}

export enum AgencyID {
  Am = "AM",
  Atmb = "ATMB",
  Bayes = "BAYES",
  Bfl = "BFL",
  Fgl = "FGL",
  Gbt = "GBT",
  He = "HE",
  Mex = "MEX",
  Nzb = "NZB",
  PC = "PC",
  Rth = "RTH",
  Slph = "SLPH",
  Tzg = "TZG",
  Wbc = "WBC",
  Wrc = "WRC",
}

export enum Type {
  Route = "route",
}

async function GetTransport() {
  const res = await fetch('https://api.at.govt.nz/gtfs/v3/routes', {
    method: 'GET',
    cache: 'no-store',
    // Request headers
    headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': process.env.AT_KEY,}
})
if (!res.ok) {
  // This will activate the closest `error.js` Error Boundary
  throw new Error('Failed to fetch data');
}
return res.json()
}


export default async function handler(req: NextApiRequest, res:NextApiResponse) {
  const trip = await GetTransport()
    res.status(200).json({trip });
  }