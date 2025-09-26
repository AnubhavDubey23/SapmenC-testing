import dynamic from 'next/dynamic';
import React from 'react';

const Tour = dynamic(() => import('reactour'), { ssr: false });

type ProductTourProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export default function ProductTour({
  isOpen,
  onRequestClose,
}: ProductTourProps) {
  return (
    <Tour
      key={'product-tour'}
      steps={[
        {
          selector: '.Createsegment',
          content: 'Click here to create a new segment',
        },
        {
          selector: '.CreateTemplate',
          content: 'Click here to create a new template',
        },
      ]}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  );
}
