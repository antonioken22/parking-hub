"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ArrowUpDown, Monitor } from "lucide-react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
import useUserState from "@/hooks/useUserState";
import useUsers from "@/hooks/useUsers";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SendPushNotificationCard from "./_components/send-push-notif-card";

const BookingAdminPage = () => {
  const { loading: authLoading, userRole } = useUserState();
  const router = useRouter();

  // Push to /dashboard if not admin
  useEffect(() => {
    if (!authLoading && userRole !== "admin") {
      router.push("/dashboard");
    }
  }, [authLoading, userRole, router]);

  const { users, updateBookingStatuses } = useUsers();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<{
    [key: string]: boolean;
  }>({});
  const [localUsers, setLocalUsers] = useState(users);
  const [showNotificationCard, setShowNotificationCard] = useState(false);
  const [selectedFcmToken, setSelectedFcmToken] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedFirstName, setSelectedFirstName] = useState<string | null>(
    null
  );
  const [selectedLastName, setSelectedLastName] = useState<string | null>(null);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleDropdownChange = (userId: string, value: boolean) => {
    setLocalUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isBooked: value } : user
      )
    );
  };

  const handleSaveChanges = async () => {
    await updateBookingStatuses(localUsers);
  };

  const handleNotifyClick = (
    fcmToken: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null
  ) => {
    setSelectedEmail(email);
    setSelectedFcmToken(fcmToken);
    setSelectedFirstName(firstName);
    setSelectedLastName(lastName);
    setShowNotificationCard(true);
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ cell }) => (
        <div className="w-[128px]">{cell.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ cell }) => (
        <div className="w-[128px]">{cell.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "fcmSwToken",
      header: "FCM Token",
      cell: ({ cell }) => (
        <div className="truncate w-[200px]">{cell.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "isBooked",
      header: "Booking Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <select
            value={row.original.isBooked ? "true" : "false"}
            onChange={(e) =>
              handleDropdownChange(row.original.id, e.target.value === "true")
            }
          >
            <option value="true">Booked</option>
            <option value="false">Not Booked</option>
          </select>
          <Button
            variant="outline"
            className="ml-2"
            onClick={() =>
              handleNotifyClick(
                row.original.fcmSwToken,
                row.original.email,
                row.original.firstName,
                row.original.lastName
              )
            }
          >
            Notify
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: localUsers,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (authLoading || userRole !== "admin") {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!authLoading && userRole === "admin" && (
        <div>
          <div className="flex items-center gap-x-3 mr-auto pl-4">
            <Monitor className="w-10 h-10 text-primary" />
            <div>
              <Heading
                title="User Monitor"
                description="Viewing all user data."
              />
            </div>
          </div>
          <div className="px-4 lg:px-8 space-y-4 pt-8">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter emails..."
                value={
                  (table.getColumn("email")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("email")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: <ArrowUpDown className="ml-2 h-4 w-4" />,
                                desc: <ArrowUpDown className="ml-2 h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Button
              onClick={handleSaveChanges}
              className="flex flex-col mt-4 ml-auto text-xs md:text-base"
            >
              Save Changes
            </Button>
          </div>
          {showNotificationCard &&
            selectedFcmToken &&
            selectedEmail &&
            selectedFirstName &&
            selectedLastName && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <SendPushNotificationCard
                  token={selectedFcmToken}
                  email={selectedEmail}
                  firstName={selectedFirstName}
                  lastName={selectedLastName}
                  onClose={() => setShowNotificationCard(false)}
                />
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default BookingAdminPage;
