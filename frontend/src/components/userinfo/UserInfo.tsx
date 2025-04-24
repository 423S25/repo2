import { Avatar, Button, Card,  Text, TextInput } from '@mantine/core';
import classes from './UserInfo.module.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { notifications } from '@mantine/notifications';


export function UserCard() {
  const userContext = useContext(AuthContext);
  const [username, setUserName]= useState(userContext?.user?.username);
  const [email, setEmail]= useState(userContext?.user?.email);
  const [usernametemp, setUserNameTemp]= useState(userContext?.user?.username);
  const [emailTemp, setEmailTemp]= useState(userContext?.user?.email);
  // const stats = [
  //   { value: userContext?.user?.email, label: 'Email' },
  // ];
  // const items = stats.map((stat) => (
  //   <div key={stat.label}>
  //     <Text ta="center" fz="lg" fw={500}>
  //       {stat.value}
  //     </Text>
  //     <Text ta="center" fz="sm" c="dimmed" lh={1}>
  //       {stat.label}
  //     </Text>
  //   </div>
  // ));
  let avatarUrl = "volunteer.png";
  if (userContext?.user?.staff){
    avatarUrl = "staff.png";
  }
  if (userContext?.user?.superuser){
    avatarUrl = "admin.png";
  }


  const updateValues = () => {
    setUserName(usernametemp)
    setEmail(emailTemp)
    notifications.show({
      title : "User updated",
      message : "Your user profile was updated successfully!"
    })
  }

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Card.Section
        h={140}
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?cs=srgb&dl=pexels-thatguycraig000-1563356.jpg&fm=jpg)',
        }}
      />
      <Avatar
        src={avatarUrl}
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {username}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {email}
      </Text>
      <TextInput
        className="mt-2"
        label="Update User Name"
        placeholder="Enter in new username"
        onChange={(e) => {setUserNameTemp(e.target.value)}}
      />
      <TextInput
        className="mt-2"
        label="Update Email"
        placeholder="Enter in new email"
        onChange={(e) => {setEmailTemp(e.target.value)}}
      />
      <Button className="mt-2" onClick={() => updateValues()}>
        Update Profile
      </Button>

      
    </Card>
  );
}
