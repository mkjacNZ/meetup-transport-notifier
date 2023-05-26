"use client"
import { get } from 'http';
import Image from 'next/image'
import { Loader } from '@googlemaps/js-api-loader'
import Map from '../app/map'

export default async function Home(req: any, res: any) {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Map />
        </main>
    )
}