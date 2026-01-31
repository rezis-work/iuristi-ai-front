"use client";

import React from "react";

type Props = {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  placeName?: string;
};

export default function Map({
  lat = 40.70582497139078,
  lng = -74.01437792445523,
  zoom = 14,
  className = "",
  placeName,
}: Props) {
  const src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.361465793214!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae01!2sWall%20St%2C%20New%20York%2C%20NY%2010005%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s`;

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ position: "relative", height: "100%", minHeight: "400px" }}
    >
      <iframe
        title={placeName ?? "map"}
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0, position: "absolute", top: 0, left: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
