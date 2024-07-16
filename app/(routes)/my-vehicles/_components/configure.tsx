import React, { useState } from "react";
import { doc, updateDoc, addDoc, deleteDoc, collection } from "firebase/firestore";
import { firestore, auth } from "@/firebase/config";
import { toast } from "sonner";
import useVehicles from "@/hooks/useUserVehicles";
import useUserState from "@/hooks/useUserState";
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
  const { vehicles } = useVehicles();
  const { userFirstName, userLastName, userEmail } = useUserState();

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
      const user = auth.currentUser;
      if (!user) {
        toast.error("User is not authenticated");
        return;
      }

      await addDoc(collection(firestore, "vehicles"), {
        ownerId: user.uid,
        color: newColor,
        licensePlate: newLicensePlate,
        model: newModel,
        vehicleType: newVehicleType,
        ownerEmail: userEmail,
        ownerFirstName: userFirstName,
        ownerLastName: userLastName,
      });

      toast.success("Vehicle added successfully");
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
    <div className="p-4 space-y-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Update Vehicle</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Update Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="vehicle">Select Vehicle:</Label>
                      <Select
                        onValueChange={handleVehicleSelect}
                        value={selectedVehicle?.id || ""}
                      >
                        <SelectTrigger className="w-full">
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

                    <Button type="submit">Update Vehicle</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Add Vehicle</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Add Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSubmit}>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="newColor">Color:</Label>
                      <Input
                        id="newColor"
                        type="text"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="newLicensePlate">License Plate:</Label>
                      <Input
                        id="newLicensePlate"
                        type="text"
                        value={newLicensePlate}
                        onChange={(e) => setNewLicensePlate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="newModel">Model:</Label>
                      <Input
                        id="newModel"
                        type="text"
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="newVehicleType">Vehicle Type:</Label>
                      <Input
                        id="newVehicleType"
                        type="text"
                        value={newVehicleType}
                        onChange={(e) => setNewVehicleType(e.target.value)}
                      />
                    </div>

                    <Button type="submit">Add Vehicle</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Delete Vehicle</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Delete Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="vehicle">Select Vehicle:</Label>
                    <Select
                      onValueChange={handleVehicleSelect}
                      value={selectedVehicle?.id || ""}
                    >
                      <SelectTrigger className="w-full">
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

                  <Button type="button" onClick={handleDeleteVehicle} variant="destructive">Delete Vehicle</Button>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default VehicleConfiguration;
