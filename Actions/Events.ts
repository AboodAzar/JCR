"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { EventsSchema } from "@/schemas";

export const createEventAction = async (values: z.infer<typeof EventsSchema>) => {

  const validatedFields = EventsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "! حقل غير صالح" };
  }

  const { name, StartDate, EndDate, type } = validatedFields.data;

  const existingEvent = await db.event.findFirst({
    where: { name, StartDate, EndDate, type },
  });
  if (existingEvent) {
    return { error: "فعالية موجود بالفعل" };
  }

  await db.event.create({
    data: {
      name,
      StartDate,
      EndDate,
      type
    },
  });



  return {
    success: "! تم انشاء فعالية",
  };
};
