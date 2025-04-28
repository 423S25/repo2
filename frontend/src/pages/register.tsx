 import React, { useState, ChangeEvent, FormEvent } from "react";
 import { useNavigate, } from 'react-router-dom';
 import { TextInput, PasswordInput, Button, Card, Title, Stack, Container } from "@mantine/core";
 import { HeaderSimple } from "../components/header/Header";
 import { useAuth } from '../contexts/AuthContext';

 interface FormData {
   username: string;
   email: string;
   password: string;
   confirmPassword: string;
 }

 const UserRegistration: React.FC = () => {
  const navigate = useNavigate();
   const [formData, setFormData] = useState<FormData>({
     username: "",
     email: "",
     password: "",
     confirmPassword: "",
   });

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const { register } = useAuth();

   const handleSubmit = async (e: FormEvent) => {

       e.preventDefault();
    
       if (formData.password !== formData.confirmPassword) {
         alert("Passwords do not match");
         return;
       }
    
       const success = await register(
        formData.username,
        formData.email,
        formData.password
      );
    
      if (success) {
        alert("User registered successfully!");
        navigate("/dashboard");
      } else {
        alert("Registration failed.");
      }
     };
    

   return (
     <>
     <HeaderSimple toggleNav={function (): void {
         throw new Error("Function not implemented.");
       } } />
     <div className="flex flex-row mt-4 w-screen">
       <Container size={420} my={40} >
         <Card shadow="lg" padding="lg" radius="md" style={{ width: 500 }}>
         <Title order={2} mb="md" style={{ textAlign: 'center' }}></Title>
           <form onSubmit={handleSubmit}>
             <Stack gap="md">
               <TextInput
                 label="Username"
                 name="username"
                 placeholder="Enter your username"
                 value={formData.username}
                 onChange={handleChange}
                 required
               />
               <TextInput
                 label="Email"
                 name="email"
                 placeholder="Enter your email"
                 value={formData.email}
                 onChange={handleChange}
                 required
               />
               <PasswordInput
                 label="Password"
                 name="password"
                 placeholder="Enter your password"
                 value={formData.password}
                 onChange={handleChange}
                 required
               />
               <PasswordInput
                 label="Confirm Password"
                 name="confirmPassword"
                 placeholder="Confirm your password"
                 value={formData.confirmPassword}
                 onChange={handleChange}
                 required
               />
               <Button type="submit" fullWidth>
                 Register
               </Button>
             </Stack>
           </form>
         </Card>
       </Container>
     </div>
     </>
   );
 };
 export default UserRegistration;
