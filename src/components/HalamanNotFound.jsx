import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import Container from "./container";

const HalamanNotFound = () => {
  const navigate = useNavigate();
 
  return (
    <Container>
      <div className="flex justify-center items-center min-h-screen bg-gray-white p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardContent className="flex flex-col items-center space-y-6 py-10">
            <AlertTriangle className="text-red-500" size={60} />
            <h1 className="text-4xl font-bold text-gray-800">404</h1>
            <p className="text-lg text-gray-600">
              Halaman yang kamu cari tidak ditemukan.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4 border hover:bg-red-800 hover:text-white transition-all"
            >
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default HalamanNotFound;
