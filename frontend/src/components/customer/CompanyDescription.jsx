import React from 'react';

function CompanyDescription() {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1606472171079-8c28cee65102?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
      description: "15+ years in transportation industry"
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Operations Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Expert in logistics and fleet management"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Customer Experience",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Dedicated to exceptional service"
    },
    {
      id: 4,
      name: "David Thompson",
      position: "Safety Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      description: "Certified safety professional"
    },
    {
      id: 5,
      name: "Lisa Wang",
      position: "Technology Lead",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
      description: "Innovating travel experiences"
    }
  ];

  const features = [
    {
      icon: "🚌",
      title: "Modern Fleet",
      description: "Latest model coaches with premium amenities"
    },
    {
      icon: "🛡️",
      title: "Safety First",
      description: "Rigorous maintenance and certified drivers"
    },
    {
      icon: "⭐",
      title: "5-Star Service",
      description: "Exceptional customer experience guaranteed"
    },
    {
      icon: "🌍",
      title: "Nationwide",
      description: "Serving routes across the country"
    }
  ];

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            About RideSync
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming coach travel with innovation, safety, and exceptional service since 2010
          </p>
        </div>

        {/* Company Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Company Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="RideSync Premium Coaches"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 transform rotate-3">
              <div className="text-3xl font-bold text-blue-600">14+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
          </div>

          {/* Company Description */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Our Journey</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded in 2010, RideSync began with a simple mission: to make coach travel 
              more comfortable, reliable, and enjoyable. What started as a small family business 
              has grown into a trusted nationwide service provider.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, we operate a modern fleet of luxury coaches, serving thousands of 
              satisfied customers each month. Our commitment to safety, innovation, and 
              customer satisfaction sets us apart in the transportation industry.
            </p>
            
            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{feature.title}</div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals committed to delivering exceptional travel experiences
          </p>
        </div>

        {/* Team Carousel */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-8 scrollbar-hide space-x-8 px-4">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-6 text-center">
                  {/* Round Team Image */}
                  <div className="relative mx-auto mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Online Indicator */}
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-blue-600 font-semibold mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center space-x-3 mt-4">
                    <button className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center">
                      <span className="text-blue-600 text-sm">in</span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
                      <span className="text-gray-600 text-sm">f</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Scroll Hint */}
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">← Scroll to meet the team →</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Travel With Us?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers today</p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
            Book Your First Trip
          </button>
        </div>
      </div>
    </section>
  );
}

export default CompanyDescription;