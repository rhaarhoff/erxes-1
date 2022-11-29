import Form from '@erxes/ui/src/components/form/Form';
import Icon from '@erxes/ui/src/components/Icon';
import { ITimeclock } from '../types';
import { IFormProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import Button from '@erxes/ui/src/components/Button';
import React, { useEffect, useState } from 'react';
import { ControlLabel, FormGroup } from '@erxes/ui/src/components/form';
import SelectTeamMembers from '@erxes/ui/src/team/containers/SelectTeamMembers';

type Props = {
  startTime?: Date;
  queryParams: any;
  currentUserId: string;
  startClockTime: (userId: string) => void;
  stopClockTime: (userId: string, timeId: string) => void;
  timeclocks: ITimeclock[];
  shiftId: string;
  shiftStarted: boolean;
};

const FormComponent = ({
  startClockTime,
  stopClockTime,
  currentUserId,
  shiftId,
  shiftStarted
}: Props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userId, setUserId] = useState(currentUserId);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  const onTeamMemberSelect = memberId => {
    setUserId(memberId);
  };

  const startClock = () => {
    startClockTime(userId);
  };

  const stopClock = () => {
    stopClockTime(userId, shiftId);
  };

  const renderContent = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div style={{ display: 'block', fontSize: '26px', fontWeight: 500 }}>
          {currentTime.toLocaleTimeString()}
        </div>
        <div style={{ display: 'block', fontSize: '26px', fontWeight: 500 }}>
          <Button
            btnStyle="primary"
            onClick={shiftStarted ? stopClock : startClock}
          >
            <Icon icon="clock" style={{ display: 'block' }} />
            {shiftStarted ? 'Clock out' : 'Clock in'}
          </Button>
        </div>

        <div style={{ width: '60%' }}>
          <FormGroup>
            <ControlLabel>Team member</ControlLabel>
            <SelectTeamMembers
              label="Choose a team member"
              name="userId"
              initialValue={currentUserId}
              onSelect={onTeamMemberSelect}
              multi={false}
            />
          </FormGroup>
        </div>
      </div>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default FormComponent;
