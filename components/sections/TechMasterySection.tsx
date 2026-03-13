"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  {
    title: "Frontend Development",
    icon: "/icons/tech-frontend.svg", // We can use generic icons or lucide
    techs: ["React", "Vue.js", "Angular", "Next.js", "TypeScript"],
    color: "bg-[#FFF5F0]",
    borderColor: "border-[#FFEDE\n\n\n5]",
  },
  {
    title: "Backend Development",
    icon: "/icons/tech-backend.svg",
    techs: ["Node.js", "Python", "Java", "Ruby on Rails", "Go"],
    color: "bg-[#F0F4FF]",
    borderColor: "border-[#E0E8FF]",
  },
  {
    title: "Mobile Development",
    icon: "/icons/tech-mobile.svg",
    techs: ["Swift", "Kotlin", "React Native", "Flutter", "Ionic"],
    color: "bg-[#F5FBF5]",
    borderColor: "border-[#E5F5E5]",
  },
  {
    title: "Cloud & DevOps",
    icon: "/icons/tech-cloud.svg",
    techs: ["AWS", "Google Cloud", "Azure", "Docker", "Kubernetes"],
    color: "bg-[#FCF5FF]",
    borderColor: "border-[#F5E5FF]",
  },
];

export default function TechMasterySection() {
  return (
    <section className="w-full bg-white py-20 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
        <h2 className="font-bold text-[38px] text-[#2251B5] font-['Plus_Jakarta_Sans',sans-serif] leading-tight text-center">
          Technology we master
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col gap-4 p-6 rounded-3xl border border-[#E0E0E0] hover:shadow-lg transition-shadow bg-white`}
            >
              <h3 className="font-bold text-xl text-[#101828] font-['Inter',sans-serif]">
                {category.title}
              </h3>
              
              <div className="flex flex-col gap-3">
                {category.techs.map((tech, tIndex) => (
                  <div key={tIndex} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E96429]" />
                    <span className="text-base text-[#4A5565] font-['Inter',sans-serif]">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
