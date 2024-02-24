"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transcription = {
  id: string
  name: string
  minutes: number
  status: "transcribing" | "completed"
}

export const columns: ColumnDef<Transcription>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "minutes",
    header: "Minutes",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
]
