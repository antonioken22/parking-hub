import React, { useState } from "react";
import { doc, updateDoc, addDoc, deleteDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { toast } from "sonner";
import useVehicles from "@/hooks/useUserVehicles";
import useUserState from "@/hooks/useUserState"; // Import useUserState hook
import { VehicleData } from "@/types/UserVehicle";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { Accordion } from "@/components/ui/accordion";
import { AccordionItem } from "@/components/ui/accordion";
import { AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContent } from "@/components/ui/accordion";

const VehicleConfiguration: React.FC = () => {
  const { vehicles, loading, refetchVehicles } = useVehicles(); // Destructure refetchVehicles function
  const {
    userId,
    userFirstName,
    userLastName,
    userEmail,
    loading: userLoading,
  } = useUserState(); // Destructure user data from useUserState

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [color, setColor] = useState<string>("");
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");

  const [newColor, setNewColor] = useState<string>("");
  const [newLicensePlate, setNewLicensePlate] = useState<string>("");
  const [newModel, setNewModel] = useState<string>("");
  const [newVehicleType, setNewVehicleType] = useState<string>("");

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId) || null;
    setSelectedVehicle(vehicle);

    if (vehicle) {
      setColor(vehicle.color);
      setLicensePlate(vehicle.licensePlate);
      setModel(vehicle.model);
      setVehicleType(vehicle.vehicleType);
    } else {
      setColor("");
      setLicensePlate("");
      setModel("");
      setVehicleType("");
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
    } catch (error) {
      toast.error("Failed to update vehicle");
      console.error("Error updating vehicle:", error);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userId || !userFirstName || !userLastName || !userEmail) {
        throw new Error("User data incomplete. Cannot add vehicle.");
      }

      if (!newColor || !newLicensePlate || !newModel || !newVehicleType) {
        throw new Error("Please fill out all fields before adding a vehicle.");
      }

      await addDoc(collection(firestore, "vehicles"), {
        color: newColor,
        licensePlate: newLicensePlate,
        model: newModel,
        vehicleType: newVehicleType,
        userId: userId,
        ownerEmail: userEmail,
        ownerFirstName: userFirstName,
        ownerLastName: userLastName,
      });

      toast.success("Vehicle added successfully");

      // Reset form fields
      setNewColor("");
      setNewLicensePlate("");
      setNewModel("");
      setNewVehicleType("");
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

      // Refresh the list of vehicles after deletion
      refetchVehicles();
      
      // Clear selected vehicle and form fields
      setSelectedVehicle(null);
      setColor("");
      setLicensePlate("");
      setModel("");
      setVehicleType("");
    } catch (error) {
      toast.error("Failed to delete vehicle");
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <Card className="p-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="edit-vehicle">
          <AccordionTrigger>Edit Vehicle</AccordionTrigger>
          <AccordionContent>
            {loading ? (
              <p>Loading...</p>
            ) : vehicles.length > 0 ? (
              <div>
                <Label>Select a vehicle</Label>
                <Select onValueChange={(value) => handleVehicleSelect(value)}>
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

                {selectedVehicle && (
                  <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
                    <div>
                      <Label>Color</Label>
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>License Plate</Label>
                      <Input
                        type="text"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Model</Label>
                      <Input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Vehicle Type</Label>
                      <Input
                        type="text"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                      />
                    </div>
                    <Button type="submit">Update Vehicle</Button>
                    <Button type="button" onClick={handleDeleteVehicle} className="ml-2 bg-red-500 text-white">
                      Delete Vehicle
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <p>No vehicles available</p>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="add-vehicle">
          <AccordionTrigger>Add Vehicle</AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <Label>Color</Label>
                <Input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                />
              </div>
              <div>
                <Label>License Plate</Label>
                <Input
                  type="text"
                  value={newLicensePlate}
                  onChange={(e) => setNewLicensePlate(e.target.value)}
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input
                  type="text"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                />
              </div>
              <div>
                <Label>Vehicle Type</Label>
                <Input
                  type="text"
                  value={newVehicleType}
                  onChange={(e) => setNewVehicleType(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!newColor || !newLicensePlate || !newModel || !newVehicleType}>
                Add Vehicle
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default VehicleConfiguration;
