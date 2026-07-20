"use client";

const milestones = [
  {
    year: "2018",
    title: "Salon Started",
    desc: "Launched our boutique styled salon in Koramangala, setting out to deliver tailored hair care treatments in a calm, aesthetic sanctuary.",
  },
  {
    year: "2020",
    title: "1,000+ Happy Customers",
    desc: "Earned neighborhood trust as the default destination for families, introducing dedicated child-safe styling setups and pricing transparency.",
  },
  {
    year: "2022",
    title: "Premium Expansion",
    desc: "Completed an luxury interior refit, doubled our capacity, and integrated clinical autoclave sanitization standards.",
  },
  {
    year: "2024",
    title: "Digital Booking System",
    desc: "Rolled out our seamless digital scheduling portal, completely removing standard waiting queues and allowing users to map stylists ahead.",
  },
  {
    year: "2026",
    title: "SalonSense AI Launch",
    desc: "Introduced our custom-trained AI Stylist, allowing clients to map their facial geometry, hair texture, and look goals online before visiting.",
  },
];

export default function Timeline() {
  return (
    <section className="py-24 bg-[#F8F5EF] px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#A8BFA3] text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "Inter, sans-serif" }}>
            Our Growth
          </span>
          <h2 
            className="text-3xl sm:text-4xl font-bold text-[#45533F] mt-3 font-poppins"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Our Journey Timeline
          </h2>
          <p 
            className="text-[#45533F]/70 text-sm max-w-sm mx-auto mt-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            How we evolved from a local salon boutique into Bangalore&apos;s digital family grooming benchmark.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-[#ECE3D4] ml-4 md:ml-32 space-y-12">
          {milestones.map((item, i) => (
            <div key={i} className="relative pl-8 md:pl-12">
              
              {/* Year Label Sidebar (For desktop view) */}
              <div 
                className="hidden md:block absolute right-full mr-12 top-0 text-right font-bold text-2xl text-[#C9A96A] font-poppins"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {item.year}
              </div>

              {/* Node Bullet Accent */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#45533F] border-2 border-[#C9A96A] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>

              {/* Card content */}
              <div className="bg-white rounded-3xl p-6 border border-[#ECE3D4] shadow-sm hover:shadow-md transition-shadow">
                {/* Year tag for mobile only */}
                <div 
                  className="md:hidden inline-block text-[#C9A96A] font-bold text-base mb-1 font-poppins"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {item.year}
                </div>
                <h3 
                  className="font-bold text-[#45533F] text-lg mb-2 font-poppins"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-xs sm:text-sm text-[#45533F]/80 leading-relaxed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
