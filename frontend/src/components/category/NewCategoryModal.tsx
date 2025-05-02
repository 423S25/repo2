import { Button, Modal, TextInput } from "@mantine/core";
import APIRequest from "../../api/request";
import { baseURL } from "../../App";
import { useState } from "react";

interface CategoryModalInterface {
  opened : boolean;
  close : () => void;
  categories : string[];
  setCategories : React.Dispatch<React.SetStateAction<string[]>>  
}

const NewCategoryModal = ({opened, close, categories, setCategories} : CategoryModalInterface) =>{
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");


  const submitNewCategory = () => {
    if (category === ""){
      setError("Category cannot be blank");
      return;
    }
    const requester = new APIRequest(`${baseURL}/management/inventory/category/`);
    requester.post({
      "new_category" : category
    });
    setCategories([category, ...categories])
    setError("");
    setCategory("");
    close()
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add New Category">
        <TextInput
                mt="md"
                label="New Category Name"
                placeholder="Name"
                error={error}
                onChange={(e) => setCategory(e.target.value)}
              />
        <Button onClick={() => submitNewCategory()}>Submit New Category Name</Button>
      </Modal>
    </>
  )
}

export default NewCategoryModal
