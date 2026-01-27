"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Globe, ShieldAlert, Users, Scale } from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  delay: number;
}

const LegalServicesGrid: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const services: ServiceCard[] = [
    {
      id: "power-of-attorney",
      title: "Power of attorney",
      icon: <Globe className="w-16 h-16" strokeWidth={1.5} />,
      delay: 0,
    },
    {
      id: "insurance-fraud",
      title: "Insurance & fraud cases",
      icon: <ShieldAlert className="w-16 h-16" strokeWidth={1.5} />,
      delay: 100,
    },
    {
      id: "divorce",
      title: "Divorce attorneys",
      icon: <Users className="w-16 h-16" strokeWidth={1.5} />,
      delay: 200,
    },
    {
      id: "disputes-criminal",
      title: "Disputes & criminal cases",
      icon: <Scale className="w-16 h-16" strokeWidth={1.5} />,
      delay: 300,
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCardClick = (cardId: string) => {
    setClickedCard(clickedCard === cardId ? null : cardId);
  };

  return (
    <div className="w-full">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 select-none">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative group cursor-pointer overflow-hidden transition-all duration-600 ease-out
                border-l border-zinc-700 lg:border-l-0
                ${index < services.length - 1 ? "lg:border-r lg:border-zinc-700" : ""}
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }
                ${clickedCard === service.id ? "clicked" : ""}`}
              style={{
                transitionDelay: `${service.delay}ms`,
              }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(service.id)}
            >
              <div
                className={`absolute inset-0 transition-opacity duration-500
                  ${clickedCard === service.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)",
                }}
              />
              <div className="relative py-8 px-4 lg:px-0 h-full min-h-75 flex flex-col justify-between">
                <div className="mb-8">
                  <div
                    className={`text-white transition-opacity duration-300
                    ${clickedCard === service.id ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}
                  >
                    {service.icon}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl lg:text-2xl font-light tracking-wide leading-tight">
                    {service.title}
                  </h3>
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-light whitespace-nowrap overflow-hidden transition-all duration-500 ease-out
                      ${clickedCard === service.id ? "max-w-25" : "max-w-0 group-hover:max-w-25"}`}
                    >
                      Read more
                    </span>
                    <div
                      className={`transform transition-transform duration-500
                      ${clickedCard === service.id ? "translate-x-2" : "group-hover:translate-x-2"}`}
                    >
                      <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalServicesGrid;
