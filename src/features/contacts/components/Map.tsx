"use client";

import React from "react";

const RUSTAVELI_LAT = 41.6938;
const RUSTAVELI_LNG = 44.8014;

type Props = {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  placeName?: string;
};

export default function Map({
  lat = RUSTAVELI_LAT,
  lng = RUSTAVELI_LNG,
  className = "",
}: Props) {
  const bbox = [
    lng - 0.006,
    lat - 0.006,
    lng + 0.006,
    lat + 0.006,
  ].join(",");

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ position: "relative", height: "100%", minHeight: "400px" }}
    >
      <iframe
        src={osmUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="რუსთაველის გამზირი"
      />
    </div>
  );
}
