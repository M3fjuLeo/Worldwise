import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="back"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
};

export default BackButton;
