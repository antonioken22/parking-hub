import React, { useState } from "react";
import {
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { firestore, auth } from "@/firebase/config";
import { toast } from "sonner";
import useVehicles from "@/hooks/useUserVehicles";
import useUserState from "@/hooks/useUserState";
import { VehicleData } from "@/types/UserVehicle";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VehicleConfiguration: React.FC = () => {
  const { vehicles } = useVehicles();
  const { userFirstName, userLastName, userEmail } = useUserState();

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(
    null
  );
  const [color, setColor] = useState<string>("");
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId) || null;
    setSelectedVehicle(vehicle);

    if (vehicle) {
      setColor(vehicle.color);
      setLicensePlate(vehicle.licensePlate);
      setModel(vehicle.model);
      setVehicleType(vehicle.vehicleType);
    } else {
      handleClearEntries();
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    try {
      const vehicleDocRef = doc(firestore, "vehicles", selectedVehicle.id);

      await updateDoc(vehicleDocRef, {
        color,
        licensePlate,
        model,
        vehicleType,
      });

      toast.success("Vehicle updated successfully");
      handleClearEntries();
    } catch (error) {
      toast.error("Failed to update vehicle");
      console.error("Error updating vehicle:", error);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User is not authenticated");
        return;
      }

      await addDoc(collection(firestore, "vehicles"), {
        ownerId: user.uid,
        color,
        licensePlate,
        model,
        vehicleType,
        ownerEmail: userEmail,
        ownerFirstName: userFirstName,
        ownerLastName: userLastName,
      });

      toast.success("Vehicle added successfully");
      handleClearEntries();
    } catch (error) {
      toast.error("Failed to add vehicle");
      console.error("Error adding vehicle:", error);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return;

    try {
      const vehicleDocRef = doc(firestore, "vehicles", selectedVehicle.id);

      await deleteDoc(vehicleDocRef);

      toast.success("Vehicle deleted successfully");
      handleClearEntries();
    } catch (error) {
      toast.error("Failed to delete vehicle");
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleClearEntries = () => {
    setSelectedVehicle(null);
    setColor("");
    setLicensePlate("");
    setModel("");
    setVehicleType("");
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="vehicle">Select Vehicle:</Label>
                <Select
                  onValueChange={handleVehicleSelect}
                  value={selectedVehicle?.id || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.licensePlate} - {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Color:</Label>
                <Input
                  id="color"
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="licensePlate">License Plate:</Label>
                <Input
                  id="licensePlate"
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="model">Model:</Label>
                <Input
                  id="model"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="vehicleType">Vehicle Type:</Label>
                <Input
                  id="vehicleType"
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex flex-col md:flex-row md:space-x-2 mb-4 md:mb-0">
                <Button
                  type="submit"
                  disabled={!selectedVehicle}
                  className="w-full md:w-auto"
                >
                  Update Vehicle
                </Button>
                <Button
                  type="button"
                  onClick={handleAddSubmit}
                  disabled={selectedVehicle !== null}
                  className="w-full md:w-auto mt-2 md:mt-0"
                >
                  Add Vehicle
                </Button>
                <Button
                  type="button"
                  disabled={!selectedVehicle}
                  onClick={handleDeleteVehicle}
                  className="w-full md:w-auto mt-2 md:mt-0"
                >
                  Delete Vehicle
                </Button>
                <Button
                  type="button"
                  onClick={handleClearEntries}
                  className="w-full md:w-auto mt-2 md:mt-0"
                >
                  Clear Entries
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleConfiguration;
