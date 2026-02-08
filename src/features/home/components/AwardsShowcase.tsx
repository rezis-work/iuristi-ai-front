"use client";

import { motion } from "motion/react";
import Wrapper from "@/src/components/shared/wrapper";
import SectionHeader from "@/src/components/shared/SectionHeader";
import { awards } from "@/src/constants/awards";
import {
  borderVariants,
  containerVariants,
  headerVariants,
  itemVariants,
} from "@/src/constants/variants";

export default function AwardsShowcase() {
  return (
    <Wrapper className="mx-auto w-full bg-black text-white py-12 px-6 lg:px-28">
      <SectionHeader
        label="About Us"
        title="Our awards from the legal community"
        titleHighlight="!"
        descriptions={[
          "Adipiscing elit, sed do euismod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        ]}
      />
      <motion.div
        className="select-none"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="hidden md:block">
          <motion.div
            className="grid grid-cols-12 gap-4 pb-6"
            variants={headerVariants}
          >
            <div className="col-span-1 text-gray-400 text-sm font-medium">
              #
            </div>
            <div className="col-span-4 text-gray-400 text-sm font-medium">
              Award
            </div>
            <div className="col-span-3 text-gray-400 text-sm font-medium">
              Type
            </div>
            <div className="col-span-3 text-gray-400 text-sm font-medium">
              Clients
            </div>
            <div className="col-span-1 text-gray-400 text-sm font-medium text-right"></div>
          </motion.div>
          <motion.div
            className="h-px bg-gray-800 mb-0"
            variants={borderVariants}
          />
        </div>
        <div className="space-y-0">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              variants={itemVariants}
              className="relative"
            >
              <div className="md:hidden py-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-normal">{award.title}</h3>
                  <p className="text-xl font-light text-gray-400">
                    {award.year}
                  </p>
                </div>
                <p className="text-lg text-gray-300">{award.type}</p>
                <p className="text-lg text-gray-300">{award.client}</p>
              </div>
              <div className="hidden md:grid grid-cols-12 gap-4 py-8 items-center hover:bg-gray-900/30 transition-colors duration-200">
                <div className="col-span-1">
                  <span className="text-2xl font-light text-gray-400">
                    {award.id}
                  </span>
                </div>
                <div className="col-span-4 flex items-center gap-4">
                  <h3 className="text-xl font-normal">{award.title}</h3>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-300">{award.type}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-300">{award.client}</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-2xl font-light text-gray-400">
                    {award.year}
                  </span>
                </div>
              </div>
              {index !== awards.length - 1 && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-gray-800"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Wrapper>
  );
}
