import React from 'react';
import CarSection from '../components/common/CarSection';

type Props = {
  id: string;
};

const CustomerSection = ({ id }: Props) => {
  return <CarSection mainType={'deal'} mainTypeId={id} />;
};

export default CustomerSection;
