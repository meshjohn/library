"use client";

import React from "react";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";

interface Props {
  users: { fullName: string; borrowCount: number }[];
  books: { title: string; author: string }[];
}

const UserAndBooksGrid: React.FC<Props> = ({ users, books }) => {
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
    <>
      {userAndBooks.map(({ title, dataSource, field, headerText }, i) => (
        <div className="flex flex-col gap-5" key={i}>
          <h3 className="p-20-semibold text-dark-100">{title}</h3>
          <GridComponent dataSource={dataSource} gridLines="None">
            <ColumnsDirective>
              <ColumnDirective
                field="fullName"
                headerText="Name"
                width="200"
                textAlign="Left"
                template={(props: any) => (
                  <div className="flex items-center gap-1.5 px-4">
                    <span>{props.fullName || props.title}</span>
                  </div>
                )}
              />
              <ColumnDirective
                field={field}
                headerText={headerText}
                width="150"
                textAlign="Left"
              />
            </ColumnsDirective>
          </GridComponent>
        </div>
      ))}
    </>
  );
};

export default UserAndBooksGrid;
