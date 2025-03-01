"use client";

import Section from "@/components/Section";
import Head from "@/components/Head";
import Footer from "@/components/footer";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 font-sans">
      <Head />
      <Section />
      <Footer />
    </div>
  );
}
