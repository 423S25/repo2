 import React, { useState, ChangeEvent, FormEvent } from "react";
 import { TextInput, PasswordInput, Button, Card, Title, Stack, Container } from "@mantine/core";
 import { HeaderSimple } from "../components/header/Header";
 import { baseURL } from "../App";

 interface FormData {
   username: string;
   email: string;
   password: string;
   confirmPassword: string;
 }

 const UserRegistration: React.FC = () => {
   const [formData, setFormData] = useState<FormData>({
     username: "",
     email: "",
     password: "",
     confirmPassword: "",
   });

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e: FormEvent) => {

       e.preventDefault();
    
       if (formData.password !== formData.confirmPassword) {
         alert("Passwords do not match");
         return;
       }
    
       try {
         const response = await fetch(`${baseURL}/api/register`, {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({
             username: formData.username,
             email: formData.email,
             password: formData.password,
           }),
         });
    
         if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.error || "Registration failed");
         }
    
         const result = await response.json();
         console.log("Success:", result);
         alert("User registered successfully!");
       } catch (error: any) {
         console.error("Error:", error.message);
         alert("Error: " + error.message);
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
