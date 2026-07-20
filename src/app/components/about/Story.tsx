"use client";

interface StoryProps {
  sectionId?: string;
}

export default function Story({ sectionId }: StoryProps) {
  return (
    <section id={sectionId} className="py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Image Panel */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-[#ECE3D4]">
              <img 
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format" 
                alt="Luxury Salon Interior" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Absolute Decorative Frame Accent */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-[#C9A96A] rounded-3xl -z-10 pointer-events-none" />
          </div>

          {/* Text Content Panel */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#A8BFA3] text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "Inter, sans-serif" }}>
              Our Story
            </span>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-[#45533F] leading-tight font-poppins"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Where Science & Artistry<br />
              Meet Family Comfort
            </h2>
            <p 
              className="text-[#45533F]/85 text-sm leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Founded in 2018, Binary Brains Family Salon set out with a simple yet transformative mission: to elevate family grooming into a luxurious, highly hygienic, and stress-free ritual. We realized that local salons often lacked the precision of high-end aesthetics or failed to create a warm environment accommodating all age groups.
            </p>
            <p 
              className="text-[#45533F]/85 text-sm leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              We combined advanced sanitization protocols, hospital-grade tools sterilization, and continuous expert training to launch a sanctuary. Today, we are proud to serve over 5,000 active families in Bangalore, continuing our pursuit of customized style consultations and uncompromising care.
            </p>
            <div className="border-l-2 border-[#C9A96A] pl-4 py-1.5 italic text-sm text-[#45533F]/70 font-medium">
              &quot;Grooming is not just a routine maintenance; it is an act of self-care and confidence that should be shared seamlessly by the entire family.&quot;
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
