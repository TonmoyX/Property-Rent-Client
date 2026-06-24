import PropertyDetailsPage from '@/component/PropertiesDetailsPage';
import React from 'react';

export const metadata = {
  title: "PropRent - Property Details",
  description: "Property details page for PropRent, providing comprehensive information about each available property.",
};

const PropertiesDetailsPage = () => {
  return (
    <div>
      <PropertyDetailsPage></PropertyDetailsPage>
    </div>
  );
};

export default PropertiesDetailsPage;