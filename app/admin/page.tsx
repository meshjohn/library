import React from "react";
import StatsCard from "@/components/StatsCard";
import {
  getLatestBooks,
  getLatestUsersWithBorrowCount,
  getUsersPerDay,
} from "@/lib/actions/auth";
import ChartComponent from "@/components/ChartComponent";
import { getBookRequestsPerDay } from "@/lib/actions/book";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import UserAndBooksGrid from "@/components/UserAndBooksGrid";

const page = async () => {
  const data = await getUsersPerDay();
  const borrows = await getBookRequestsPerDay();
  const books = await getLatestBooks();
  const users = await getLatestUsersWithBorrowCount();
  console.log(books);
  console.log(users);

  const userAndBooks = [
    {
      title: "Latest Users",
      dataSource: users,
      field: "borrowCount",
      headerText: "Books Requested",
    },
    {
      title: "Latest Books",
      dataSource: books,
      field: "author",
      headerText: "Author",
    },
  ];

  return (
    <main>
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={3}
            lastMonthCount={0}
            currentMonthCount={3}
          />
          <StatsCard
            headerTitle="Total Books"
            total={16}
            lastMonthCount={8}
            currentMonthCount={15}
          />
          <StatsCard
            headerTitle="Active Users Today"
            total={3}
            lastMonthCount={5}
            currentMonthCount={3}
          />
        </div>
      </section>
      <section className="container"></section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartComponent data={data} id="chart-1" title="User Growth" />
        <ChartComponent data={borrows} id="chart-2" title="Borrow Requests" />
      </section>
      <section className="user-trip wrapper">
        <UserAndBooksGrid users={users} books={books} />
      </section>
    </main>
  );
};

export default page;
