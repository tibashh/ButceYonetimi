import React, { useState } from 'react';
import { Card, Input, Button, Typography } from 'antd';

const { Text } = Typography;

const ProfileInfo = ({ profile, isEditingProfile, editedProfile, isLoading, onEditProfile, onCancelEditProfile, onSaveProfile, onProfileInputChange }) => {
  return (
    <Card title="Profil" extra={<Button onClick={onEditProfile}>Edit</Button>}>
      <Text strong>Name:</Text>
      {isEditingProfile ? (
        <Input name="name" value={editedProfile.name} onChange={onProfileInputChange} />
      ) : (
        <Text>{profile.name}</Text>
      )}
      <br />
      <Text strong>Email:</Text>
      {isEditingProfile ? (
        <Input name="email" value={editedProfile.email} onChange={onProfileInputChange} />
      ) : (
        <Text>{profile.email}</Text>
      )}
      {isEditingProfile && (
        <>
          <Text strong>Current Password:</Text>
          <Input type="password" name="currentPassword" value={editedProfile.currentPassword} onChange={onProfileInputChange} />
          <br />
          <Text strong>New Password:</Text>
          <Input type="password" name="newPassword" value={editedProfile.newPassword} onChange={onProfileInputChange} />
          <Button onClick={onSaveProfile} style={{ marginTop: 16 }} loading={isLoading}>
            {isLoading ? 'Saving' : 'Save'}
          </Button>
          <Button onClick={onCancelEditProfile} danger style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </>
      )}
    </Card>
  );
};

export default ProfileInfo;
