"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ArrowUpDown,
  Monitor,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
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
import ComboboxBookingStatus from "./_components/combobox-booking-status";
import useUserState from "@/hooks/useUserState";
import useUsers from "@/hooks/useUsers";

const UserMonitorPage = () => {
  const { loading: authLoading, userRole } = useUserState();
  const router = useRouter();

  // Push to /dashboard if not admin
  useEffect(() => {
    if (!authLoading && userRole !== "admin" && userRole !== "manager") {
      router.push("/dashboard");
    }
  }, [authLoading, userRole, router]);
  // Consider devices with width less than or equal to 768px as mobile
  const isMobile = window.innerWidth <= 768;
  const { users, updateBookingStatuses } = useUsers();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<{
    [key: string]: boolean;
  }>({});
  const [localUsers, setLocalUsers] = useState(users);
  const [showNotificationCard, setShowNotificationCard] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFcmToken, setSelectedFcmToken] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedFirstName, setSelectedFirstName] = useState<string | null>(
    null
  );
  const [selectedLastName, setSelectedLastName] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6, // Default number of rows to be displayed
  });

useEffect(() => {
    // Update pageSize when on mobile view
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageSize: isMobile ? 4 : 6,
    }));
  }, [isMobile]);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  // Only changes user's isBooked state
  const handleDropdownChange = (userId: string, value: boolean) => {
    setLocalUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === userId ? { ...user, isBooked: value } : user
      );
      return updatedUsers;
    });
  };

  const handleSaveChanges = async () => {
    await updateBookingStatuses(localUsers);
  };

  const handleNotifyClick = (
    id: string | null,
    fcmToken: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null
  ) => {
    setSelectedId(id);
    setSelectedEmail(email);
    setSelectedFcmToken(fcmToken);
    setSelectedFirstName(firstName);
    setSelectedLastName(lastName);
    setShowNotificationCard(true);
  };

  const columns: ColumnDef<any>[] = [
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
      accessorKey: "pushNotificationStatus",
      header: "Push Notification Status",
      cell: ({ cell }) => <div>{cell.getValue() ? "Allowed" : "Disabled"}</div>,
    },
    {
      accessorKey: "isBooked",
      header: "Booking Status",
      cell: ({ row }) => (
        <ComboboxBookingStatus
          userId={row.original.id}
          value={row.original.isBooked}
          onChange={handleDropdownChange}
        />
      ),
    },
    {
      id: "notify",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div>
          <Button
            variant="outline"
            className="ml-2"
            onClick={() =>
              handleNotifyClick(
                row.original.id,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Pagination
    manualPagination: false, // False for automatic pagination
    pageCount: Math.ceil(localUsers.length / pagination.pageSize),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (authLoading || (userRole !== "admin" && userRole !== "manager")) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!authLoading && (userRole === "admin" || userRole === "manager") && (
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
                                  ? "cursor-pointer select-none flex items-center"
                                  : // Ensure consistent alignment
                                    "flex items-center",

                                onClick: header.column.getCanSort()
                                  ? header.column.getToggleSortingHandler()
                                  : // Disable click handler if sorting is disabled
                                    undefined,
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {
                                // Conditionally render sorting icon
                                header.column.getCanSort() && (
                                  <div className="ml-2 h-4 w-4">
                                    {{
                                      asc: <ArrowDown className="h-4 w-4" />,
                                      desc: <ArrowUp className="h-4 w-4" />,
                                    }[
                                      header.column.getIsSorted() as string
                                    ] ?? <ArrowUpDown className="h-4 w-4" />}
                                  </div>
                                )
                              }
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
            <div className="pagination">
              <Button
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className=""
              >
                Previous
              </Button>
              <span className="mx-2 text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>

            <Button
              onClick={handleSaveChanges}
              className="flex flex-col mt-4 ml-auto text-xs md:text-base"
            >
              Save Changes
            </Button>
          </div>
          {showNotificationCard &&
            selectedId &&
            selectedFcmToken &&
            selectedEmail &&
            selectedFirstName &&
            selectedLastName && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <SendPushNotificationCard
                  id={selectedId}
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

export default UserMonitorPage;
