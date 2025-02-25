"use client";
import React from "react";
import Orb from "@/components/ui/Orb";

const Head: React.FC = () => {
  return (
    <section className="relative mx-32 mt-20 p-32 bg-gray-900 text-white rounded-xl shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Left Text Section */}
        <div className="mt-8 md:mt-0 md:max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Your AI‑Powered <span className="text-blue-500">Design</span> Assistant
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Unlock your creative potential. Seamlessly generate, customize, and perfect your designs
            with cutting‑edge AI technology.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md">
              Resume Builder
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-md">
              Mock Interview AI
            </button>
          </div>
        </div>
        
        {/* Right Image Section */}
        <div className="flex-shrink-0">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>
      </div>
    </section>
  );
};

export default Head;
