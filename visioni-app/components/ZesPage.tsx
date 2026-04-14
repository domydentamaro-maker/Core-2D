import React from 'react';
import ZesHeader from './zes/Header';
import ZesHero from './zes/Hero';
import Introduction from './zes/Introduction';
import NewsTicker from './zes/NewsTicker';
import ZesFlow from './zes/ZesFlow';
import AboutUs from './zes/AboutUs';
import OperationalMap from './zes/OperationalMap';
import TertiaryFocus from './zes/TertiaryFocus';
import ZesComparisonTable from './zes/ComparisonTable';
import EligibilityWizard from './zes/EligibilityWizard';
import StepsSection from './zes/StepsSection';
import ProjectsGallery from './zes/ProjectsGallery';
import PartnersLogos from './zes/PartnersLogos';
import OwnersSection from './zes/OwnersSection';
import RoiCalculator from './zes/RoiCalculator';
import ZesTestimonials from './zes/Testimonials';
import FAQSection from './zes/FAQSection';
import ZesLeadMagnet from './zes/LeadMagnet';
import ContactCTA from './zes/ContactCTA';
import ZesFooter from './zes/Footer';
import BackToTop from './zes/BackToTop';
import WhatsAppButton from './zes/WhatsAppButton';

export const ZesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ZesHeader />
      <main className="flex-grow">
        <ZesHero />
        <Introduction />
        <NewsTicker />
        <ZesFlow />
        <AboutUs />
        <OperationalMap />
        <TertiaryFocus />
        <ZesComparisonTable />
        <EligibilityWizard />
        <StepsSection />
        <ProjectsGallery />
        <PartnersLogos />
        <OwnersSection />
        <RoiCalculator />
        <ZesTestimonials />
        <FAQSection />
        <ZesLeadMagnet />
        <ContactCTA />
      </main>
      <ZesFooter />
      <BackToTop />
      <WhatsAppButton />
    </div>
  );
};
