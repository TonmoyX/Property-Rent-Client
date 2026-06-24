import AllProperties from '@/component/AllProperties';
import React from 'react';

export const metadata = {
  title: "PropRent  - AllProperties",
  description: "All Properties Page of PropRent, showcasing available properties for rent and sale.",
};

const AllPorpertiesPage = () => {
  return (
    <div>
      <AllProperties></AllProperties>
    </div>
  );
};

export default AllPorpertiesPage;