import React, { useState, useEffect, useRef } from 'react';

function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      id: 1,
      number: 250,
      suffix: '+',
      title: 'Trips Planned',
      description: 'Monthly successful journeys',
      icon: '🚌',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      number: 14,
      suffix: '+',
      title: 'Years Experience',
      description: 'Trusted service since 2014',
      icon: '⭐',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      number: 50000,
      suffix: '+',
      title: 'Happy Customers',
      description: 'Satisfied travelers',
      icon: '😊',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      number: 98,
      suffix: '%',
      title: 'Satisfaction Rate',
      description: 'Customer happiness score',
      icon: '❤️',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Intersection Observer to trigger animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="services"
      className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RideSync</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Trusted by thousands for reliable, comfortable, and safe coach travel experiences
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={stat.id}
              stat={stat}
              isVisible={isVisible}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-gray-300 text-lg">
              <span className="text-white font-semibold">24/7 Support</span> - Always here to help you
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Individual Stat Card Component
const StatCard = ({ stat, isVisible, delay }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      const timer = setTimeout(() => {
        startCounter();
        setHasAnimated(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, hasAnimated]);

  const startCounter = () => {
    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    const increment = stat.number / totalFrames;
    
    let currentFrame = 0;
    
    const counter = setInterval(() => {
      currentFrame++;
      const currentCount = Math.min(
        Math.round(increment * currentFrame),
        stat.number
      );
      
      setCount(currentCount);
      
      if (currentFrame >= totalFrames) {
        clearInterval(counter);
        setCount(stat.number); // Ensure final number is exact
      }
    }, frameRate);
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num;
  };

  return (
    <div className="group relative">
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
      
      <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center transform group-hover:scale-105 transition-all duration-300 hover:border-gray-500">
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color} text-white text-2xl mb-4 transform group-hover:rotate-12 transition-transform duration-300`}>
          {stat.icon}
        </div>

        {/* Animated Number */}
        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {formatNumber(count)}{stat.suffix}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2">
          {stat.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed">
          {stat.description}
        </p>

        {/* Animated Border Bottom */}
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${stat.color} group-hover:w-3/4 transition-all duration-500 rounded-full`}></div>
      </div>
    </div>
  );
};

export default StatsSection;