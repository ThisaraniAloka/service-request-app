// src/pages/CustomerPage.jsx
import React from 'react';
import Header from '../components/common/Header'
import Hero from '../components/customer/Hero';
import CompanyDescription from '../components/customer/CompanyDescription';
import StatsSection from '../components/customer/StatsSection';
import ClientsCarousel from '../components/customer/ClientsCarousel';
import Footer from '../components/common/Footer';
import Contact from '../components/customer/Contact';

function CustomerPage() {
  return (
    <div className="customer-page">
      <Header />
      <Hero />
      <CompanyDescription />
      <StatsSection />
      <ClientsCarousel />
      <Contact />
      <Footer />
    </div>
  );
}

export default CustomerPage;